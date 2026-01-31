import pool from "../db.js";

const listProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, slug, target_url, created_at
       FROM projects
       ORDER BY created_at DESC`
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("List projects error:", err);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export default listProjects;
