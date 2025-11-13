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

    // Get request body
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    // Update application
    const { error: updateError } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user can only update their own applications

    if (updateError) {
      console.error('Error updating application:', updateError);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in update application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update application' },
      { status: 500 }
    );
  }
}
