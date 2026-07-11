import { useEffect, useState } from "react";
import { uploadFile } from "@/services/uploadService";
import ParameterSlider from "./ParameterSlider";
import PresetSelector from "./PresetSelector";
import EnhanceButton from "./EnhanceButton";

import { processMedia } from "@/services/processService";
import { analyzeMedia } from "@/services/analysisService";
 
import AIRecommendations from "@/components/analysis/AIRecommendations";
import AudioAnalysisDashboard from "@/components/analysis/AudioAnalysisDashboard";
import BeforeAfterComparison from "@/components/analysis/BeforeAfterComparison";

import CreatorScoreCard from "@/components/CreatorScoreCard";


interface EnhancementSettings {
  noiseReduction: number;
  voiceClarity: number;
  echoRemoval: number;
  loudness: number;
}

interface Props {
    file: File;
}

const presets = {
  Balanced: {
    noiseReduction: 80,
    voiceClarity: 60,
    echoRemoval: 50,
    loudness: 70,
  },

  Podcast: {
    noiseReduction: 75,
    voiceClarity: 90,
    echoRemoval: 40,
    loudness: 80,
  },

  Studio: {
    noiseReduction: 60,
    voiceClarity: 100,
    echoRemoval: 30,
    loudness: 85,
  },

  "Strong Noise Removal": {
    noiseReduction: 100,
    voiceClarity: 70,
    echoRemoval: 90,
    loudness: 65,
  },

  "Voice Focus": {
    noiseReduction: 50,
    voiceClarity: 100,
    echoRemoval: 20,
    loudness: 75,
  },
};

const calculateCreatorScore = (analysis: any) => {
  let score = 40;

  // Loudness: ideal for YouTube voice is around -16 to -14 LUFS
  if (analysis.avg_loudness_lufs >= -16 && analysis.avg_loudness_lufs <= -14) {
    score += 20;
  } else if (
    analysis.avg_loudness_lufs >= -18 &&
    analysis.avg_loudness_lufs <= -12
  ) {
    score += 12;
  } else {
    score += 5;
  }

  // Peak safety
  if (analysis.true_peak_dbfs <= -1.0) {
    score += 15;
  } else if (analysis.true_peak_dbfs <= -0.5) {
    score += 8;
  }

  // Dynamic range
  if (analysis.dynamic_range_lra >= 3 && analysis.dynamic_range_lra <= 6) {
    score += 15;
  } else if (
    analysis.dynamic_range_lra >= 2 &&
    analysis.dynamic_range_lra <= 8
  ) {
    score += 8;
  }

  // Pauses
  if (analysis.pauses_count <= 25) {
    score += 10;
  } else if (analysis.pauses_count <= 45) {
    score += 6;
  } else if (analysis.pauses_count <= 65) {
    score += 3;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};
//Initialize the state:
export default function EnhancementPanel({
  file,
}: Props) {
  const [settings, setSettings] = useState<EnhancementSettings>(
    presets.Balanced
  );

  const [preset, setPreset] = useState("Balanced");
  
  //const [processedAudioUrl, setProcessedAudioUrl] = useState("");
  const [processedMediaUrl, setProcessedMediaUrl] = useState("");
 // const [analysis, setAnalysis] = useState<any>(null);
  const [beforeAnalysis, setBeforeAnalysis] = useState<any>(null);
  const [afterAnalysis, setAfterAnalysis] = useState<any>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
//Update function
  const updateSetting = (
    key: keyof EnhancementSettings,
    value: number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const [uploading, setUploading] = useState(false);
  //const [uploadedFileId, setUploadedFileId] = useState("");

 const handleFileUpload = async (file: File) => {
  try {
    setUploading(true);

    // Reset previous results when a new file is selected
    setProcessedMediaUrl("");
    setBeforeAnalysis(null);
    setAfterAnalysis(null);
    setAiSettingsApplied(false);

    // Upload original file
    const uploadResult = await uploadFile(file);

    setUploadedFilename(uploadResult.filename);

    // Analyze original file before enhancement
    const originalAnalysis = await analyzeMedia(uploadResult.filename);

    console.log("Before Analysis:", originalAnalysis);

    setBeforeAnalysis(originalAnalysis);
  } catch (error: any) {
    console.error("Upload or analysis error:", error);

    alert(
      error?.response?.data?.detail ||
        error?.message ||
        "❌ Upload or original analysis failed."
    );
  } finally {
    setUploading(false);
  }
};
   useEffect(() => {
    if (!file) return;

    handleFileUpload(file);
  }, [file]);

const handleEnhance = async () => {
  if (!uploadedFilename) {
    alert("Please upload a file first.");
    return;
  }

  try {
    setUploading(true);

    // Process uploaded audio/video using current slider settings
    const processResult = await processMedia(
      uploadedFilename,
      settings
    );

    console.log("Process Result:", processResult);

    // Show processed media player and download link
    setProcessedMediaUrl(processResult.download_url);

    // Analyze enhanced output
    const enhancedAnalysis = await analyzeMedia(
      processResult.output_file
    );

    console.log("After Analysis:", enhancedAnalysis);

    setAfterAnalysis(enhancedAnalysis);

    alert("✅ Media enhanced successfully!");
  } catch (error: any) {
    console.error("Processing error:", error);

    alert(
      error?.response?.data?.detail ||
        error?.message ||
        "❌ Processing failed."
    );
  } finally {
    setUploading(false);
  }
};
 const beforeScore = beforeAnalysis
  ? calculateCreatorScore(beforeAnalysis)
  : 0;

const afterScore = afterAnalysis
  ? calculateCreatorScore(afterAnalysis)
  : 0;

const scoreImprovement = afterScore - beforeScore;
const [aiSettingsApplied, setAiSettingsApplied] = useState(false);

const handleApplyAISettings = (recommendedSettings: {
  noiseReduction: number;
  voiceClarity: number;
  echoRemoval: number;
  loudness: number;
}) => {
  setSettings((previousSettings) => ({
    ...previousSettings,
    ...recommendedSettings,
  }));
  setAfterAnalysis(null);
  setAiSettingsApplied(true);
};

//Render
  return (
    <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        🤖 AI Enhancement
      </h2>

      <ParameterSlider
        label="Noise Reduction"
        value={settings.noiseReduction}
        onChange={(v) => updateSetting("noiseReduction", v)}
      />

      <div className="mt-6" />

      <ParameterSlider
        label="Voice Clarity"
        value={settings.voiceClarity}
        onChange={(v) => updateSetting("voiceClarity", v)}
      />

      <div className="mt-6" />

      <ParameterSlider
        label="Echo Removal"
        value={settings.echoRemoval}
        onChange={(v) => updateSetting("echoRemoval", v)}
      />

      <div className="mt-6" />

      <ParameterSlider
        label="Loudness"
        value={settings.loudness}
        onChange={(v) => updateSetting("loudness", v)}
      />

      <div className="mt-8" />

      <PresetSelector
        preset={preset}
        onChange={(newPreset) => {
          setPreset(newPreset);
          setSettings(
            presets[newPreset as keyof typeof presets]
        );
        }}
       />
      {/* ================================
      AI analyzes the original recording
      ================================== */}

      {beforeAnalysis && !afterAnalysis && (
      <AIRecommendations
          analysis={beforeAnalysis}
          onApplySettings={handleApplyAISettings}
          settingsApplied={aiSettingsApplied}
         />
      )}
      <EnhanceButton
        onClick={handleEnhance}
        uploading={uploading}
      />
      {/* ==========================
       Processed Media Preview
    =========================== */}
      {processedMediaUrl && (
  <div className="mt-6 rounded-xl border p-4">
    <h3 className="font-semibold mb-3">
      Processed {file.type.startsWith("video/") ? "Video" : "Audio"}
    </h3>

    {file.type.startsWith("video/") ? (
      <video
        controls
        src={processedMediaUrl}
        className="w-full rounded-lg"
      />
    ) : (
      <audio
        controls
        src={processedMediaUrl}
        className="w-full"
      />
    )}

    <a
      href={processedMediaUrl}
      download
      className="inline-block mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
    >
      Download {file.type.startsWith("video/") ? "MP4" : "WAV"}
    </a>
  </div>
  )}

    
    
    {/* ==========================
       Audio Analysis Dashboard
    =========================== */}
  {afterAnalysis && (
  <>
    
    <CreatorScoreCard score={calculateCreatorScore(afterAnalysis)} />

    <AudioAnalysisDashboard analysis={afterAnalysis} />

    
  </>
 )}

  {beforeAnalysis && afterAnalysis && (
  <BeforeAfterComparison
    before={beforeAnalysis}
    after={afterAnalysis}

    beforeScore={beforeScore}
    afterScore={afterScore}
    scoreImprovement={scoreImprovement}
  />
  )}
    </div>
      
  );
}
