import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchWebhookById, replayWebhook } from "../services/api";
import "../App.css";

export default function WebhookDetail() {
  const { id, slug } = useParams();

  const [webhook, setWebhook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replaying, setReplaying] = useState(false);

  async function loadWebhook() {
    try {
      const data = await fetchWebhookById(id, slug);
      setWebhook(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load webhook");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWebhook();
  }, [id]);

  async function handleReplay() {
    try {
      setReplaying(true);
      await replayWebhook(id);
      await loadWebhook(); // re-sync from backend
    } catch (err) {
      console.error(err);
      alert("Replay failed");
    } finally {
      setReplaying(false);
    }
  }

  const getStatusBadge = (status) => {
    if (!status) {
      return <span className="badge badge-neutral">Not Forwarded</span>;
    }
    if (status >= 200 && status < 300) {
      return <span className="badge badge-success">✓ Success {status}</span>;
    }
    if (status >= 400) {
      return <span className="badge badge-error">✗ Error {status}</span>;
    }
    return <span className="badge badge-warning">Status {status}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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
          <p className="loading-text">Loading webhook...</p>
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

  if (!webhook) {
    return (
      <div className="app-container">
        <div className="error-container">
          <p className="error-text">Webhook not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <Link to={`/projects/${slug}/webhooks`} style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            ← Back to {slug}
          </Link>
          <h1 className="page-title">Webhook #{webhook.id}</h1>
          <p className="page-subtitle">Received {formatDate(webhook.received_at)}</p>
        </div>
        <div className="btn-group" style={{ marginTop: '1rem' }}>
          <button onClick={handleReplay} disabled={replaying}>
            {replaying ? "⏳ Replaying..." : "🔄 Replay Webhook"}
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section-content">
          <div className="card-body" style={{ gap: '1rem' }}>
            <div className="info-row">
              <span className="info-label">Method:</span>
              <span className="info-value"><code>{webhook.method || 'POST'}</code></span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value">{getStatusBadge(webhook.forwarded_status)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Received At:</span>
              <span className="info-value">{formatDate(webhook.received_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">📦 Payload</h2>
        <div className="section-content">
          <pre>{JSON.stringify(webhook.body, null, 2)}</pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">📋 Headers</h2>
        <div className="section-content">
          <pre>{JSON.stringify(webhook.headers, null, 2)}</pre>
        </div>
      </div>

      {webhook.forwarded_response && (
        <div className="section">
          <h2 className="section-title">📡 Forwarded Response</h2>
          <div className="section-content">
            <pre>{webhook.forwarded_response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
