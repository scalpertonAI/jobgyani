import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeATSCompliance } from '@/lib/openai';

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('PDF extraction - buffer size:', buffer.length);
    const pdfParse = require('pdf-parse');

    const data = await pdfParse(buffer, {
      max: 0,
    });

    console.log('PDF parsed - pages:', data.numpages, 'text length:', data.text?.length);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    const cleanedText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return cleanedText;
  } catch (error: any) {
    console.error('PDF parsing error:', error.message);
    const debugMessage = `PDF parsing failed: ${error.message || 'Unknown error'}`;
    throw new Error(debugMessage);
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
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Analyzing ATS compliance for:', file.name);

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

    // Analyze ATS compliance
    const analysis = await analyzeATSCompliance(resumeText, jobDescription || undefined);

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error analyzing ATS compliance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze ATS compliance' },
      { status: 500 }
    );
  }
}
