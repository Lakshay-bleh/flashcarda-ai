'use client'
export default function Navigation({
  onPrev,
  onNext,
  isFirst,
  isLast,
}: {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex justify-center gap-4">
      <button onClick={onPrev} disabled={isFirst} className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50">
        ◀ Prev
      </button>
      <button onClick={onNext} disabled={isLast} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
        Next ▶
      </button>
    </div>
  );
}
