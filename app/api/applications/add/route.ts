import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const { company_name, job_title, job_description, status, applied_date, follow_up_date, notes } = body;

    if (!company_name || !job_title) {
      return NextResponse.json(
        { error: 'Company name and job title are required' },
        { status: 400 }
      );
    }

    // Insert application
    const { data: application, error: insertError } = await supabase
      .from('job_applications')
      .insert({
        user_id: user.id,
        company_name,
        job_title,
        job_description: job_description || null,
        status: status || 'applied',
        applied_date: applied_date || new Date().toISOString().split('T')[0],
        follow_up_date: follow_up_date || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting application:', insertError);
      return NextResponse.json(
        { error: 'Failed to add application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error('Error in add application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add application' },
      { status: 500 }
    );
  }
}
