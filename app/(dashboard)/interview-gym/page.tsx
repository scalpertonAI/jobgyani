import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InterviewGymClient from "@/components/interview-gym/InterviewGymClient";
import UpgradePrompt from "@/components/UpgradePrompt";

export default async function InterviewGymPage() {
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
        feature="Interview Gym"
        description="Practice unlimited interview questions with AI feedback"
        benefits={[
          "Unlimited practice questions",
          "AI-powered feedback on every answer",
          "Audio response analysis",
          "Track your progress over time",
          "Custom question categories",
        ]}
      />
    );
  }

  // Fetch all questions for pro users
  const { data: questions } = await supabase
    .from("interview_questions")
    .select("*")
    .order("category", { ascending: true });

  // Fetch user's practice sessions
  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Interview Gym</h1>
        <p className="text-gray-600 mt-1">
          Practice unlimited interview questions and get instant AI feedback
        </p>
      </div>

      <InterviewGymClient questions={questions || []} sessions={sessions || []} />
    </div>
  );
}
