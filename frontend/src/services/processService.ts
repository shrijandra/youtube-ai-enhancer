import api from "./api";

export type EnhancementSettings = {
  noiseReduction: number;
  voiceClarity: number;
  echoRemoval: number;
  loudness: number;
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