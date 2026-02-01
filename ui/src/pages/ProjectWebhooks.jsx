import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjectWebhooks } from "../services/api";

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

  if (loading) return <p>Loading webhooks...</p>;
  if (error) return <p>{error}</p>;

  if (webhooks.length === 0) {
    return <p>No webhooks received for this project.</p>;
  }

  return (
    <div>
      <h2>Webhooks for project: {slug}</h2>

      <ul>
        {webhooks.map(w => (
          <li key={w.id}>
            <Link to={`/projects/${slug}/webhooks/${w.id}`}>
              Webhook #{w.id} —{" "}
              {w.forwarded_status ? `Status ${w.forwarded_status}` : "Not forwarded"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
