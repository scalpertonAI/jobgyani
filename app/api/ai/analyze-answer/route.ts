import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeInterviewAnswer } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId, question, answer, dailyQuestionId } = await request.json();

    // For Interview Gym, question text is provided directly
    let questionText = question;

    // For daily practice, get question from DB
    if (questionId && !questionText) {
      const { data: questionData, error: questionError } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (questionError || !questionData) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      questionText = questionData.question;
    }

    if (!questionText || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Analyze the answer using OpenAI
    const analysis = await analyzeInterviewAnswer(questionText, answer);

    // If this is a daily question, update it
    if (dailyQuestionId) {
      const { error: updateError } = await supabase
        .from('daily_questions')
        .update({
          answered: true,
          user_answer: answer,
          ai_feedback: analysis,
          answered_at: new Date().toISOString(),
        })
        .eq('id', dailyQuestionId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating daily question:', updateError);
      }

      // Update user streak
      const { error: streakError } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id,
      });

      if (streakError) {
        console.error('Error updating streak:', streakError);
      }
    } else if (questionId) {
      // If this is Interview Gym practice, save to practice_sessions
      const { error: practiceError } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          question_id: questionId,
          answer_text: answer,
          ai_feedback: analysis,
        });

      if (practiceError) {
        console.error('Error saving practice session:', practiceError);
      }
    }

    return NextResponse.json({ success: true, feedback: analysis });
  } catch (error: any) {
    console.error('Error analyzing answer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze answer' },
      { status: 500 }
    );
  }
}
