import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeInterviewAnswer } from '@/lib/anthropic';

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

    const { questionId, answer, dailyQuestionId } = await request.json();

    if (!questionId || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the question
    const { data: question, error: questionError } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Analyze the answer using Claude
    const analysis = await analyzeInterviewAnswer(question.question, answer);

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
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error analyzing answer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze answer' },
      { status: 500 }
    );
  }
}
