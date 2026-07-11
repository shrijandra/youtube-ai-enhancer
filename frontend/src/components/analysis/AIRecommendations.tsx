type Props = {
  analysis: any;
};

type Priority = "high" | "medium" | "low";

type Recommendation = {
  title: string;
  description: string;
  priority: Priority;
};

type SuggestedSettings = {
  noiseReduction: number;
  voiceClarity: number;
  echoRemoval: number;
  loudness: number;
};

const getPriorityStyle = (priority: Priority) => {
  switch (priority) {
    case "high":
      return {
        badge: "bg-red-500/15 text-red-300 border-red-500/30",
        label: "High Priority",
        icon: "🔴",
      };

    case "medium":
      return {
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        label: "Medium Priority",
        icon: "🟡",
      };

    case "low":
      return {
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        label: "Optimized",
        icon: "🟢",
      };
  }
};

const generateRecommendations = (analysis: any): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  const loudness = analysis?.avg_loudness_lufs ?? -30;
  const peak = analysis?.true_peak_dbfs ?? 0;
  const dynamicRange = analysis?.dynamic_range_lra ?? 0;
  const pauses = analysis?.pauses_count ?? 0;

  if (loudness < -18) {
    recommendations.push({
      title: "Increase voice loudness",
      description:
        "The recording is quieter than the recommended range for spoken creator content.",
      priority: "high",
    });
  } else if (loudness > -12) {
    recommendations.push({
      title: "Reduce loudness slightly",
      description:
        "The voice is louder than the preferred range and may sound aggressive on some devices.",
      priority: "medium",
    });
  } else {
    recommendations.push({
      title: "Loudness is creator-ready",
      description:
        "The enhanced loudness is within a strong range for YouTube narration and spoken content.",
      priority: "low",
    });
  }

  if (peak > -1) {
    recommendations.push({
      title: "Lower the peak level",
      description:
        "The peak is close to clipping. Leave more headroom to avoid distortion after platform encoding.",
      priority: "high",
    });
  } else {
    recommendations.push({
      title: "Peak level is safe",
      description:
        "The audio has enough headroom and should remain clean after export and platform processing.",
      priority: "low",
    });
  }

  if (dynamicRange < 2.5) {
    recommendations.push({
      title: "Reduce compression",
      description:
        "The voice may sound overly compressed. Preserve slightly more natural variation and expression.",
      priority: "medium",
    });
  } else if (dynamicRange > 8) {
    recommendations.push({
      title: "Control volume variation",
      description:
        "The recording has a wide dynamic range. Moderate compression can make the voice more consistent.",
      priority: "medium",
    });
  } else {
    recommendations.push({
      title: "Dynamic range is balanced",
      description:
        "The voice has a good balance between consistency and natural expression.",
      priority: "low",
    });
  }

  if (pauses > 50) {
    recommendations.push({
      title: "Reduce long pauses",
      description:
        "There are several pauses that may affect pacing and viewer engagement.",
      priority: "medium",
    });
  } else {
    recommendations.push({
      title: "Pacing is well controlled",
      description:
        "The number of detected pauses is reasonable for presentation-style narration.",
      priority: "low",
    });
  }

  return recommendations;
};

const getSuggestedPreset = (analysis: any) => {
  const loudness = analysis?.avg_loudness_lufs ?? -30;
  const dynamicRange = analysis?.dynamic_range_lra ?? 0;

  if (loudness < -18) {
    return {
      name: "Voice Focus",
      description: "Best for quiet narration that needs clarity and presence.",
      icon: "🎙️",
    };
  }

  if (dynamicRange > 8) {
    return {
      name: "Podcast",
      description:
        "Best for balancing inconsistent speech levels and improving vocal presence.",
      icon: "🎧",
    };
  }

  return {
    name: "Balanced",
    description:
      "Best for polished creator audio while preserving a natural voice.",
    icon: "✨",
  };
};

const getSuggestedSettings = (analysis: any): SuggestedSettings => {
  const loudness = analysis?.avg_loudness_lufs ?? -30;
  const dynamicRange = analysis?.dynamic_range_lra ?? 0;
  const pauses = analysis?.pauses_count ?? 0;

  return {
    noiseReduction: 65,
    voiceClarity: loudness < -18 ? 85 : 75,
    echoRemoval: 40,
    loudness: loudness < -18 ? 80 : loudness > -12 ? 45 : 65,
  };
};

const getOverallAssessment = (analysis: any) => {
  const loudness = analysis?.avg_loudness_lufs ?? -30;
  const peak = analysis?.true_peak_dbfs ?? 0;
  const dynamicRange = analysis?.dynamic_range_lra ?? 0;

  if (
    loudness >= -18 &&
    loudness <= -12 &&
    peak <= -1 &&
    dynamicRange >= 2.5 &&
    dynamicRange <= 8
  ) {
    return {
      title: "Your audio is creator-ready",
      description:
        "The enhanced recording has strong loudness, safe peak levels, and balanced dynamics for YouTube narration.",
      status: "Excellent",
      style:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    };
  }

  return {
    title: "Your audio has improved, with a few opportunities remaining",
    description:
      "The recording is usable, but applying the recommended settings may improve consistency and clarity.",
    status: "Needs Review",
    style: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  };
};

export default function AIRecommendations({ analysis }: Props) {
  const recommendations = generateRecommendations(analysis);
  const suggestedPreset = getSuggestedPreset(analysis);
  const suggestedSettings = getSuggestedSettings(analysis);
  const assessment = getOverallAssessment(analysis);

  return (
    <section className="mt-6 rounded-2xl border border-indigo-700/60 bg-indigo-950/40 p-6 text-left shadow-lg">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            🤖 AI Creator Assistant
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Local AI analysis based on your enhanced audio metrics
          </p>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${assessment.style}`}
        >
          {assessment.status}
        </span>
      </div>

      {/* Overall assessment */}
      <div className={`mb-6 rounded-xl border p-5 ${assessment.style}`}>
        <p className="font-semibold">{assessment.title}</p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {assessment.description}
        </p>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Recommended Actions
        </h4>

        <div className="space-y-3">
          {recommendations.map((item, index) => {
            const priority = getPriorityStyle(item.priority);

            return (
              <div
                key={`${item.title}-${index}`}
                className="rounded-xl border border-slate-700 bg-slate-950/80 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className="mt-0.5">{priority.icon}</span>

                    <div>
                      <p className="font-semibold text-white">{item.title}</p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${priority.badge}`}
                  >
                    {priority.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested preset */}
      <div className="mb-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
          Suggested Preset
        </p>

        <div className="mt-3 flex items-start gap-3">
          <span className="text-2xl">{suggestedPreset.icon}</span>

          <div>
            <p className="font-semibold text-white">{suggestedPreset.name}</p>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {suggestedPreset.description}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested settings */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Recommended Settings
        </h4>

        <div className="grid gap-3 sm:grid-cols-2">
          <SettingItem
            label="Noise Reduction"
            value={suggestedSettings.noiseReduction}
          />

          <SettingItem
            label="Voice Clarity"
            value={suggestedSettings.voiceClarity}
          />

          <SettingItem
            label="Echo Removal"
            value={suggestedSettings.echoRemoval}
          />

          <SettingItem
            label="Loudness"
            value={suggestedSettings.loudness}
          />
        </div>
      </div>
    </section>
  );
}

type SettingItemProps = {
  label: string;
  value: number;
};

function SettingItem({ label, value }: SettingItemProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>

        <span className="text-sm font-semibold text-white">{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}