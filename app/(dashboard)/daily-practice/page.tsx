"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, CheckCircle2, TrendingUp, Target, Lightbulb } from "lucide-react";
import type { InterviewAnswerAnalysis } from "@/lib/openai";

interface DailyQuestion {
  id: string;
  question_id: string;
  assigned_date: string;
  answered: boolean;
  user_answer: string | null;
  ai_feedback: InterviewAnswerAnalysis | null;
  interview_questions: {
    question: string;
    category: string;
    difficulty: string;
    tips: string[];
  };
}

export default function DailyPracticePage() {
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<InterviewAnswerAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const fetchDailyQuestion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_questions")
        .select("*, interview_questions(*)")
        .eq("user_id", user.id)
        .eq("assigned_date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching daily question:", error);
        setError("Failed to load today's question");
        return;
      }

      if (data) {
        setDailyQuestion(data as any);
        if (data.answered && data.user_answer) {
          setAnswer(data.user_answer);
          setAnalysis(data.ai_feedback as InterviewAnswerAnalysis);
        }
      } else {
        setError("No question assigned for today. Come back tomorrow!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !dailyQuestion) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: dailyQuestion.question_id,
          answer: answer.trim(),
          dailyQuestionId: dailyQuestion.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit answer");
      }

      setAnalysis(result.analysis);
      setDailyQuestion({ ...dailyQuestion, answered: true, user_answer: answer });
    } catch (err: any) {
      setError(err.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today's question...</p>
        </div>
      </div>
    );
  }

  if (error && !dailyQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">No Question Available</CardTitle>
            <CardDescription className="text-orange-700">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600 mb-4">
              Daily questions are assigned automatically. Check back tomorrow for your next practice question!
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dailyQuestion) {
    return null;
  }

  const charCount = answer.length;
  const minChars = 100;
  const isAnswerTooShort = charCount < minChars;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Practice</h1>
          <p className="text-gray-600 mt-1">
            Answer today's question to build your interview skills and maintain your streak
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-orange-600">
            <Flame className="h-6 w-6" />
            <span className="text-2xl font-bold">Streak Building!</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className={dailyQuestion.answered ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={dailyQuestion.answered ? "success" : "default"}>
                  {dailyQuestion.interview_questions.category}
                </Badge>
                <Badge variant="secondary">
                  {dailyQuestion.interview_questions.difficulty}
                </Badge>
                {dailyQuestion.answered && (
                  <Badge variant="success" className="ml-auto">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">
                {dailyQuestion.interview_questions.question}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!dailyQuestion.answered && dailyQuestion.interview_questions.tips && (
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-sm text-blue-900">Tips for answering:</span>
              </div>
              <ul className="space-y-1">
                {dailyQuestion.interview_questions.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!dailyQuestion.answered ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Your Answer</label>
                  <span className={`text-xs ${isAnswerTooShort ? "text-orange-600" : "text-gray-500"}`}>
                    {charCount} / {minChars} min characters
                  </span>
                </div>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Remember to use the STAR method: Situation, Task, Action, Result."
                  className="min-h-[200px]"
                  disabled={submitting}
                />
                {isAnswerTooShort && charCount > 0 && (
                  <p className="text-xs text-orange-600">
                    Your answer seems a bit short. Try to provide more details for better feedback.
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={submitting || isAnswerTooShort || !answer.trim()}
                size="lg"
                className="w-full"
              >
                {submitting ? "Analyzing your answer..." : "Submit Answer"}
              </Button>
            </>
          ) : (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold mb-2">Your Answer:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{dailyQuestion.user_answer}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Feedback */}
      {analysis && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              AI Feedback & Analysis
            </CardTitle>
            <CardDescription>
              Here's how you did on this question
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confidence Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Confidence Score</span>
                <span className="text-2xl font-bold text-blue-600">{analysis.confidence_score}/10</span>
              </div>
              <Progress value={analysis.confidence_score * 10} className="h-3" />
            </div>

            {/* STAR Method */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
              {analysis.uses_star_method ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-orange-400 mt-0.5" />
              )}
              <div>
                <h4 className="font-semibold mb-1">STAR Method</h4>
                <p className="text-sm text-gray-600">
                  {analysis.uses_star_method
                    ? "Great! Your answer follows the STAR method structure."
                    : "Try to include Situation, Task, Action, and Result in your answer."}
                </p>
              </div>
            </div>

            {/* Length Check */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
              {analysis.length_appropriate ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-orange-400 mt-0.5" />
              )}
              <div>
                <h4 className="font-semibold mb-1">Answer Length</h4>
                <p className="text-sm text-gray-600">
                  {analysis.length_appropriate
                    ? "Your answer length is appropriate - not too short or too long."
                    : "Consider adjusting your answer length for better impact."}
                </p>
              </div>
            </div>

            {/* Filler Words */}
            {analysis.filler_words_count > 0 && (
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <h4 className="font-semibold mb-1 text-orange-900">Filler Words Detected</h4>
                <p className="text-sm text-orange-700">
                  Found {analysis.filler_words_count} filler word(s) (um, uh, like, etc.). Try to minimize these in actual interviews.
                </p>
              </div>
            )}

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvement Tips */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Improvement Tips
              </h4>
              <ul className="space-y-2">
                {analysis.improvement_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">{index + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 text-center">
                Great job completing today's practice! Come back tomorrow for your next question.
              </p>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/dashboard"}>
                  Back to Dashboard
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/question-library"}>
                  Browse More Questions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
