type AIRecommendationsProps = {
  analysis: any;
};

export default function AIRecommendations({ 
  analysis, 
 }: AIRecommendationsProps) {
  const recommendations: string[] = [];

  if (analysis.avg_loudness_lufs < -15) {
    recommendations.push("Increase loudness slightly to get closer to YouTube's -14 LUFS target.");
  } else {
    recommendations.push("Loudness is close to YouTube target.");
  }

  if (analysis.true_peak_dbfs > -1) {
    recommendations.push("Peak is too close to clipping. Lower output gain.");
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

  /*const score =
    100 -
    Math.abs((analysis.avg_loudness_lufs ?? -14) + 14) * 5 -
    (analysis.clipping_warning ? 20 : 0) -
    Math.max(0, 3.5 - (analysis.dynamic_range_lra ?? 3.5)) * 5;  */

  //const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="mt-6 rounded-2xl border border-indigo-700/60 bg-indigo-950/40 p-6 text-left shadow-lg">
      <h3 className="mb-5 text-xl font-bold text-white">
        🤖 AI Recommendations
      </h3>

      

      <div className="space-y-3">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}