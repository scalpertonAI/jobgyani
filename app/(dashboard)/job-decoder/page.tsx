import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobDecoderClient from "@/components/job-decoder/JobDecoderClient";

export default async function JobDecoderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
