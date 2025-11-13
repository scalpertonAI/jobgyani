# JobGyani - AI-Powered Job Prep SaaS Platform

A comprehensive job preparation platform with freemium model. Users practice interview questions daily, get AI-powered resume feedback, and access job prep tools.

## 🎯 Current Status

### ✅ Completed Features (Phase 1)

#### 1. **Core Infrastructure**
- ✅ Next.js 14 with App Router and TypeScript
- ✅ Tailwind CSS v4 with custom design system
- ✅ shadcn/ui components library
- ✅ Supabase authentication and database
- ✅ Auth middleware for route protection
- ✅ Environment configuration

#### 2. **Authentication System**
- ✅ Email/password signup and login
- ✅ Google OAuth integration ready
- ✅ Password reset flow
- ✅ Email verification support
- ✅ Auth callback handling
- ✅ Automatic profile creation on signup

#### 3. **Database Schema**
- ✅ Profiles table with subscription tiers
- ✅ Interview questions bank (100 questions seeded)
- ✅ Daily question assignments
- ✅ User streak tracking
- ✅ Resume storage metadata
- ✅ Job applications tracker
- ✅ Practice sessions logging
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers for user creation and updates

#### 4. **Dashboard**
- ✅ Protected dashboard layout
- ✅ Navigation with free/pro feature indicators
- ✅ Dashboard overview with stats:
  - Current streak counter
  - Questions answered count
  - Resume checks used
  - Subscription status
- ✅ Today's question card
- ✅ Quick action cards
- ✅ Mobile-responsive navigation

#### 5. **Daily Interview Practice** (Core Free Feature)
- ✅ One question per day assignment
- ✅ 100 interview questions across 5 categories:
  - 30 Behavioral questions
  - 25 Technical questions
  - 20 Problem-Solving questions
  - 15 Leadership questions
  - 10 Culture Fit questions
- ✅ Question difficulty levels (easy, medium, hard)
- ✅ Answer submission with character count
- ✅ AI-powered analysis using OpenAI GPT-4:
  - STAR method detection
  - Confidence scoring (1-10)
  - Filler word counting
  - Length validation
  - Specific improvement tips
  - Strength identification
- ✅ Streak tracking with automatic updates
- ✅ Visual feedback and progress indicators

#### 6. **AI Integration**
- ✅ OpenAI GPT-4 integration
- ✅ Interview answer analysis API
- ✅ Structured feedback in JSON format
- ✅ Resume analysis functionality ready
- ✅ Job description analysis ready

#### 7. **Seed Data**
- ✅ 100 interview questions with:
  - Sample answers
  - Tips for answering
  - Category and difficulty tags
- ✅ Seed script: `npm run seed`

### 🚧 Remaining Features to Build

#### Phase 2: Essential Free Features
1. **Resume Check** (One Free Analysis)
   - [ ] Resume upload (PDF/DOCX)
   - [ ] AI analysis integration
   - [ ] ATS compatibility score
   - [ ] Issue identification
   - [ ] Improvement suggestions
   - [ ] Free tier limitation (1 check)

2. **Question Library** (View Only)
   - [ ] Browse interface
   - [ ] Category filtering
   - [ ] Search functionality
   - [ ] Difficulty sorting
   - [ ] Question details view

3. **Landing Page**
   - [ ] Hero section
   - [ ] Features showcase
   - [ ] Social proof section
   - [ ] Pricing comparison
   - [ ] CTAs

#### Phase 3: Paid Features (Job Sprint - $29/month)
4. **Unlimited Resume Analysis**
   - [ ] Multiple resume uploads
   - [ ] Full detailed feedback
   - [ ] AI rewrites
   - [ ] Job description tailoring
   - [ ] Version history

5. **Interview Gym (Unlimited Practice)**
   - [ ] Practice any question anytime
   - [ ] Audio response recording
   - [ ] Audio analysis (filler words, pace)
   - [ ] Progress dashboard
   - [ ] Category strength analysis

6. **Job Description Decoder**
   - [ ] Paste job posting
   - [ ] AI extracts requirements
   - [ ] Red flag identification
   - [ ] Culture indicators
   - [ ] Salary estimation
   - [ ] Custom prep questions
   - [ ] Save to library

7. **Application Tracker**
   - [ ] Add job applications
   - [ ] Status tracking (Applied → Offer/Rejected)
   - [ ] Follow-up reminders
   - [ ] AI-generated follow-up emails
   - [ ] Pipeline dashboard

#### Phase 4: Monetization
8. **Razorpay Integration**
   - [ ] Payment processing
   - [ ] Subscription management
   - [ ] Webhook handling
   - [ ] Customer portal
   - [ ] Upgrade/downgrade flows

9. **Pricing Page**
   - [ ] Tier comparison table
   - [ ] Feature breakdown
   - [ ] Checkout flow
   - [ ] Billing management

#### Phase 5: Polish
10. **Additional Pages**
    - [ ] Settings page
    - [ ] Billing page
    - [ ] Profile management

11. **Feature Gating**
    - [ ] Middleware for paid features
    - [ ] Upgrade prompts
    - [ ] Usage limits

12. **Error Handling & UX**
    - [ ] Loading states everywhere
    - [ ] Error boundaries
    - [ ] Toast notifications
    - [ ] Mobile optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Supabase account
- An OpenAI API key
- A Razorpay account (for payments)

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd jobgyani
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL in `supabase-schema.sql` in the SQL Editor
   - Create a storage bucket called `resumes`
   - Get your project URL and anon key

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID (for payments)
   - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
jobgyani/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, reset)
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   └── daily-practice/  # Daily question feature
│   ├── api/                 # API routes
│   │   └── ai/              # AI integration endpoints
│   └── auth/                # Auth callbacks
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── dashboard/           # Dashboard-specific components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── openai.ts            # OpenAI GPT-4 integration
│   ├── razorpay.ts          # Razorpay payment integration
│   └── utils.ts             # Utility functions
├── scripts/
│   └── seed-questions.ts    # Database seeding
├── types/
│   └── database.types.ts    # TypeScript types for database
├── supabase-schema.sql      # Complete database schema
├── SETUP.md                 # Detailed setup instructions
└── README.md                # This file
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4
- **Payments**: Razorpay
- **Deployment**: Vercel (recommended)

## 📊 Database Schema

### Core Tables
- **profiles**: User profiles with subscription info
- **interview_questions**: Question bank (100 questions)
- **daily_questions**: Daily question assignments
- **user_streaks**: Streak tracking
- **resumes**: Resume uploads and analysis
- **job_applications**: Application tracking
- **practice_sessions**: Unlimited practice sessions

### Key Features
- Row Level Security (RLS) on all tables
- Automatic profile creation on signup
- Streak calculation function
- Updated_at triggers

## 🔑 Key Features Implemented

### 1. Daily Practice Flow
1. User logs in
2. System shows today's assigned question
3. User types answer (min 100 characters)
4. Submit triggers OpenAI GPT-4 analysis
5. Receives detailed feedback:
   - Confidence score
   - STAR method check
   - Filler word count
   - Specific tips
   - Identified strengths
6. Streak automatically updated

### 2. Streak System
- Tracks consecutive days of practice
- Resets after missing a day
- Shows current and longest streak
- Visual flame icon indicator

### 3. AI Feedback Quality
Each answer receives:
- **Confidence Score**: 1-10 rating
- **STAR Method**: Boolean check
- **Length Check**: Too short/long feedback
- **Filler Words**: Count of um, uh, like, etc.
- **Improvement Tips**: 3-5 specific suggestions
- **Strengths**: 2-3 positive points

## 📈 Next Steps

### Immediate Priorities
1. Build Resume Check feature
2. Create Question Library interface
3. Complete Landing Page
4. Integrate Razorpay payments

### Medium Term
5. Build Interview Gym
6. Add Job Decoder
7. Create Application Tracker
8. Polish UI/UX

### Before Launch
9. Add error handling everywhere
10. Mobile optimization
11. Email notifications
12. Admin dashboard for metrics

## 🎨 Design System

### Colors
- **Primary**: Blue (`#2563eb`) - Trust, professional
- **Accent**: Green (`#10b981`) - Success, progress
- **Warning**: Orange (`#f97316`)
- **Danger**: Red (`#ef4444`)

### Components
All components use shadcn/ui for consistency:
- Button, Card, Input, Label
- Badge, Progress, Textarea
- Fully accessible with Radix UI

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Auth middleware protecting dashboard routes
- API routes validate user authentication
- Secure file uploads with user isolation
- Environment variables for sensitive data

## 📝 License

ISC

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [Razorpay](https://razorpay.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Current Version**: 0.1.0 (MVP Phase 1)

**Status**: ✅ Core features operational, ready for Phase 2 development
