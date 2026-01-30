import pool from "../db.js";

// 1️⃣ List webhooks for a project
export const listProjectWebhooks = async (req, res) => {
  const { slug } = req.params;

  try {
    const projectResult = await pool.query(
      "SELECT id FROM projects WHERE slug = $1",
      [slug]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectId = projectResult.rows[0].id;

    const webhooksResult = await pool.query(
      `SELECT id, received_at, forwarded_status
       FROM webhook_requests
       WHERE project_id = $1
       ORDER BY received_at DESC`,
      [projectId]
    );

    return res.status(200).json(webhooksResult.rows);
  } catch (err) {
    console.error("List error:", err);
    return res.status(500).json({ error: "Failed to list webhooks" });
  }
};

// 2️⃣ Inspect a single webhook
export const getWebhookById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, method, headers, body, raw_body, source_ip,
              received_at, forwarded_status, forwarded_response
       FROM webhook_requests
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Inspect error:", err);
    return res.status(500).json({ error: "Failed to fetch webhook" });
  }
};
