type CreatorScoreCardProps = {
  score: number;
};

// Ordered high to low - first match wins.
const scoreTiers = [
  {
    min: 85,
    label: "Excellent",
    badge: "bg-emerald-500/15 text-emerald-300",
    bar: "bg-emerald-500",
  },
  {
    min: 70,
    label: "Good",
    badge: "bg-sky-500/15 text-sky-300",
    bar: "bg-sky-500",
  },
  {
    min: 50,
    label: "Needs Improvement",
    badge: "bg-amber-500/15 text-amber-300",
    bar: "bg-amber-500",
  },
  {
    min: 0,
    label: "Poor",
    badge: "bg-rose-500/15 text-rose-300",
    bar: "bg-rose-500",
  },
];

export default function CreatorScoreCard({ score }: CreatorScoreCardProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  const tier =
    scoreTiers.find((t) => clamped >= t.min) ??
    scoreTiers[scoreTiers.length - 1];

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Creator Score
          </h3>

          <p className="text-sm text-slate-400">
            Overall quality after enhancement
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${tier.badge}`}
        >
          {tier.label}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-white">
          {clamped}
        </span>

        <span className="mb-1 text-sm text-slate-400">/ 100</span>
      </div>

      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-label="Creator score"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-3 rounded-full transition-all ${tier.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
