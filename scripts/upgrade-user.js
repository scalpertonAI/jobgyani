/**
 * Script to upgrade users to premium tiers
 *
 * Usage:
 *   node scripts/upgrade-user.js user@example.com sprint
 *   node scripts/upgrade-user.js user@example.com pro
 *   node scripts/upgrade-user.js user@example.com free (to downgrade)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function upgradeUser(email, tier) {
  try {
    // Validate tier
    if (!['free', 'sprint', 'pro'].includes(tier)) {
      console.error('❌ Invalid tier. Must be: free, sprint, or pro');
      process.exit(1);
    }

    // Get user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      process.exit(1);
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, full_name')
      .eq('id', user.id)
      .single();

    console.log(`\n📧 User: ${email}`);
    console.log(`👤 Name: ${profile?.full_name || 'N/A'}`);
    console.log(`📊 Current tier: ${profile?.subscription_tier || 'free'}`);
    console.log(`🎯 New tier: ${tier}\n`);

    // Update subscription
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: tier !== 'free' ? 'active' : null,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Error updating user:', updateError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully upgraded ${email} to ${tier} tier!`);

    if (tier !== 'free') {
      console.log(`\n🎉 User now has access to:`);
      console.log(`   • Unlimited resume analysis`);
      console.log(`   • Interview Gym (unlimited practice)`);
      console.log(`   • Job Decoder`);
      console.log(`   • Application Tracker`);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Usage: node scripts/upgrade-user.js <email> <tier>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/upgrade-user.js user@example.com sprint');
  console.log('  node scripts/upgrade-user.js user@example.com pro');
  console.log('  node scripts/upgrade-user.js user@example.com free');
  console.log('');
  console.log('Available tiers: free, sprint, pro');
  process.exit(1);
}

const [email, tier] = args;
upgradeUser(email, tier);
