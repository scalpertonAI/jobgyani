-- JobGyani Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  job_search_status TEXT CHECK (job_search_status IN ('actively_looking', 'casually_browsing', 'employed')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'sprint', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  free_resume_check_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Questions Bank
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('behavioral', 'technical', 'problem_solving', 'leadership', 'culture')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  sample_answer TEXT,
  tips TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's Daily Question Assignment
CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  answered BOOLEAN DEFAULT false,
  user_answer TEXT,
  ai_feedback JSONB,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, assigned_date)
);

-- User Streak Tracking
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume Uploads
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  analysis_results JSONB,
  is_free_check BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Tracker
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  decoded_analysis JSONB,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interviewing', 'offer', 'rejected', 'withdrawn')),
  applied_date DATE,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice Sessions (for unlimited practice)
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  audio_url TEXT,
  ai_feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Orders (for Razorpay transactions)
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'completed', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_questions_user_date ON daily_questions(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_daily_questions_question ON daily_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_category ON interview_questions(category);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_razorpay ON payment_orders(razorpay_order_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for daily_questions
CREATE POLICY "Users can view own daily questions" ON daily_questions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily questions" ON daily_questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily questions" ON daily_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_streaks
CREATE POLICY "Users can view own streaks" ON user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for resumes
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for job_applications
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON job_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON job_applications
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for practice_sessions
CREATE POLICY "Users can view own practice sessions" ON practice_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions" ON practice_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_orders
CREATE POLICY "Users can view own payment orders" ON payment_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment orders" ON payment_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment orders" ON payment_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for interview_questions (public read)
CREATE POLICY "Anyone can view interview questions" ON interview_questions
  FOR SELECT TO authenticated USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );

  INSERT INTO public.user_streaks (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and streak on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_job_applications
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_user_streaks
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_activity, v_current_streak, v_longest_streak
  FROM user_streaks
  WHERE user_id = p_user_id;

  -- If first activity or activity after a gap of more than 1 day, reset streak
  IF v_last_activity IS NULL OR CURRENT_DATE - v_last_activity > 1 THEN
    v_current_streak := 1;
  -- If activity on consecutive day, increment streak
  ELSIF CURRENT_DATE - v_last_activity = 1 THEN
    v_current_streak := v_current_streak + 1;
  END IF;

  -- Update longest streak if current is greater
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  UPDATE user_streaks
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage bucket for resumes (run this in Supabase Dashboard Storage)
-- You'll need to create a bucket called 'resumes' in the Supabase Dashboard
-- and set up the following policies:

-- Storage policy for resumes bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
--
-- CREATE POLICY "Users can upload own resumes" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can view own resumes" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can delete own resumes" ON storage.objects
--   FOR DELETE TO authenticated
--   USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
