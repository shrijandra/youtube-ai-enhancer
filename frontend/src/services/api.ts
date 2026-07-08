import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 2400000,
});

export default api;