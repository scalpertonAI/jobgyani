import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume } from '@/lib/openai';

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // For now, return a placeholder. In production, use a PDF parsing library
  // or extract text on the client side before uploading
  return "PDF text extraction - implement with pdf-parse or similar library";
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // For now, return a placeholder. In production, use mammoth or similar
  return "DOCX text extraction - implement with mammoth or similar library";
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

    // Extract text based on file type
    let resumeText: string;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      resumeText = await extractTextFromPDF(buffer);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      resumeText = await extractTextFromDOCX(buffer);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload PDF or DOCX.' },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the file. Please check your resume.' },
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
