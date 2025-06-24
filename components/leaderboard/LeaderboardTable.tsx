'use client';

import React from 'react';

type LeaderboardEntry = {
  id: string;
  username: string;
  points: number;
};

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-200">Rank</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-200">Username</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700 dark:text-gray-200">Points</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                No leaderboard data available.
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''
                }`}
              >
                <td className="py-3 px-6 font-medium text-gray-800 dark:text-gray-300">{index + 1}</td>
                <td className="py-3 px-6 text-gray-700 dark:text-gray-200">{entry.username}</td>
                <td className="py-3 px-6 font-semibold text-blue-600 dark:text-blue-400">{entry.points}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
