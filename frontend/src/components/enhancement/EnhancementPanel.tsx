import { useState } from "react";
import { uploadFile } from "@/services/uploadService";
import ParameterSlider from "./ParameterSlider";
import PresetSelector from "./PresetSelector";
import EnhanceButton from "./EnhanceButton";
import { processFile } from "@/services/processService";




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
  
  const [processedAudioUrl, setProcessedAudioUrl] = useState("");
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

    const processResult = await processFile(uploadResult.filename);

    console.log("Process result:", processResult);
    // Save the URL returned by FastAPI
    setProcessedAudioUrl(processResult.download_url);

    alert("✅ Audio extracted successfully!");
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
      {processedAudioUrl && (
  <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
    <h3 className="mb-3 font-semibold">
      Processed Audio
    </h3>

    <audio
      controls
      src={processedAudioUrl}
      className="w-full"
    />

    <a
      href={processedAudioUrl}
      download
      className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Download WAV
    </a>
  </div>
    )}
    </div>
      
  );
}
