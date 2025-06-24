import { supabase } from './supabase';

export async function updateUserStats(userId: string, xpGained: number) {
  const { data: existingStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found, so ignore that error
    console.error('Failed to fetch user_stats:', fetchError.message);
    return;
  }

  if (existingStats) {
    const { error: updateError } = await supabase
      .from('user_stats')
      .update({
        xp_total: existingStats.xp_total + xpGained,
        daily_streak: existingStats.daily_streak + 1,
        last_active_date: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update user_stats:', updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from('user_stats').insert([
      {
        user_id: userId,
        xp_total: xpGained,
        daily_streak: 1,
        last_active_date: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('Failed to insert into user_stats:', insertError.message);
    }
  }
}
