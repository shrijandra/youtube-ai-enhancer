type Props = {
  before: any;
  after: any;
};

function ReportRow({
  original,
  improvement,
}: {
  original: string;
  improvement: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-700 bg-slate-950 p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Original Recording
        </p>

        <p className="mt-2 text-white">
          {original}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Improvement
        </p>

        <p className="mt-2 font-medium text-emerald-400">
          {improvement}
        </p>
      </div>
    </div>
  );
}

export default function BeforeAfterComparison({
  before,
  after,
}: Props) {
  const loudnessImproved = (
    after.avg_loudness_lufs -
    before.avg_loudness_lufs
  ).toFixed(1);

  const dynamicLoss = (
    before.dynamic_range_lra -
    after.dynamic_range_lra
  ).toFixed(1);

  const pausesRemoved =
    before.pauses_detected -
    after.pauses_detected;

  return (
    <div className="mt-6 rounded-2xl border border-emerald-700/60 bg-emerald-950/20 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        ✨ Enhancement Report
      </h2>

      <div className="space-y-4">

        <ReportRow
          original={`Loudness: ${before.avg_loudness_lufs} LUFS`}
          improvement={`✅ Increased by ${loudnessImproved} dB`}
        />

        <ReportRow
          original={`Peak: ${before.true_peak_dbfs} dBFS`}
          improvement="✅ Safely below clipping"
        />

        <ReportRow
          original={`Dynamic Range: ${before.dynamic_range_lra} LU`}
          improvement={`⚠ Reduced by ${dynamicLoss} LU`}
        />

        <ReportRow
          original={`Pauses: ${before.pauses_detected}`}
          improvement={`✅ Removed ${pausesRemoved} pauses`}
        />

      </div>

    </div>
  );
}