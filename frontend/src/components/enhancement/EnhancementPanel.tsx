import { useState } from "react";
import { uploadFile } from "@/services/uploadService";
import ParameterSlider from "./ParameterSlider";
import PresetSelector from "./PresetSelector";
import EnhanceButton from "./EnhanceButton";

import { processMedia } from "@/services/processService";


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

  const handleEnhance = async () => {
  try {
    setUploading(true);

    const uploadResult = await uploadFile(file);

    console.log("Upload result:", uploadResult);

    const processResult = await processMedia(
      uploadResult.filename,
      settings
      );

    console.log("Process result:", processResult);
    // Save the URL returned by FastAPI
   // setProcessedAudioUrl(processResult.download_url);
    setProcessedMediaUrl(processResult.download_url);
    alert(`✅ ${file.type.startsWith("video/") ? "Video" : "Audio"} enhanced successfully!`);
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

      <EnhanceButton
        onClick={handleEnhance}
        uploading={uploading}
      />
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
    </div>
      
  );
}
