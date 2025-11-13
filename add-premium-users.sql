-- Script to Manually Add Premium Users
-- Run this in your Supabase SQL Editor

-- Option 1: Upgrade user by email to Sprint tier
UPDATE profiles
SET
  subscription_tier = 'sprint',
  subscription_status = 'active'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- Option 2: Upgrade user by email to Pro tier
UPDATE profiles
SET
  subscription_tier = 'pro',
  subscription_status = 'active'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- Option 3: Upgrade multiple users at once (Sprint)
UPDATE profiles
SET
  subscription_tier = 'sprint',
  subscription_status = 'active'
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN (
    'user1@example.com',
    'user2@example.com',
    'user3@example.com'
  )
);

-- Check current subscription status for a user
SELECT
  u.email,
  p.full_name,
  p.subscription_tier,
  p.subscription_status,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'user@example.com';

-- View all premium users
SELECT
  u.email,
  p.full_name,
  p.subscription_tier,
  p.subscription_status,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.subscription_tier IN ('sprint', 'pro')
ORDER BY p.created_at DESC;

-- Downgrade user back to free
UPDATE profiles
SET
  subscription_tier = 'free',
  subscription_status = NULL
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
