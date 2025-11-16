import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface InterviewAnswerAnalysis {
  uses_star_method: boolean;
  confidence_score: number; // 1-10
  filler_words_count: number;
  length_appropriate: boolean;
  improvement_tips: string[];
  strengths: string[];
}

export async function analyzeInterviewAnswer(
  question: string,
  answer: string
): Promise<InterviewAnswerAnalysis> {
  const prompt = `You are an expert interview coach. Analyze this interview answer and provide detailed feedback.

Question: "${question}"

Answer: "${answer}"

Evaluate the answer based on these criteria:
1. Does it use the STAR method (Situation, Task, Action, Result)?
2. Confidence level (1-10, based on specificity and clarity)
3. Count of filler words (um, uh, like, you know, etc.)
4. Is the length appropriate? (Not too short or too long)
5. Provide 3-5 specific improvement tips
6. Identify 2-3 strengths in the answer

Respond in JSON format with this exact structure:
{
  "uses_star_method": boolean,
  "confidence_score": number,
  "filler_words_count": number,
  "length_appropriate": boolean,
  "improvement_tips": ["tip1", "tip2", "tip3"],
  "strengths": ["strength1", "strength2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert interview coach. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export interface ResumeAnalysis {
  ats_score: number; // 0-100
  issues: string[];
  suggestions: string[];
  keyword_gaps: string[];
  strengths: string[];
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  const prompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.

Analyze this resume and provide comprehensive feedback.

Resume content:
${resumeText}

${jobDescription ? `Job Description to tailor for:\n${jobDescription}\n` : ''}

Provide:
1. ATS Compatibility Score (0-100) based on formatting, keywords, and structure
2. Top 5-7 issues found (formatting, content, missing elements)
3. Specific improvement suggestions (5-7 actionable items)
4. ${jobDescription ? 'Missing keywords from the job description' : 'General keyword recommendations'}
5. 2-3 strengths in the resume

Respond in JSON format with this exact structure:
{
  "ats_score": number,
  "issues": ["issue1", "issue2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "keyword_gaps": ["keyword1", "keyword2", ...],
  "strengths": ["strength1", "strength2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume reviewer and ATS specialist. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export interface JobDescriptionAnalysis {
  key_requirements: string[];
  required_skills: string[];
  nice_to_have: string[];
  red_flags: string[];
  culture_signals: string;
  application_tips: string[];
  estimated_salary_range: string;
}

export async function analyzeJobDescription(
  jobDescription: string
): Promise<JobDescriptionAnalysis> {
  const prompt = `You are an expert job market analyst. Analyze this job description and extract key information.

Job Description:
${jobDescription}

Provide:
1. Key requirements (5-7 most important qualifications)
2. Required technical and soft skills (as individual keywords/skills)
3. Nice-to-have skills (bonus qualifications)
4. Any red flags in the posting
5. What the job posting signals about company culture (1-2 sentences)
6. 5-7 application tips for tailoring resume/cover letter
7. Estimated salary range in INR (as a readable string like "₹15-25 LPA")

Respond in JSON format with this exact structure:
{
  "key_requirements": ["requirement1", "requirement2", ...],
  "required_skills": ["skill1", "skill2", ...],
  "nice_to_have": ["skill1", "skill2", ...],
  "red_flags": ["flag1", "flag2", ...],
  "culture_signals": "string description of culture",
  "application_tips": ["tip1", "tip2", ...],
  "estimated_salary_range": "₹X-Y LPA"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert job market analyst. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export interface ATSAnalysis {
  missing_sections: string[];
  formatting_issues: string[];
  keyword_optimization: {
    missing_keywords: string[];
    weak_keywords: string[];
    strong_keywords: string[];
  };
  recommendations: string[];
  ats_compatibility_score: number; // 0-100
}

export async function analyzeATSCompliance(
  resumeText: string,
  jobDescription?: string
): Promise<ATSAnalysis> {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume for ATS compatibility.

Resume content:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Provide detailed ATS analysis:
1. Missing sections (e.g., Summary, Skills, Experience, Education, Certifications, Projects)
2. Formatting issues (e.g., tables, columns, graphics, special characters, inconsistent formatting)
3. Keyword optimization:
   - Missing keywords ${jobDescription ? 'from the job description' : 'that are industry-standard'}
   - Weak keywords (present but need strengthening)
   - Strong keywords (already optimized)
4. Specific recommendations to improve ATS score (5-7 actionable items)
5. Overall ATS compatibility score (0-100)

Respond in JSON format with this exact structure:
{
  "missing_sections": ["section1", "section2", ...],
  "formatting_issues": ["issue1", "issue2", ...],
  "keyword_optimization": {
    "missing_keywords": ["keyword1", "keyword2", ...],
    "weak_keywords": ["keyword1", "keyword2", ...],
    "strong_keywords": ["keyword1", "keyword2", ...]
  },
  "recommendations": ["rec1", "rec2", ...],
  "ats_compatibility_score": number
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an ATS expert. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export interface ATSFormattedResume {
  formatted_resume: string; // Plain text ATS-friendly resume
  changes_made: string[];
  improvements: string[];
}

export async function generateATSResume(
  resumeText: string
): Promise<ATSFormattedResume> {
  const prompt = `You are an expert resume writer specializing in ATS-optimized resumes.

Original resume:
${resumeText}

Convert this resume into an ATS-friendly format following these rules:
1. Use simple, clean formatting (no tables, columns, or graphics)
2. Use standard section headings (Summary, Skills, Experience, Education, Certifications, Projects)
3. Use standard fonts and bullet points
4. Optimize keywords naturally (no keyword stuffing)
5. Use clear date formats (MM/YYYY)
6. Include measurable achievements with metrics
7. Keep reverse chronological order
8. Remove any special characters or symbols that ATS might not parse
9. Use standard job titles and industry terminology
10. Ensure consistent formatting throughout

Provide:
1. The complete ATS-formatted resume in plain text
2. List of changes made
3. List of improvements for better ATS parsing

Respond in JSON format with this exact structure:
{
  "formatted_resume": "complete resume text",
  "changes_made": ["change1", "change2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume writer specializing in ATS optimization. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export async function generateJobTailoredATSResume(
  resumeText: string,
  jobDescription: string
): Promise<ATSFormattedResume> {
  const prompt = `You are an expert resume writer specializing in ATS-optimized, job-tailored resumes.

Original resume:
${resumeText}

Job Description:
${jobDescription}

Convert this resume into an ATS-friendly format tailored to this specific job description, following these rules:
1. Use simple, clean formatting (no tables, columns, or graphics)
2. Use standard section headings (Summary, Skills, Experience, Education, Certifications, Projects)
3. Incorporate relevant keywords from the job description naturally
4. Highlight experience and skills that match the job requirements
5. Reframe achievements to align with the job's focus areas
6. Use metrics and quantifiable results where possible
7. Adjust the professional summary to match the role
8. Prioritize relevant skills from the job description
9. Keep reverse chronological order
10. Ensure ATS-friendly formatting throughout

Provide:
1. The complete ATS-formatted, job-tailored resume in plain text
2. List of changes made to align with the job description
3. List of improvements for better ATS parsing and job matching

Respond in JSON format with this exact structure:
{
  "formatted_resume": "complete tailored resume text",
  "changes_made": ["change1", "change2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume writer specializing in ATS optimization and job tailoring. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}
