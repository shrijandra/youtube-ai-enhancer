type AudioAnalysisDashboardProps = {
  analysis: any;
};

function MetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-medium text-slate-400">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

export default function AudioAnalysisDashboard({
  analysis,
}: AudioAnalysisDashboardProps) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 text-left shadow-lg">
      <h3 className="mb-5 text-xl font-bold text-white">
        📊 Audio Analysis
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Duration"
          value={analysis.duration_minutes}
          unit="min"
        />

        <MetricCard
          label="Average Loudness"
          value={analysis.avg_loudness_lufs}
          unit="LUFS"
        />

        <MetricCard
          label="True Peak"
          value={analysis.true_peak_dbfs}
          unit="dBFS"
        />

        <MetricCard
          label="Dynamic Range"
          value={analysis.dynamic_range_lra}
          unit="LU"
        />

        <MetricCard
          label="Pauses Detected"
          value={analysis.pauses_detected}
        />

        <MetricCard
          label="YouTube Target"
          value={analysis.youtube_target_lufs}
          unit="LUFS"
        />
      </div>
    </div>
  );
}