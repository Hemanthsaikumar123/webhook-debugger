import pool from "../db.js";
import axios from "axios";
import crypto from "crypto";

const receiveWebhook = async (req, res) => {
  const { projectId } = req.params;

  try {
    // 1️⃣ Find project
    const projectResult = await pool.query(
      "SELECT id, target_url FROM projects WHERE slug = $1",
      [projectId]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = projectResult.rows[0];

    // 2️⃣ Compute payload hash (IDEMPOTENCY KEY)
    const payloadHash = crypto
      .createHash("sha256")
      .update(req.rawBody)
      .digest("hex");

    // 3️⃣ Store webhook (idempotent insert)
    let requestId;
    try {
      const insertResult = await pool.query(
        `INSERT INTO webhook_requests
         (project_id, method, headers, body, raw_body, source_ip, payload_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          project.id,
          req.method,
          req.headers,
          req.body,
          req.rawBody,
          req.ip,
          payloadHash
        ]
      );
      requestId = insertResult.rows[0].id;
    } catch (err) {
      // 4️⃣ Duplicate detected → acknowledge & stop
      if (err.code === "23505") { // unique_violation
        return res.status(200).json({
          message: "Duplicate webhook ignored"
        });
      }
      throw err;
    }

    // 5️⃣ Acknowledge Stripe immediately
    res.status(200).json({
      message: "Webhook received",
      requestId
    });

    // 6️⃣ Forward asynchronously (same as Day 3)
    if (project.target_url) {
      try {
        const forwardResponse = await axios({
          method: req.method,
          url: project.target_url,
          headers: { "Content-Type": "application/json" },
          data: req.body,
          timeout: 5000
        });

        await pool.query(
          `UPDATE webhook_requests
           SET forwarded_status = $1,
               forwarded_response = $2
           WHERE id = $3`,
          [
            forwardResponse.status,
            JSON.stringify(forwardResponse.data),
            requestId
          ]
        );
      } catch (forwardError) {
        await pool.query(
          `UPDATE webhook_requests
           SET forwarded_status = $1,
               forwarded_response = $2
           WHERE id = $3`,
          [
            forwardError.response?.status || 500,
            forwardError.message,
            requestId
          ]
        );
      }
    }

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default receiveWebhook;
