import api from "./api";

export async function processVideo(filename: string) {
  const response = await api.post(`/process-video/${filename}`);

  return response.data;
}