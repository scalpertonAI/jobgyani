#!/usr/bin/env node

/**
 * Quick script to create test premium accounts
 * Usage: node scripts/create-test-accounts.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const TEST_ACCOUNTS = [
  { email: 'sprint-test@example.com', tier: 'sprint', name: 'Sprint Test User' },
  { email: 'pro-test@example.com', tier: 'pro', name: 'Pro Test User' },
];

async function createTestAccounts() {
  console.log('🚀 Creating test premium accounts...\n');

  for (const account of TEST_ACCOUNTS) {
    console.log(`📧 Processing: ${account.email}`);

    try {
      // Check if user exists
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === account.email);

      if (existingUser) {
        console.log(`   ℹ️  User already exists, upgrading to ${account.tier}...`);

        // Upgrade existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_tier: account.tier,
            subscription_status: 'active',
          })
          .eq('id', existingUser.id);

        if (error) {
          console.error(`   ❌ Failed to upgrade: ${error.message}`);
        } else {
          console.log(`   ✅ Upgraded to ${account.tier} tier`);
        }
      } else {
        console.log(`   ⚠️  User doesn't exist yet`);
        console.log(`   📝 Please sign up first at: http://localhost:3000/signup`);
        console.log(`      Email: ${account.email}`);
        console.log(`      Then run this script again to upgrade.`);
      }

      console.log();
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }

  // List all premium users
  console.log('\n📊 Current Premium Users:');
  console.log('═'.repeat(80));

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, subscription_tier, subscription_status')
    .in('subscription_tier', ['sprint', 'pro']);

  if (profiles && profiles.length > 0) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const userMap = new Map(users.users.map(u => [u.id, u]));

    profiles.forEach(profile => {
      const user = userMap.get(profile.id);
      const tierIcon = profile.subscription_tier === 'pro' ? '👑' : '⚡';
      console.log(
        `${tierIcon} ${user?.email?.padEnd(35)} ${profile.subscription_tier.padEnd(10)} ${profile.subscription_status || 'active'}`
      );
    });
  } else {
    console.log('No premium users found yet.');
  }

  console.log('═'.repeat(80));
  console.log('\n✨ Done! Test accounts are ready.\n');
  console.log('🔐 Login credentials:');
  TEST_ACCOUNTS.forEach(account => {
    console.log(`   • ${account.email} (${account.tier})`);
  });
  console.log('\n💡 Note: You need to set passwords during signup.');
}

createTestAccounts().catch(console.error);
