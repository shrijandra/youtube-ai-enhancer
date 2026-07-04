import api from "./api";

export async function processFile(filename: string) {
  const response = await api.post(`/process/${filename}`);

  return response.data;
}