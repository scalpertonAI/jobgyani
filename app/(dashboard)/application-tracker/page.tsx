import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ApplicationTrackerClient from "@/components/application-tracker/ApplicationTrackerClient";
import UpgradePrompt from "@/components/UpgradePrompt";

export default async function ApplicationTrackerPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isPro = profile?.subscription_tier === "sprint" || profile?.subscription_tier === "pro";

  // Show upgrade prompt for free users
  if (!isPro) {
    return (
      <UpgradePrompt
        feature="Application Tracker"
        description="Track all your job applications and never miss a follow-up"
        benefits={[
          "Track unlimited job applications",
          "Automatic follow-up reminders",
          "Application status pipeline",
          "Interview scheduling",
          "AI-generated follow-up emails",
          "Analytics and insights",
        ]}
      />
    );
  }

  // Fetch user's applications
  const { data: applications } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-gray-600 mt-1">
          Track your job applications and manage your job search pipeline
        </p>
      </div>

      <ApplicationTrackerClient applications={applications || []} />
    </div>
  );
}
