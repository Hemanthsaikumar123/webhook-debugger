import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWebhookById, replayWebhook } from "../services/api";

export default function WebhookDetail() {
  const { id } = useParams();
  const {slug} = useParams();

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

  if (loading) return <p>Loading webhook...</p>;
  if (error) return <p>{error}</p>;
  if (!webhook) return <p>Webhook not found</p>;

  return (
    <div>
      <h2>Webhook #{webhook.id}</h2>

      <p><b>Method:</b> {webhook.method}</p>
      <p><b>Received at:</b> {webhook.received_at}</p>
      <p><b>Forwarded status:</b> {webhook.forwarded_status ?? "Not forwarded"}</p>

      <button onClick={handleReplay} disabled={replaying}>
        {replaying ? "Replaying..." : "Replay Webhook"}
      </button>

      <h3>Payload</h3>
      <pre>{JSON.stringify(webhook.body, null, 2)}</pre>

      <h3>Headers</h3>
      <pre>{JSON.stringify(webhook.headers, null, 2)}</pre>

      {webhook.forwarded_response && (
        <>
          <h3>Forwarded Response</h3>
          <pre>{webhook.forwarded_response}</pre>
        </>
      )}
    </div>
  );
}
