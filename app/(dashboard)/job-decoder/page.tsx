import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobDecoderClient from "@/components/job-decoder/JobDecoderClient";
import UpgradePrompt from "@/components/UpgradePrompt";

export default async function JobDecoderPage() {
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
        feature="Job Decoder"
        description="Decode job descriptions with AI to understand what employers really want"
        benefits={[
          "AI-powered analysis of job descriptions",
          "Identify key requirements and skills",
          "Get keyword recommendations",
          "Understand company culture signals",
          "Generate tailored application materials",
        ]}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Decoder</h1>
        <p className="text-gray-600 mt-1">
          Decode job descriptions to understand what employers really want
        </p>
      </div>

      <JobDecoderClient />
    </div>
  );
}
