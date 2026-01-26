import pool from "../db.js";

const receiveWebhook = async (req, res) => {
  const { projectId } = req.params;

  try {
    // find project by slug
    const projectResult = await pool.query(
      "SELECT id FROM projects WHERE slug = $1",
      [projectId]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectIdDb = projectResult.rows[0].id;

    // save webhook
    const insertResult = await pool.query(
      `INSERT INTO webhook_requests
       (project_id, method, headers, body, raw_body, source_ip)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        projectIdDb,
        req.method,
        req.headers,
        req.body,
        req.rawBody,
        req.ip
      ]
    );

    res.status(200).json({
      message: "Webhook received & stored",
      requestId: insertResult.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default receiveWebhook;
