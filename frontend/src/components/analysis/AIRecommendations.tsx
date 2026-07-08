type AIRecommendationsProps = {
  analysis: any;
};

export default function AIRecommendations({ analysis }: AIRecommendationsProps) {
  const recommendations: string[] = [];

  if (analysis.avg_loudness_lufs < -15) {
    recommendations.push("Increase loudness slightly to get closer to YouTube's -14 LUFS target.");
  } else {
    recommendations.push("Loudness is close to YouTube target.");
  }

  if (analysis.true_peak_dbfs > -1) {
    recommendations.push("Peak is too close to clipping. Lower limiter or output gain.");
  } else {
    recommendations.push("Peak level is safe.");
  }

  if (analysis.dynamic_range_lra < 3.5) {
    recommendations.push("Dynamic range is a little compressed. Use gentler compression for a more natural voice.");
  } else {
    recommendations.push("Dynamic range looks natural for spoken voice.");
  }

  if (analysis.pauses_detected > 25) {
    recommendations.push("Many pauses detected. Consider trimming silences for tighter pacing.");
  } else {
    recommendations.push("Pacing looks good.");
  }

  const score =
    100 -
    Math.abs((analysis.avg_loudness_lufs ?? -14) + 14) * 5 -
    (analysis.clipping_warning ? 20 : 0) -
    Math.max(0, 3.5 - (analysis.dynamic_range_lra ?? 3.5)) * 5;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-5 text-left">
      <h3 className="mb-3 text-xl font-semibold">
        🤖 AI Recommendations
      </h3>

      <div className="mb-4">
        <p className="text-sm text-slate-400">Creator Audio Score</p>
        <p className="text-4xl font-bold">{finalScore}/100</p>
      </div>

      <ul className="space-y-2 text-sm text-slate-300">
        {recommendations.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}