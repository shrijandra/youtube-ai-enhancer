import api from "./api";

export async function analyzeMedia(filename: string) {
  const response = await api.get(`/analyze/${filename}`);
  return response.data;
}