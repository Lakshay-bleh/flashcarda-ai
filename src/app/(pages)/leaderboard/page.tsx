// src/app/leaderboard/page.tsx

import LeaderboardTable from '../../../../components/leaderboard/LeaderboardTable';
import { supabase } from '../../../lib/supabase';

type UserStat = {
  user_id: string;
  xp_total: number;
};

type AppUser = {
  id: string;
  clerk_id: string;
};

type LeaderboardEntry = {
  id: string;
  username: string;
  points: number;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  // 1️⃣ Fetch top 10 user_stats
  const { data: stats, error: statsError }: SupabaseResponse<UserStat[]> = await supabase
    .from('user_stats')
    .select('user_id, xp_total')
    .order('xp_total', { ascending: false })
    .limit(10);


  if (statsError) {
    console.error('Error fetching user_stats:', statsError.message);
    return [];
  } 

  if (!stats || stats.length === 0) {
    console.info('No user_stats records found yet.');
    return [];
  }

  // 2️⃣ Fetch matching app_users
  const userIds = [...new Set(stats.map((s) => s.user_id))];
  const { data: users, error: usersError } = await supabase
    .from('app_users')
    .select('id, clerk_id')
    .in('id', userIds) as SupabaseResponse<AppUser[]>;

  if (usersError) {
    console.error('Error fetching app_users:', usersError.message);
    return [];
  }

  const userMap = new Map((users ?? []).map((u) => [u.id, u]));

  // 3️⃣ Build leaderboard entries
  const entries: LeaderboardEntry[] = stats.map((us) => ({
    id: us.user_id,
    username: userMap.get(us.user_id)?.clerk_id ?? 'Unknown',
    points: us.xp_total,
  }));

  return entries;
}

export default async function LeaderboardPage() {
  let entries: LeaderboardEntry[] = [];

  try {
    entries = await getLeaderboardData();
  } catch (err) {
    console.error('Unexpected leaderboard fetch error:', err);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>
      <LeaderboardTable entries={entries} />
    </main>
  );
}