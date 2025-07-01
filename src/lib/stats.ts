import { supabase } from './supabase';

interface StatsIncrement {
  decks?: number;
  cardsReviewed?: number;
  hoursStudied?: number;
  reviewedToday?: number;
}

export async function updateUserStats(
  userId: string,
  increments: StatsIncrement
) {
  const { data: existingStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Failed to fetch user_stats:', fetchError.message);
    return;
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (existingStats) {
    // Check if last update was today; if not, reset reviewed_today
    const lastUpdateDate = existingStats.updated_at
      ? new Date(existingStats.updated_at).toISOString().slice(0, 10)
      : null;

    // Calculate new reviewed_today value
    let newReviewedToday = existingStats.reviewed_today;
    if (increments.reviewedToday !== undefined) {
      newReviewedToday =
        lastUpdateDate === today
          ? existingStats.reviewed_today + increments.reviewedToday
          : increments.reviewedToday;
    }

    // Prepare update object, incrementing each field if provided
    const updateData: Record<string, unknown> = {
      updated_at: now.toISOString(),
    };

    if (increments.decks !== undefined) {
      updateData.decks = existingStats.decks + increments.decks;
    }

    if (increments.cardsReviewed !== undefined) {
      updateData.cards_reviewed = existingStats.cards_reviewed + increments.cardsReviewed;
    }

    if (increments.hoursStudied !== undefined) {
      updateData.hours_studied = Number(existingStats.hours_studied) + increments.hoursStudied;
    }

    updateData.reviewed_today = newReviewedToday;

    const { error: updateError } = await supabase
      .from('user_stats')
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update user_stats:', updateError.message);
    }
  } else {
    // Insert a new record with the increments or defaults
    const insertData = {
      user_id: userId,
      decks: increments.decks ?? 0,
      cards_reviewed: increments.cardsReviewed ?? 0,
      hours_studied: increments.hoursStudied ?? 0,
      daily_goal: 30,
      reviewed_today: increments.reviewedToday ?? 0,
      updated_at: now.toISOString(),
      created_at: now.toISOString(),
    };

    const { error: insertError } = await supabase.from('user_stats').insert([insertData]);

    if (insertError) {
      console.error('Failed to insert into user_stats:', insertError.message);
    }
  }
}
