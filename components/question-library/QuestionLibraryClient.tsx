"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string | null;
  sample_answer: string | null;
  tips: string[] | null;
}

interface Props {
  questions: Question[];
}

export default function QuestionLibraryClient({ questions }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(questions.map((q) => q.category));
    return Array.from(cats);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || q.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [questions, search, selectedCategory, selectedDifficulty]);

  const categoryColors: Record<string, string> = {
    behavioral: "bg-blue-100 text-blue-800",
    technical: "bg-green-100 text-green-800",
    problem_solving: "bg-purple-100 text-purple-800",
    leadership: "bg-orange-100 text-orange-800",
    culture: "bg-pink-100 text-pink-800",
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
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

          {/* Difficulty Filter */}
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
            Showing {filteredQuestions.length} of {questions.length} questions
          </p>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={categoryColors[question.category] || "bg-gray-100"}>
                      {question.category.replace("_", " ")}
                    </Badge>
                    {question.difficulty && (
                      <Badge
                        variant={
                          question.difficulty === "easy"
                            ? "secondary"
                            : question.difficulty === "hard"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
                >
                  {expandedId === question.id ? "Hide Details" : "View Details"}
                </Button>
              </div>
            </CardHeader>

            {expandedId === question.id && (
              <CardContent className="space-y-4 border-t pt-4">
                {question.tips && question.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tips for answering:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {question.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {question.sample_answer && (
                  <div>
                    <h4 className="font-semibold mb-2">Sample Answer:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                      {question.sample_answer}
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}

        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No questions found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
