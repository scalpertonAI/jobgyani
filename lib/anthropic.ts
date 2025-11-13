import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
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

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Extract JSON from the response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  return JSON.parse(jsonMatch[0]);
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

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Extract JSON from the response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  return JSON.parse(jsonMatch[0]);
}
