# JobGyani Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenAI API key
- A Razorpay account (for payments)

## 1. Supabase Setup

### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Go to Project Settings > API to find your credentials

### Run Database Schema

1. In your Supabase dashboard, navigate to the SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create all tables, policies, and functions

### Set up Storage for Resumes

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `resumes`
3. Make it private (not public)
4. The RLS policies are included in the schema file

### Configure Authentication

1. Go to Authentication > Providers in Supabase
2. Enable Email provider
3. (Optional) Enable Google OAuth:
   - Get OAuth credentials from Google Cloud Console
   - Add them to Supabase Auth providers

## 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Seed Interview Questions (Optional)

After setting up the database, you can run the seed script to populate interview questions:

```bash
npm run seed
```

## 6. Razorpay Setup (for Payments)

1. Create plans in Razorpay Dashboard:
   - Job Sprint Monthly: ₹2900/month recurring
   - Job Sprint Quarterly: ₹7900 (3 months)
   - Job Sprint Pro: ₹4900/month recurring (optional)

2. Set up webhooks:
   - Add webhook endpoint: `https://your-domain.com/api/razorpay/webhooks`
   - Select events:
     - `subscription.activated`
     - `subscription.charged`
     - `subscription.cancelled`
     - `payment.failed`

## 7. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables
4. Deploy!

## Troubleshooting

### Build Errors

If you get Tailwind CSS errors, ensure you have `@tailwindcss/postcss` installed:

```bash
npm install -D @tailwindcss/postcss
```

### Supabase Connection Issues

- Double-check your environment variables
- Ensure your Supabase project is active
- Check that RLS policies are enabled

### Razorpay Webhooks Not Working

- Make sure you're using the correct webhook secret
- Verify webhook signature in your route handler
- Check Razorpay dashboard for webhook logs
- Test webhooks using ngrok for local development:

```bash
ngrok http 3000
# Use the ngrok URL as webhook endpoint
```

## Features Checklist

- [x] Authentication (Signup/Login)
- [x] Daily Interview Question
- [x] AI Integration (OpenAI GPT-4)
- [ ] Resume Analysis
- [ ] Question Library
- [ ] Razorpay Integration
- [ ] Interview Gym (Paid)
- [ ] Job Decoder (Paid)
- [ ] Application Tracker (Paid)

## Support

For issues, please check the GitHub repository or contact support.
