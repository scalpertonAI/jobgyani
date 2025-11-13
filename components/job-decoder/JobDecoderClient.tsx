"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle2, AlertCircle, TrendingUp, Lightbulb, Target } from "lucide-react";

export default function JobDecoderClient() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/decode-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze job description");
      }

      setAnalysis(result.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze job description");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!analysis ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Paste Job Description
            </CardTitle>
            <CardDescription>
              Copy and paste the job description you want to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here...

Example:
We're looking for a Senior Software Engineer to join our team...
Requirements:
- 5+ years of experience with React and Node.js
- Strong understanding of system design
..."
              className="min-h-[300px]"
              disabled={loading}
            />

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
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() || loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Analyzing..." : "Decode Job Description"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Analysis Results */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-green-900">Analysis Complete!</CardTitle>
                  <CardDescription className="text-green-700">
                    Here's what we found in this job description
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null);
                    setJobDescription("");
                  }}
                >
                  Analyze Another
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Key Requirements */}
          {analysis.key_requirements && analysis.key_requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Key Requirements
                </CardTitle>
                <CardDescription>
                  The most important qualifications for this role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.key_requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Required Skills */}
          {analysis.required_skills && analysis.required_skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Technical and soft skills you should highlight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.required_skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nice to Have */}
          {analysis.nice_to_have && analysis.nice_to_have.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nice to Have</CardTitle>
                <CardDescription>
                  Additional qualifications that could set you apart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.nice_to_have.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Culture */}
          {analysis.culture_signals && (
            <Card>
              <CardHeader>
                <CardTitle>Company Culture Signals</CardTitle>
                <CardDescription>
                  What this job description tells us about the company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{analysis.culture_signals}</p>
              </CardContent>
            </Card>
          )}

          {/* Red Flags */}
          {analysis.red_flags && analysis.red_flags.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Potential Red Flags
                </CardTitle>
                <CardDescription>Things to ask about during the interview</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.red_flags.map((flag: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">!</span>
                      <span className="text-sm">{flag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Application Tips */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Application Tips
              </CardTitle>
              <CardDescription>
                How to tailor your application for this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.application_tips &&
                  analysis.application_tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">
                        {index + 1}.
                      </span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          {/* Salary Estimate */}
          {analysis.estimated_salary_range && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Estimated Salary Range
                </CardTitle>
                <CardDescription>
                  Based on the role level and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {analysis.estimated_salary_range}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This is an estimate and may vary by location and company
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setAnalysis(null);
                setJobDescription("");
              }}
            >
              Analyze Another Job
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              Save Analysis
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
