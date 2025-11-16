import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJobTailoredATSResume } from '@/lib/openai';

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer, { max: 0 });

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    return data.text;
  } catch (error: any) {
    throw new Error('Failed to extract text from PDF');
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text content found in DOCX');
    }

    return result.value;
  } catch (error: any) {
    throw new Error('Failed to extract text from DOCX');
  }
}

async function extractTextFromPlainText(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8');
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
    const jobDescription = formData.get('jobDescription') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!jobDescription || jobDescription.trim().length < 100) {
      return NextResponse.json(
        { error: 'Please provide a valid job description (at least 100 characters)' },
        { status: 400 }
      );
    }

    console.log('Generating job-tailored ATS resume for:', file.name);

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text based on file type
    let resumeText: string;
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.pdf')) {
        resumeText = await extractTextFromPDF(buffer);
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
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

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          error: `Could not extract enough text from the file. The file might be empty or corrupted.`,
        },
        { status: 400 }
      );
    }

    // Generate job-tailored ATS resume
    const result = await generateJobTailoredATSResume(resumeText, jobDescription);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error generating tailored resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate tailored resume' },
      { status: 500 }
    );
  }
}
