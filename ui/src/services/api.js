import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000
});

export async function fetchProjects() {
  const response = await api.get("/projects");
  return response.data;
}
