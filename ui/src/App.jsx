import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import ProjectWebhooks from "./pages/ProjectWebhooks";
import WebhookDetail from "./pages/WebhookDetail";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug/webhooks" element={<ProjectWebhooks />} />
        <Route path="/projects/:slug/webhooks/:id" element={<WebhookDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
