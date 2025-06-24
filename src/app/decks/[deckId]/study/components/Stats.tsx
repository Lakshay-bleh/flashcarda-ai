export default function Stats({
  index,
  total,
  elapsedTime,
  perCardTimer,
  paused,
  streak,
  known,
}: {
  index: number;
  total: number;
  elapsedTime: number;
  perCardTimer: number;
  paused: boolean;
  streak: number;
  known: number;
}) {
  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div className="flex justify-between text-sm text-gray-500 mb-4">
      <p>{index + 1} / {total}</p>
      <p>⏱ {format(elapsedTime)}</p>
      <p>⏳ {perCardTimer}s {paused && '⏸️'}</p>
      <p>🔥 Streak: {streak}</p>
      <p>✅ Known: {known}</p>
    </div>
  );
}
