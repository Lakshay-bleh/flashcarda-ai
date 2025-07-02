import { useEffect, useState, useCallback } from 'react';

type Stats = {
  decks: number;
  cards_reviewed: number;
  hours_studied: number;
  daily_goal: number;
  reviewed_today: number;
  user_id: string;
};

interface StatsComponentProps {
  userId: string;
}

const StatsComponent: React.FC<StatsComponentProps> = ({ userId }) => {
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch stats when the component is mounted or when userId changes
  const fetchStats = useCallback(async () => {
    const response = await fetch(`/api/stats/${userId}`);
    const data = await response.json();
    setStats(data); // Assuming the updated stats are returned here
  }, [userId]);

  useEffect(() => {
    fetchStats(); // Fetch stats when component mounts
  }, [fetchStats]); // Refetch when fetchStats changes

  const incrementDecks = async () => {
    const response = await fetch('/api/update-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkUserId: 'user_clerk_id', // Assume this is passed dynamically
        action: 'decks',
        count: 1, // Increment by 1
      }),
    });

    if (response.ok) {
      // After incrementing, refetch the updated stats
      fetchStats();
    } else {
      console.error('Error updating stats');
    }
  };

  return (
    <div>
      <h1>User Stats</h1>
      <p>Decks: {stats ? stats.decks : 'Loading...'}</p>
      <button onClick={incrementDecks}>Increment Decks</button>
    </div>
  );
};

export default StatsComponent;

