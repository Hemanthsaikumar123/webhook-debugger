import { useParams } from "react-router-dom";

export default function WebhookDetail() {
  const { id } = useParams();
  return <h2>Webhook Detail: {id}</h2>;
}
