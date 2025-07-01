export default function Controls({
  onKnown,
  onUnknown,
  paused,
  togglePause,
}: {
  onKnown: () => void;
  onUnknown: () => void;
  paused: boolean;
  togglePause: () => void;
}) {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={onKnown}>
        ✔️ Known (K)
      </button>
      <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={onUnknown}>
        ❌ Unknown (U)
      </button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={togglePause}>
        {paused ? '▶️ Resume (P)' : '⏸ Pause (P)'}
      </button>
    </div>
  );
}
