import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume } from '@/lib/openai';

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('Starting PDF extraction, buffer size:', buffer.length);

    if (buffer.length === 0) {
      throw new Error('Empty PDF buffer');
    }

    // Use require for CommonJS modules in Node.js environment
    const pdfParse = require('pdf-parse');

    // Parse the PDF
    const data = await pdfParse(buffer, {
      max: 0, // Parse all pages
    });

    console.log('PDF parsed successfully, text length:', data.text?.length || 0);
    console.log('Number of pages:', data.numpages);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF. The PDF might be image-based or empty.');
    }

    return data.text;
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    console.error('Error details:', error.message, error.stack);

    // Provide more helpful error messages
    if (error.message?.includes('Invalid PDF')) {
      throw new Error('Invalid or corrupted PDF file. Please try a different file.');
    } else if (error.message?.includes('encrypted')) {
      throw new Error('This PDF is password-protected. Please upload an unprotected version.');
    } else if (error.message?.includes('No text content')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to extract text from PDF. The file might be corrupted, image-based, or in an unsupported format. Try converting it to DOCX or TXT.');
    }
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    console.log('Starting DOCX extraction, buffer size:', buffer.length);

    if (buffer.length === 0) {
      throw new Error('Empty DOCX buffer');
    }

    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });

    console.log('DOCX parsed successfully, text length:', result.value?.length || 0);

    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text content found in DOCX. The document might be empty.');
    }

    return result.value;
  } catch (error: any) {
    console.error('Error parsing DOCX:', error);
    console.error('Error details:', error.message, error.stack);

    if (error.message?.includes('No text content')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to extract text from DOCX. The file might be corrupted or in an unsupported format. Try saving it as .docx (not .doc).');
    }
  }
}

async function extractTextFromPlainText(buffer: Buffer): Promise<string> {
  try {
    const text = buffer.toString('utf-8');
    console.log('Plain text extracted, length:', text.length);
    return text;
  } catch (error: any) {
    console.error('Error parsing plain text:', error);
    throw new Error('Failed to read text file.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Check user profile for free check usage
    const { data: profile } = await supabase
      .from('profiles')
      .select('free_resume_check_used, subscription_tier')
      .eq('id', user.id)
      .single();

    const isPro = profile?.subscription_tier === 'sprint' || profile?.subscription_tier === 'pro';

    // Check if user has already used free check
    if (!isPro && profile?.free_resume_check_used) {
      return NextResponse.json(
        { error: 'Free resume check already used. Upgrade to analyze more resumes.' },
        { status: 403 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Buffer created, size:', buffer.length);

    // Extract text based on file type
    let resumeText: string;
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.pdf')) {
        resumeText = await extractTextFromPDF(buffer);
      } else if (fileName.endsWith('.docx')) {
        resumeText = await extractTextFromDOCX(buffer);
      } else if (fileName.endsWith('.doc')) {
        // Old .doc format - try DOCX parser (works sometimes)
        resumeText = await extractTextFromDOCX(buffer);
      } else if (fileName.endsWith('.txt')) {
        resumeText = await extractTextFromPlainText(buffer);
      } else {
        return NextResponse.json(
          { error: 'Unsupported file format. Please upload PDF, DOCX, or TXT file.' },
          { status: 400 }
        );
      }
    } catch (extractError: any) {
      console.error('Text extraction failed:', extractError);
      return NextResponse.json(
        { error: extractError.message || 'Failed to extract text from file.' },
        { status: 400 }
      );
    }

    console.log('Text extracted, length:', resumeText.length);
    console.log('Text preview:', resumeText.substring(0, 200));

    // Validate extracted text (reduced minimum to 50 characters)
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          error: `Could not extract enough text from the file (found ${resumeText?.trim().length || 0} characters, need at least 50). The file might be image-based, empty, or corrupted. Try converting to a text-based format.`,
        },
        { status: 400 }
      );
    }

    // Analyze with OpenAI
    const analysis = await analyzeResume(resumeText, jobDescription || undefined);

    // Upload file to Supabase Storage
    const fileExt = fileName.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
    }

    // Save resume record
    const { error: insertError } = await supabase.from('resumes').insert({
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      analysis_results: analysis,
      is_free_check: !isPro,
    });

    if (insertError) {
      console.error('Database insert error:', insertError);
    }

    // Mark free check as used if this was a free user
    if (!isPro && !profile?.free_resume_check_used) {
      await supabase
        .from('profiles')
        .update({ free_resume_check_used: true })
        .eq('id', user.id);
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
