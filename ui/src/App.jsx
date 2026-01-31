import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import ProjectWebhooks from "./pages/ProjectWebhooks";
import WebhookDetail from "./pages/WebhookDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug/webhooks" element={<ProjectWebhooks />} />
        <Route path="/projects/:slug/webhooks/:id" element={<WebhookDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
