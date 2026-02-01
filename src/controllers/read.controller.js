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
  const { slug, id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT wr.*
      FROM webhook_requests wr
      JOIN projects p ON wr.project_id = p.id
      WHERE wr.id = $1 AND p.slug = $2
      `,
      [id, slug]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Webhook not found for this project"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Fetch webhook error:", err);
    return res.status(500).json({
      error: "Failed to fetch webhook"
    });
  }
};

