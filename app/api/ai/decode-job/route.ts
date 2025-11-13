import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeJobDescription } from '@/lib/openai';

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

    // Check subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const isPro = profile?.subscription_tier === 'sprint' || profile?.subscription_tier === 'pro';

    if (!isPro) {
      return NextResponse.json(
        { error: 'This feature requires a Pro subscription' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription || jobDescription.trim().length < 100) {
      return NextResponse.json(
        { error: 'Please provide a valid job description (at least 100 characters)' },
        { status: 400 }
      );
    }

    // Analyze with OpenAI
    const analysis = await analyzeJobDescription(jobDescription);

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error decoding job:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to decode job description' },
      { status: 500 }
    );
  }
}
