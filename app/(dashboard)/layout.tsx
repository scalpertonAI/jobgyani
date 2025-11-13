import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Create profile if it doesn't exist (fallback)
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || '',
      subscription_tier: 'free',
      free_resume_check_used: false,
    });

    await supabase.from("user_streaks").insert({
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
    });

    // Fetch the newly created profile
    const result = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = result.data;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
