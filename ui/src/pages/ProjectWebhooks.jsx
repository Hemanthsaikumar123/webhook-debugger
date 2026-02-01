import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjectWebhooks } from "../services/api";
import "../App.css";

export default function ProjectWebhooks() {
  const { slug } = useParams();

  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWebhooks() {
      try {
        const data = await fetchProjectWebhooks(slug);
        setWebhooks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load webhooks");
      } finally {
        setLoading(false);
      }
    }

    loadWebhooks();
  }, [slug]);

  const getStatusBadge = (status) => {
    if (!status) {
      return <span className="badge badge-neutral">Not Forwarded</span>;
    }
    if (status >= 200 && status < 300) {
      return <span className="badge badge-success">✓ {status}</span>;
    }
    if (status >= 400) {
      return <span className="badge badge-error">✗ {status}</span>;
    }
    return <span className="badge badge-warning">{status}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading webhooks...</p>
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

  if (webhooks.length === 0) {
    return (
      <div className="app-container">
        <div className="page-header">
          <h1 className="page-title">{slug}</h1>
          <p className="page-subtitle">Webhook History</p>
        </div>
        <div className="empty-state">
          <h2>No Webhooks Yet</h2>
          <p className="empty-text">Waiting for incoming webhooks to this project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <h1 className="page-title">{slug}</h1>
        <p className="page-subtitle">{webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} received</p>
      </div>

      <div className="card-list">
        {webhooks.map(w => (
          <Link
            key={w.id}
            to={`/projects/${slug}/webhooks/${w.id}`}
            className="card"
            style={{ textDecoration: 'none' }}
          >
            <div className="card-header">
              <h3 className="card-title">Webhook #{w.id}</h3>
              {getStatusBadge(w.forwarded_status)}
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Method:</span>
                <span className="info-value">
                  <code>{w.method || 'POST'}</code>
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Received:</span>
                <span className="info-value">{formatDate(w.received_at)}</span>
              </div>
              {w.forwarded_status && (
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{w.forwarded_status}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
