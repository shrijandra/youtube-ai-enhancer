type CreatorScoreCardProps = {
  score: number;
};

export default function CreatorScoreCard({ score }: CreatorScoreCardProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Creator Score</h3>
          <p className="text-sm text-muted-foreground">
            Overall quality after enhancement
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          {getScoreLabel(score)}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold">{score}</span>
        <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
      </div>

      <div className="mt-4 h-3 w-full rounded-full bg-slate-200">
        <div
          className="h-3 rounded-full bg-emerald-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}