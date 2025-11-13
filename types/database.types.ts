export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          job_search_status: string | null
          subscription_tier: string
          stripe_customer_id: string | null
          subscription_status: string | null
          free_resume_check_used: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          job_search_status?: string | null
          subscription_tier?: string
          stripe_customer_id?: string | null
          subscription_status?: string | null
          free_resume_check_used?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          job_search_status?: string | null
          subscription_tier?: string
          stripe_customer_id?: string | null
          subscription_status?: string | null
          free_resume_check_used?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      interview_questions: {
        Row: {
          id: string
          question: string
          category: string
          difficulty: string | null
          sample_answer: string | null
          tips: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          category: string
          difficulty?: string | null
          sample_answer?: string | null
          tips?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          category?: string
          difficulty?: string | null
          sample_answer?: string | null
          tips?: string[] | null
          created_at?: string
        }
      }
      daily_questions: {
        Row: {
          id: string
          user_id: string
          question_id: string
          assigned_date: string
          answered: boolean
          user_answer: string | null
          ai_feedback: Json | null
          answered_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          assigned_date: string
          answered?: boolean
          user_answer?: string | null
          ai_feedback?: Json | null
          answered_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          assigned_date?: string
          answered?: boolean
          user_answer?: string | null
          ai_feedback?: Json | null
          answered_at?: string | null
          created_at?: string
        }
      }
      user_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          analysis_results: Json | null
          is_free_check: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          analysis_results?: Json | null
          is_free_check?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          analysis_results?: Json | null
          is_free_check?: boolean
          created_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          company_name: string
          job_title: string
          job_description: string | null
          decoded_analysis: Json | null
          status: string
          applied_date: string | null
          follow_up_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          job_title: string
          job_description?: string | null
          decoded_analysis?: Json | null
          status?: string
          applied_date?: string | null
          follow_up_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          job_title?: string
          job_description?: string | null
          decoded_analysis?: Json | null
          status?: string
          applied_date?: string | null
          follow_up_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      practice_sessions: {
        Row: {
          id: string
          user_id: string
          question_id: string
          answer_text: string | null
          audio_url: string | null
          ai_feedback: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          answer_text?: string | null
          audio_url?: string | null
          ai_feedback?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          answer_text?: string | null
          audio_url?: string | null
          ai_feedback?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
