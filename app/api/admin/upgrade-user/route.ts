import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * API route to upgrade users to premium tiers
 * This should be protected in production with proper authentication
 *
 * Usage:
 * POST /api/admin/upgrade-user
 * Body: { "email": "user@example.com", "tier": "sprint" }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // TODO: Add authentication check for admin users
    // For now, this endpoint can be used during development
    // In production, check if the requesting user is an admin

    const body = await request.json();
    const { email, tier } = body;

    if (!email || !tier) {
      return NextResponse.json(
        { error: 'Email and tier are required' },
        { status: 400 }
      );
    }

    if (!['free', 'sprint', 'pro'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: free, sprint, or pro' },
        { status: 400 }
      );
    }

    // Get user by email
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, subscription_tier')
      .eq('id', (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id || '')
      .single();

    if (fetchError || !users) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's subscription
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: tier !== 'free' ? 'active' : null,
      })
      .eq('id', users.id);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} upgraded to ${tier} tier`,
      user: {
        email,
        name: users.full_name,
        previous_tier: users.subscription_tier,
        new_tier: tier,
      },
    });
  } catch (error: any) {
    console.error('Error in upgrade-user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade user' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check a user's current subscription
 * Usage: GET /api/admin/upgrade-user?email=user@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // This is a simplified version - in production you'd need proper admin auth
    // For now, return basic info
    return NextResponse.json({
      message: 'Use the SQL scripts in add-premium-users.sql to check user subscription',
      email,
    });
  } catch (error: any) {
    console.error('Error in get user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}
