import { useParams } from "react-router-dom";

export default function ProjectWebhooks() {
  const { slug } = useParams();
  return <h2>Webhooks for project: {slug}</h2>;
}
