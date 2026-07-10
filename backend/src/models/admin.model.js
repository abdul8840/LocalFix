import { getPool, sql } from "../config/db.js";

export const AdminModel = {
  // ---------- ANALYTICS ----------
  async getKpis() {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Users WHERE role='customer') AS total_customers,
        (SELECT COUNT(*) FROM Users WHERE role='worker')   AS total_workers,
        (SELECT COUNT(*) FROM WorkerProfiles WHERE verification_status='pending')   AS pending_workers,
        (SELECT COUNT(*) FROM WorkerProfiles WHERE verification_status='approved')  AS approved_workers,
        (SELECT COUNT(*) FROM WorkerProfiles WHERE verification_status='rejected')  AS rejected_workers,
        (SELECT COUNT(*) FROM Users WHERE is_blocked=1)    AS blocked_users,
        (SELECT COUNT(*) FROM ServiceRequests)             AS total_requests,
        (SELECT COUNT(*) FROM ServiceRequests WHERE status='completed') AS completed_requests,
        (SELECT COUNT(*) FROM ServiceRequests WHERE status IN ('pending','accepted','in_progress')) AS active_requests,
        (SELECT COUNT(*) FROM Reviews)                     AS total_reviews,
        (SELECT ISNULL(AVG(CAST(rating AS DECIMAL(3,2))),0) FROM Reviews) AS avg_rating,
        (SELECT COUNT(*) FROM FraudAlerts WHERE resolved=0) AS open_alerts
    `);
    return result.recordset[0];
  },

  async getRequestsPerDay(days = 14) {
    const pool = getPool();
    const result = await pool.request()
      .input("days", sql.Int, days)
      .query(`
        SELECT
          CAST(created_at AS DATE) AS day,
          COUNT(*) AS count
        FROM ServiceRequests
        WHERE created_at >= DATEADD(DAY, -@days, SYSUTCDATETIME())
        GROUP BY CAST(created_at AS DATE)
        ORDER BY day
      `);
    return result.recordset;
  },

  async getCategoryBreakdown() {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT c.name AS category, COUNT(sr.id) AS request_count
      FROM ServiceCategories c
      LEFT JOIN ServiceRequests sr ON sr.category_id = c.id
      GROUP BY c.name
      ORDER BY request_count DESC
    `);
    return result.recordset;
  },

  async getTopWorkers(limit = 5) {
    const pool = getPool();
    const result = await pool.request()
      .input("lim", sql.Int, limit)
      .query(`
        SELECT TOP (@lim)
          wp.id, wp.user_id, u.name, c.name AS category,
          wp.rating_avg, wp.total_reviews, wp.jobs_completed, wp.city, wp.pincode
        FROM WorkerProfiles wp
        JOIN Users u ON u.id = wp.user_id
        JOIN ServiceCategories c ON c.id = wp.category_id
        WHERE wp.verification_status = 'approved'
        ORDER BY wp.rating_avg DESC, wp.jobs_completed DESC
      `);
    return result.recordset;
  },

  // ---------- WORKERS ----------
  async listWorkers({ status } = {}) {
    const pool = getPool();
    const req = pool.request();
    let where = "1=1";
    if (status) {
      req.input("status", sql.NVarChar(20), status);
      where = "wp.verification_status = @status";
    }
    const result = await req.query(`
      SELECT wp.id, wp.user_id, wp.verification_status, wp.rating_avg,
             wp.total_reviews, wp.jobs_completed, wp.pincode, wp.city, wp.state,
             wp.experience_years, wp.bio, wp.id_proof_url, wp.availability, wp.created_at,
             u.name, u.email, u.phone, u.is_blocked,
             c.name AS category_name, c.icon AS category_icon
      FROM WorkerProfiles wp
      JOIN Users u ON u.id = wp.user_id
      JOIN ServiceCategories c ON c.id = wp.category_id
      WHERE ${where}
      ORDER BY wp.created_at DESC
    `);
    return result.recordset;
  },

  async setWorkerVerification(worker_profile_id, status) {
    const pool = getPool();
    await pool.request()
      .input("id", sql.Int, worker_profile_id)
      .input("status", sql.NVarChar(20), status)
      .query(`
        UPDATE WorkerProfiles
        SET verification_status = @status, updated_at = SYSUTCDATETIME()
        WHERE id = @id
      `);
  },

  // ---------- USERS ----------
  async listUsers({ role, search } = {}) {
    const pool = getPool();
    const req = pool.request();
    let where = ["role <> 'admin'"];
    if (role) {
      req.input("role", sql.NVarChar(20), role);
      where.push("role = @role");
    }
    if (search) {
      req.input("q", sql.NVarChar(200), `%${search}%`);
      where.push("(name LIKE @q OR email LIKE @q OR phone LIKE @q)");
    }
    const result = await req.query(`
      SELECT id, name, email, phone, role, is_blocked, created_at
      FROM Users
      WHERE ${where.join(" AND ")}
      ORDER BY created_at DESC
    `);
    return result.recordset;
  },

  // ---------- REVIEWS ----------
  async listReviews({ flagged } = {}) {
    const pool = getPool();
    const req = pool.request();
    let where = "1=1";
    if (flagged === true)  where = "r.is_flagged = 1";
    if (flagged === false) where = "r.is_flagged = 0";
    const result = await req.query(`
      SELECT r.id, r.request_id, r.rating, r.comment, r.is_flagged, r.created_at,
             cu.name AS customer_name, cu.id AS customer_id,
             wu.name AS worker_name,   wu.id AS worker_id
      FROM Reviews r
      JOIN Users cu ON cu.id = r.customer_id
      JOIN Users wu ON wu.id = r.worker_id
      WHERE ${where}
      ORDER BY r.created_at DESC
    `);
    return result.recordset;
  },

  async setReviewFlag(review_id, flagged) {
    const pool = getPool();
    await pool.request()
      .input("id", sql.Int, review_id)
      .input("flag", sql.Bit, flagged ? 1 : 0)
      .query("UPDATE Reviews SET is_flagged = @flag WHERE id = @id");
  },

  async deleteReview(review_id) {
    const pool = getPool();
    await pool.request()
      .input("id", sql.Int, review_id)
      .query("DELETE FROM Reviews WHERE id = @id");
  },
};