import { getPool, sql } from "../config/db.js";

export const FraudModel = {
  async create({ worker_id, reason, severity = "low" }) {
    const pool = getPool();
    const result = await pool.request()
      .input("worker_id", sql.Int, worker_id)
      .input("reason", sql.NVarChar(500), reason)
      .input("severity", sql.NVarChar(20), severity)
      .query(`
        INSERT INTO FraudAlerts (worker_id, reason, severity)
        OUTPUT INSERTED.*
        VALUES (@worker_id, @reason, @severity)
      `);
    return result.recordset[0];
  },

  async list({ resolved } = {}) {
    const pool = getPool();
    const req = pool.request();
    let where = "1=1";
    if (resolved === true)  where = "fa.resolved = 1";
    if (resolved === false) where = "fa.resolved = 0";
    const result = await req.query(`
      SELECT fa.*, u.name AS worker_name, u.email AS worker_email,
             u.is_blocked, wp.rating_avg, wp.total_reviews
      FROM FraudAlerts fa
      JOIN Users u ON u.id = fa.worker_id
      LEFT JOIN WorkerProfiles wp ON wp.user_id = fa.worker_id
      WHERE ${where}
      ORDER BY
        CASE fa.severity WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        fa.created_at DESC
    `);
    return result.recordset;
  },

  async existsForWorker(worker_id, reason) {
    const pool = getPool();
    const result = await pool.request()
      .input("wid", sql.Int, worker_id)
      .input("reason", sql.NVarChar(500), reason)
      .query(`
        SELECT TOP 1 id FROM FraudAlerts
        WHERE worker_id = @wid AND reason = @reason AND resolved = 0
      `);
    return result.recordset.length > 0;
  },

  async resolve(id) {
    const pool = getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .query("UPDATE FraudAlerts SET resolved = 1 WHERE id = @id");
  },
};