"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, AlertCircle, TrendingUp, Lightbulb, Download, Wand2, Target } from "lucide-react";
import type { ResumeAnalysis } from "@/lib/openai";
import Link from "next/link";
import { jsPDF } from "jspdf";

interface ATSAnalysis {
  missing_sections: string[];
  formatting_issues: string[];
  keyword_optimization: {
    missing_keywords: string[];
    weak_keywords: string[];
    strong_keywords: string[];
  };
  recommendations: string[];
  ats_compatibility_score: number;
}

interface ATSFormattedResume {
  formatted_resume: string;
  changes_made: string[];
  improvements: string[];
}

export default function ResumeCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingATS, setLoadingATS] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingTailored, setLoadingTailored] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
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

  const handleATSAnalysis = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoadingATS(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze ATS compliance');
      }

      setAtsAnalysis(result.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze ATS compliance');
    } finally {
      setLoadingATS(false);
    }
  };

  const handleGenerateATSResume = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoadingGenerate(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai/generate-ats-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate ATS resume');
      }

      const atsResult: ATSFormattedResume = result.result;

      // Download the formatted resume
      downloadResume(atsResult.formatted_resume, 'ATS_Formatted_Resume.pdf');

      // Show success message
      alert(`Resume converted successfully!\n\nChanges made:\n${atsResult.changes_made.slice(0, 3).join('\n')}\n\nDownloading...`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate ATS resume');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleGenerateTailoredResume = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 100) {
      setError('Please provide a job description (at least 100 characters) to tailor your resume');
      return;
    }

    setLoadingTailored(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription.trim());

      const response = await fetch('/api/ai/generate-tailored-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate tailored resume');
      }

      const tailoredResult: ATSFormattedResume = result.result;

      // Download the formatted resume
      downloadResume(tailoredResult.formatted_resume, 'Job_Tailored_ATS_Resume.pdf');

      // Show success message
      alert(`Resume tailored successfully!\n\nChanges made:\n${tailoredResult.changes_made.slice(0, 3).join('\n')}\n\nDownloading...`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate tailored resume');
    } finally {
      setLoadingTailored(false);
    }
  };

  const downloadResume = (content: string, filename: string) => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const leftMargin = 15;
      const rightMargin = 15;
      const maxLineWidth = pageWidth - leftMargin - rightMargin;

      let cursorY = 15;
      const bottomMargin = 15;

      // Helper function to check if we need a new page
      const checkPageBreak = (requiredSpace: number) => {
        if (cursorY + requiredSpace > pageHeight - bottomMargin) {
          doc.addPage();
          cursorY = 15;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, style: 'normal' | 'bold' = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', style);
        const lines = doc.splitTextToSize(text, maxWidth);

        lines.forEach((line: string, index: number) => {
          if (index > 0) {
            checkPageBreak(5);
          }
          doc.text(line, x, y + (index * 5));
        });

        return y + (lines.length * 5);
      };

      // Parse the resume content into sections
      const lines = content.split('\n');
      let currentSection = '';
      let isFirstLine = true;
      let nameDetected = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
          cursorY += 3; // Small spacing for empty lines
          continue;
        }

        // Detect if this is the name (first substantial line, usually all caps or title case)
        if (!nameDetected && isFirstLine && line.length > 2 && line.length < 50) {
          checkPageBreak(15);

          // Name - Large and bold
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(20, 20, 20);
          doc.text(line, leftMargin, cursorY);
          cursorY += 8;

          // Add a subtle line under the name
          doc.setDrawColor(100, 100, 100);
          doc.setLineWidth(0.3);
          doc.line(leftMargin, cursorY, pageWidth - rightMargin, cursorY);
          cursorY += 5;

          nameDetected = true;
          isFirstLine = false;
          continue;
        }

        isFirstLine = false;

        // Detect contact information (email, phone, address, LinkedIn)
        const isContactInfo = line.match(/@/) ||
                             line.match(/\(\d{3}\)/) ||
                             line.match(/\d{3}-\d{3}-\d{4}/) ||
                             line.match(/linkedin\.com/) ||
                             line.match(/github\.com/) ||
                             (line.length < 100 && i < 5 && (line.includes(',') || line.includes('|')));

        if (isContactInfo && cursorY < 50) {
          checkPageBreak(6);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);

          // Center align contact info or left align
          const contactLines = doc.splitTextToSize(line, maxLineWidth);
          contactLines.forEach((contactLine: string) => {
            doc.text(contactLine, leftMargin, cursorY);
            cursorY += 4.5;
          });
          cursorY += 2;
          continue;
        }

        // Detect section headers (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, etc.)
        const sectionHeaders = [
          'PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE',
          'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EXPERIENCE',
          'EDUCATION', 'ACADEMIC BACKGROUND',
          'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES',
          'CERTIFICATIONS', 'CERTIFICATES',
          'PROJECTS', 'KEY PROJECTS',
          'ACHIEVEMENTS', 'ACCOMPLISHMENTS',
          'LANGUAGES',
          'VOLUNTEER EXPERIENCE', 'VOLUNTEER WORK'
        ];

        const isSectionHeader = sectionHeaders.some(header =>
          line.toUpperCase() === header ||
          line.toUpperCase().startsWith(header + ':') ||
          (line.length < 50 && line === line.toUpperCase() && line.length > 3)
        );

        if (isSectionHeader) {
          checkPageBreak(12);
          cursorY += 4; // Extra space before section

          // Section header - Bold and larger with background
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 30, 30);

          // Add a subtle background rectangle
          doc.setFillColor(240, 240, 240);
          doc.rect(leftMargin - 2, cursorY - 5, maxLineWidth + 4, 7, 'F');

          doc.text(line, leftMargin, cursorY);
          cursorY += 8;

          currentSection = line;
          continue;
        }

        // Detect job titles or degree (bold formatting)
        const isJobTitle = line.match(/^[A-Z]/) &&
                          line.length < 80 &&
                          !line.startsWith('•') &&
                          !line.startsWith('-') &&
                          !line.match(/^\d+\./) &&
                          (line.includes('Engineer') ||
                           line.includes('Developer') ||
                           line.includes('Manager') ||
                           line.includes('Analyst') ||
                           line.includes('Director') ||
                           line.includes('Lead') ||
                           line.includes('Specialist') ||
                           line.includes('Bachelor') ||
                           line.includes('Master') ||
                           line.includes('Degree') ||
                           (i > 0 && lines[i+1]?.includes('|') || lines[i+1]?.match(/\d{4}/)));

        if (isJobTitle && currentSection.includes('EXPERIENCE') || currentSection.includes('EDUCATION')) {
          checkPageBreak(10);
          cursorY += 2;

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(40, 40, 40);
          const splitTitle = doc.splitTextToSize(line, maxLineWidth);
          splitTitle.forEach((titleLine: string) => {
            doc.text(titleLine, leftMargin, cursorY);
            cursorY += 5;
          });
          continue;
        }

        // Detect company/university and dates (italic)
        const hasDate = line.match(/\d{4}/) || line.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
        const hasPipe = line.includes('|');
        const isCompanyLine = (hasDate || hasPipe) && line.length < 100 && !line.startsWith('•') && !line.startsWith('-');

        if (isCompanyLine) {
          checkPageBreak(6);

          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(80, 80, 80);

          const splitCompany = doc.splitTextToSize(line, maxLineWidth);
          splitCompany.forEach((companyLine: string) => {
            doc.text(companyLine, leftMargin, cursorY);
            cursorY += 4.5;
          });
          cursorY += 1;
          continue;
        }

        // Detect bullet points
        const isBullet = line.startsWith('•') ||
                        line.startsWith('-') ||
                        line.startsWith('*') ||
                        line.match(/^\d+\./);

        if (isBullet) {
          checkPageBreak(7);

          // Remove bullet character and trim
          let bulletText = line.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(50, 50, 50);

          // Add custom bullet point
          doc.setFontSize(14);
          doc.text('•', leftMargin + 2, cursorY);

          // Add bullet text with proper indentation
          doc.setFontSize(10);
          const bulletLines = doc.splitTextToSize(bulletText, maxLineWidth - 8);
          bulletLines.forEach((bulletLine: string, idx: number) => {
            doc.text(bulletLine, leftMargin + 7, cursorY + (idx * 4.5));
          });
          cursorY += bulletLines.length * 4.5 + 1.5;
          continue;
        }

        // Regular paragraph text
        checkPageBreak(10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);

        const regularLines = doc.splitTextToSize(line, maxLineWidth);
        regularLines.forEach((regLine: string) => {
          doc.text(regLine, leftMargin, cursorY);
          cursorY += 4.5;
        });
        cursorY += 1;
      }

      // Add footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume Analysis & ATS Optimizer</h1>
        <p className="text-gray-600 mt-1">
          Get AI-powered feedback, ATS analysis, and generate optimized resumes tailored to your target job
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
                Job Description (Optional - Required for tailored resume)
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get tailored feedback on how well your resume matches..."
                className="min-h-[120px]"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get keyword recommendations specific to this job posting and generate a tailored resume
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
                    setAtsAnalysis(null);
                    setFile(null);
                    setJobDescription('');
                  }}
                >
                  Analyze Another
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* ATS Tools Section */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Wand2 className="h-5 w-5" />
                ATS Optimization Tools
              </CardTitle>
              <CardDescription className="text-blue-700">
                Generate ATS-optimized versions of your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleATSAnalysis}
                  disabled={loadingATS}
                  className="w-full"
                  variant="default"
                >
                  {loadingATS ? 'Analyzing...' : '📋 Detailed ATS Analysis'}
                </Button>

                <Button
                  onClick={handleGenerateATSResume}
                  disabled={loadingGenerate}
                  className="w-full"
                  variant="default"
                >
                  {loadingGenerate ? 'Generating...' : <><Download className="h-4 w-4 mr-2" />Convert to ATS Format</>}
                </Button>
              </div>

              {jobDescription.trim().length >= 100 && (
                <Button
                  onClick={handleGenerateTailoredResume}
                  disabled={loadingTailored}
                  className="w-full"
                  variant="outline"
                  size="lg"
                >
                  {loadingTailored ? 'Generating...' : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      <Download className="h-4 w-4 mr-2" />
                      Generate Job-Tailored ATS Resume
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Detailed ATS Analysis */}
          {atsAnalysis && (
            <>
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Detailed ATS Compatibility Analysis
                  </CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <Progress value={atsAnalysis.ats_compatibility_score} className="h-4" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {atsAnalysis.ats_compatibility_score}/100
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Missing Sections */}
                    {atsAnalysis.missing_sections.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          Missing Sections
                        </h4>
                        <ul className="space-y-2">
                          {atsAnalysis.missing_sections.map((section, idx) => (
                            <li key={idx} className="text-sm bg-red-50 p-2 rounded">
                              {section}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Formatting Issues */}
                    {atsAnalysis.formatting_issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          Formatting Issues
                        </h4>
                        <ul className="space-y-2">
                          {atsAnalysis.formatting_issues.map((issue, idx) => (
                            <li key={idx} className="text-sm bg-orange-50 p-2 rounded">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Keyword Optimization */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-sm">Keyword Optimization</h4>

                    {atsAnalysis.keyword_optimization.strong_keywords.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Strong Keywords (Keep these!)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.keyword_optimization.strong_keywords.map((keyword, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {atsAnalysis.keyword_optimization.weak_keywords.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          Weak Keywords (Need strengthening)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.keyword_optimization.weak_keywords.map((keyword, idx) => (
                            <Badge key={idx} className="bg-yellow-100 text-yellow-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {atsAnalysis.keyword_optimization.missing_keywords.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          Missing Keywords (Add these!)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.keyword_optimization.missing_keywords.map((keyword, idx) => (
                            <Badge key={idx} className="bg-red-100 text-red-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {atsAnalysis.recommendations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        ATS Optimization Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {atsAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm bg-blue-50 p-3 rounded flex items-start gap-2">
                            <span className="text-blue-600 font-bold">{idx + 1}.</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Original ATS Score */}
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
                setAtsAnalysis(null);
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
