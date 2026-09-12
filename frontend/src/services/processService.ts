import api from "./api";

export type EnhancementSettings = {
  noiseReduction: number;
  voiceClarity: number;
  echoRemoval: number;
  loudness: number;

  // V3.2 - keyboard/mouse click suppression
  clickNoiseSuppression?: boolean;
};

export async function processMedia(
  filename: string,
  settings: EnhancementSettings
) {
  const response = await api.post("/process", {
    filename,
    settings,
  });

  return response.data;
}