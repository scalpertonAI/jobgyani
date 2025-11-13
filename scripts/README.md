# Admin Scripts

Scripts for managing JobGyani users and subscriptions.

## Prerequisites

Make sure you have the following in your `.env.local` file:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (this is the **service role key**, not the anon key)

You can find these in your Supabase project settings under "API".

## Scripts

### 1. List All Users

View all registered users with their subscription status.

```bash
node scripts/list-users.js
```

**Output:**
```
📊 Total users: 5

================================================================================
Email                              Name                     Tier      Status
================================================================================
🆓 user1@example.com               John Doe                 free      -
⚡ user2@example.com               Jane Smith               sprint    active
👑 user3@example.com               Admin User               pro       active
================================================================================

📈 Summary:
   🆓 Free: 3
   ⚡ Sprint: 1
   👑 Pro: 1
```

### 2. Upgrade User

Upgrade a user to a premium tier.

```bash
# Upgrade to Sprint tier (₹2,900/month)
node scripts/upgrade-user.js user@example.com sprint

# Upgrade to Pro tier (₹4,900/month)
node scripts/upgrade-user.js user@example.com pro

# Downgrade to Free tier
node scripts/upgrade-user.js user@example.com free
```

**Output:**
```
📧 User: user@example.com
👤 Name: John Doe
📊 Current tier: free
🎯 New tier: sprint

✅ Successfully upgraded user@example.com to sprint tier!

🎉 User now has access to:
   • Unlimited resume analysis
   • Interview Gym (unlimited practice)
   • Job Decoder
   • Application Tracker
```

## Available Tiers

### 🆓 Free
- 1 daily interview question
- AI-powered feedback
- 1 free resume check
- View question library

### ⚡ Sprint (₹2,900/month)
- Everything in Free, plus:
- Unlimited resume analysis
- Unlimited interview practice
- Job description decoder
- Application tracker

### 👑 Pro (₹4,900/month)
- Everything in Sprint, plus:
- Priority AI responses
- Advanced analytics
- Premium support

## SQL Method (Alternative)

You can also upgrade users directly in Supabase SQL Editor using `add-premium-users.sql`:

```sql
-- Upgrade single user
UPDATE profiles
SET
  subscription_tier = 'sprint',
  subscription_status = 'active'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

## Troubleshooting

### Error: Missing Supabase credentials
Make sure you have both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file.

### Error: User not found
Double-check the email address. The user must have already signed up for an account.

### Error: Permission denied
Make sure you're using the **service role key** (not the anon key) in your `.env.local` file.
