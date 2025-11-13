import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure profile exists (fallback if trigger didn't work)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || '',
          subscription_tier: 'free',
          free_resume_check_used: false,
        });

        // Create streak record
        await supabase.from('user_streaks').insert({
          user_id: data.user.id,
          current_streak: 0,
          longest_streak: 0,
        });
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return to origin with error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
