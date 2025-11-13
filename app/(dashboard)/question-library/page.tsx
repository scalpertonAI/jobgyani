import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import QuestionLibraryClient from "@/components/question-library/QuestionLibraryClient";

export default async function QuestionLibraryPage() {
  const supabase = await createClient();

  // Fetch all questions
  const { data: questions } = await supabase
    .from("interview_questions")
    .select("*")
    .order("category", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Question Library</h1>
        <p className="text-gray-600 mt-1">
          Browse 100+ interview questions across different categories
        </p>
      </div>

      <QuestionLibraryClient questions={questions || []} />
    </div>
  );
}
