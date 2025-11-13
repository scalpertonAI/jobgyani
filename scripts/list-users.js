/**
 * Script to list all users with their subscription status
 *
 * Usage:
 *   node scripts/list-users.js
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

async function listUsers() {
  try {
    // Get all users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      process.exit(1);
    }

    if (users.users.length === 0) {
      console.log('📭 No users found');
      return;
    }

    console.log(`\n📊 Total users: ${users.users.length}\n`);

    // Get profiles for all users
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', users.users.map(u => u.id));

    // Create a map for quick lookup
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // Display users with their subscription info
    console.log('=' .repeat(80));
    console.log('Email'.padEnd(35) + 'Name'.padEnd(25) + 'Tier'.padEnd(10) + 'Status');
    console.log('='.repeat(80));

    users.users.forEach(user => {
      const profile = profileMap.get(user.id);
      const email = user.email || 'N/A';
      const name = profile?.full_name || 'N/A';
      const tier = profile?.subscription_tier || 'free';
      const status = profile?.subscription_status || '-';

      // Color coding
      const tierIcon = tier === 'pro' ? '👑' : tier === 'sprint' ? '⚡' : '🆓';

      console.log(
        `${tierIcon} ${email.padEnd(32)}`.padEnd(35) +
        name.substring(0, 23).padEnd(25) +
        tier.padEnd(10) +
        status
      );
    });

    console.log('='.repeat(80));

    // Summary
    const tierCounts = {
      free: 0,
      sprint: 0,
      pro: 0
    };

    profiles?.forEach(p => {
      tierCounts[p.subscription_tier as keyof typeof tierCounts]++;
    });

    console.log(`\n📈 Summary:`);
    console.log(`   🆓 Free: ${tierCounts.free}`);
    console.log(`   ⚡ Sprint: ${tierCounts.sprint}`);
    console.log(`   👑 Pro: ${tierCounts.pro}`);
    console.log();
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

listUsers();
