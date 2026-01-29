import pool from "../db.js";
import axios from "axios";

const replayWebhook = async (req, res) => {
  const { requestId } = req.params;

  try {
    // 1️⃣ Fetch webhook record
    const webhookResult = await pool.query(
      "SELECT * FROM webhook_requests WHERE id = $1",
      [requestId]
    );

    if (webhookResult.rowCount === 0) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    const webhook = webhookResult.rows[0];

    // 2️⃣ Fetch project (to get target_url)
    const projectResult = await pool.query(
      "SELECT target_url FROM projects WHERE id = $1",
      [webhook.project_id]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { target_url } = projectResult.rows[0];

    if (!target_url) {
      return res.status(400).json({ error: "No target_url configured" });
    }

    // 3️⃣ Forward webhook again
    const response = await axios({
      method: webhook.method,
      url: target_url,
      headers: {
        "Content-Type": "application/json"
      },
      data: webhook.body,
      timeout: 5000
    });

    // 4️⃣ Update webhook record
    await pool.query(
      `UPDATE webhook_requests
       SET forwarded_status = $1,
           forwarded_response = $2
       WHERE id = $3`,
      [
        response.status,
        JSON.stringify(response.data),
        requestId
      ]
    );

    return res.status(200).json({
      message: "Webhook replayed successfully",
      status: response.status
    });

  } catch (err) {
    console.error("Replay error:", err);
    return res.status(500).json({ error: "Replay failed" });
  }
};

export default replayWebhook;
