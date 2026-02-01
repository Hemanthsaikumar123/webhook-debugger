import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000
});

//Get the projects 

export async function fetchProjects() {
  const response = await api.get("/projects");
  return response.data;
}


// Get the project webhooks -> /projects/:slug/webhooks
export async function fetchProjectWebhooks(slug) {
  const response = await api.get(`/projects/${slug}/webhooks`);
  return response.data;
}


// GET /webhooks/:id
export async function fetchWebhookById(id,slug) {
  const response = await api.get(`/projects/${slug}/webhooks/${id}`);
  return response.data;
}

// POST /webhooks/replay/:id
export async function replayWebhook(id) {
  const response = await api.post(`/webhooks/replay/${id}`);
  return response.data;
}
