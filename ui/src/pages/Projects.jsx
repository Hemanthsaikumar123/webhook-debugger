import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../services/api";
import "../App.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <p className="error-text">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="app-container">
        <div className="empty-state">
          <h2>No Projects Yet</h2>
          <p className="empty-text">Create your first project to start receiving webhooks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Manage and monitor your webhook projects</p>
      </div>

      <div className="card-list">
        {projects.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.slug}/webhooks`}
            className="card"
            style={{ textDecoration: 'none' }}
          >
            <div className="card-header">
              <h3 className="card-title">{project.name}</h3>
              {/* <span className="badge badge-info">Active</span> */}
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Slug:</span>
                <span className="info-value">{project.slug}</span>
              </div>
              {project.forward_url && (
                <div className="info-row">
                  <span className="info-label">Forward URL:</span>
                  <span className="info-value" style={{ fontSize: '0.75rem' }}>
                    {project.forward_url}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
