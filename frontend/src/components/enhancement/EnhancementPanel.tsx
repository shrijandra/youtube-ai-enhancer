import { useState } from "react";

import ParameterSlider from "./ParameterSlider";
import PresetSelector from "./PresetSelector";
import EnhanceButton from "./EnhanceButton";

interface EnhancementSettings {
  noiseReduction: number;
  voiceClarity: number;
  echoRemoval: number;
  loudness: number;
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
export default function EnhancementPanel() {
  const [settings, setSettings] = useState<EnhancementSettings>(
    presets.Balanced
  );

  const [preset, setPreset] = useState("Balanced");
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
        onClick={() => {
          console.log(settings, preset);
        }}
      />
    </div>
  );
}