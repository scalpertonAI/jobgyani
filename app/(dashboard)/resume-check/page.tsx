"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, AlertCircle, TrendingUp, Lightbulb } from "lucide-react";
import type { ResumeAnalysis } from "@/lib/openai";
import Link from "next/link";

export default function ResumeCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type - accept PDF, DOCX, DOC, and TXT
      const fileName = selectedFile.name.toLowerCase();
      const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];

      if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
        setError('Please upload a PDF, DOCX, or TXT file');
        return;
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size is 10MB.');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze resume');
      }

      setAnalysis(result.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
        <p className="text-gray-600 mt-1">
          Get AI-powered feedback to improve your resume and beat ATS systems
        </p>
      </div>

      {!analysis ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Upload a PDF, DOCX, or TXT file. Optionally paste a job description to get tailored feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Resume File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {file ? (
                    <>
                      <FileText className="h-12 w-12 text-green-600 mb-2" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOCX, or TXT (Max 10MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Job Description (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description (Optional)
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get tailored feedback on how well your resume matches..."
                className="min-h-[120px]"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get keyword recommendations specific to this job posting
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                  {error.includes('Free resume check already used') && (
                    <Link href="/pricing" className="text-sm text-red-700 underline mt-2 inline-block">
                      Upgrade to Pro for unlimited checks
                    </Link>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Your resume will be analyzed using advanced AI to provide detailed feedback
            </p>
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
                    Here's your comprehensive resume analysis
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null);
                    setFile(null);
                    setJobDescription('');
                  }}
                >
                  Analyze Another
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* ATS Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                ATS Compatibility Score
              </CardTitle>
              <CardDescription>
                How well your resume will perform in Applicant Tracking Systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <Progress value={analysis.ats_score} className="h-4" />
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.ats_score}/100
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {analysis.ats_score >= 80 && "Excellent! Your resume is well-optimized for ATS systems."}
                {analysis.ats_score >= 60 && analysis.ats_score < 80 && "Good, but there's room for improvement."}
                {analysis.ats_score < 60 && "Your resume needs significant optimization to pass ATS filters."}
              </p>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Issues Found */}
          {analysis.issues && analysis.issues.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Issues Found
                </CardTitle>
                <CardDescription>
                  Problems that may hurt your chances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">
                        {index + 1}.
                      </span>
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Actionable steps to make your resume stand out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">
                      {index + 1}.
                    </span>
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Keyword Gaps */}
          {analysis.keyword_gaps && analysis.keyword_gaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
                <CardDescription>
                  {jobDescription
                    ? 'Keywords from the job description not found in your resume'
                    : 'Important keywords commonly found in job descriptions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyword_gaps.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Consider incorporating these keywords naturally into your resume
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setAnalysis(null);
                setFile(null);
                setJobDescription('');
              }}
            >
              Analyze Another Resume
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
