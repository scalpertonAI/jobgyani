"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Filter,
  RotateCcw,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string | null;
  sample_answer: string | null;
  tips: string[] | null;
}

interface Session {
  id: string;
  question_id: string;
  answer_text: string;
  ai_feedback: any;
  created_at: string;
}

interface Props {
  questions: Question[];
  sessions: Session[];
}

export default function InterviewGymClient({ questions, sessions }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = Array.from(new Set(questions.map((q) => q.category)));

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = !selectedCategory || q.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentQuestion(filteredQuestions[randomIndex]);
    setAnswer("");
    setFeedback(null);
    setError(null);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !answer.trim()) {
      setError("Please provide an answer");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answer: answer,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze answer");
      }

      setFeedback(result.feedback);
    } catch (err: any) {
      setError(err.message || "Failed to analyze answer");
    } finally {
      setLoading(false);
    }
  };

  const categoryColors: Record<string, string> = {
    behavioral: "bg-blue-100 text-blue-800",
    technical: "bg-green-100 text-green-800",
    problem_solving: "bg-purple-100 text-purple-800",
    leadership: "bg-orange-100 text-orange-800",
    culture: "bg-pink-100 text-pink-800",
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Practice Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Filters and New Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Question Filters
              </CardTitle>
              <Button onClick={getRandomQuestion} disabled={filteredQuestions.length === 0}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Random Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Difficulty</p>
              <div className="flex gap-2">
                <Button
                  variant={selectedDifficulty === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(null)}
                >
                  All
                </Button>
                {["easy", "medium", "hard"].map((diff) => (
                  <Button
                    key={diff}
                    variant={selectedDifficulty === diff ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {filteredQuestions.length} questions available
            </p>
          </CardContent>
        </Card>

        {/* Current Question */}
        {currentQuestion ? (
          <>
            <Card className="border-2 border-blue-600">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={categoryColors[currentQuestion.category] || "bg-gray-100"}>
                        {currentQuestion.category.replace("_", " ")}
                      </Badge>
                      {currentQuestion.difficulty && (
                        <Badge
                          variant={
                            currentQuestion.difficulty === "easy"
                              ? "secondary"
                              : currentQuestion.difficulty === "hard"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {currentQuestion.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.tips && currentQuestion.tips.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      Tips:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {currentQuestion.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Your Answer</label>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Aim for 2-3 paragraphs using the STAR method (Situation, Task, Action, Result)"
                    className="min-h-[200px]"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {answer.split(" ").filter((w) => w.length > 0).length} words
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Analyzing..." : "Get AI Feedback"}
                </Button>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            {feedback && (
              <Card className="border-2 border-green-600 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Brain className="h-5 w-5" />
                    AI Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Overall Score</span>
                      <span className="text-2xl font-bold text-green-600">
                        {feedback.score}/10
                      </span>
                    </div>
                    <Progress value={feedback.score * 10} className="h-3" />
                  </div>

                  {/* Strengths */}
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {feedback.improvements && feedback.improvements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {feedback.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">
                              {index + 1}.
                            </span>
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {feedback.summary && (
                    <div className="bg-white rounded-md p-4">
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-sm text-gray-700">{feedback.summary}</p>
                    </div>
                  )}

                  <Button onClick={getRandomQuestion} className="w-full">
                    Practice Another Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
              <p className="text-gray-600 mb-4">
                Click "Random Question" to get started with unlimited interview practice
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Recent Sessions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Practice</CardTitle>
            <CardDescription>Your last 10 practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <p className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                    {session.ai_feedback && (
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={session.ai_feedback.score * 10}
                          className="h-2 flex-1"
                        />
                        <span className="text-sm font-semibold">
                          {session.ai_feedback.score}/10
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No practice sessions yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Sessions</span>
              <span className="font-bold">{sessions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Questions Available</span>
              <span className="font-bold">{questions.length}</span>
            </div>
            {sessions.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Score</span>
                <span className="font-bold">
                  {(
                    sessions.reduce((acc, s) => acc + (s.ai_feedback?.score || 0), 0) /
                    sessions.length
                  ).toFixed(1)}
                  /10
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
