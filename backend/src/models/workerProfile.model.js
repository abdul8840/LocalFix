import { getPool, sql } from "../config/db.js";

export const WorkerProfileModel = {
  async create({
    user_id, category_id, experience_years, bio,
    pincode, city, state, latitude, longitude, id_proof_url,
  }) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .input("category_id", sql.Int, category_id)
      .input("experience_years", sql.Int, experience_years || 0)
      .input("bio", sql.NVarChar(1000), bio || null)
      .input("pincode", sql.NVarChar(10), pincode)
      .input("city", sql.NVarChar(100), city || null)
      .input("state", sql.NVarChar(100), state || null)
      .input("latitude", sql.Decimal(9, 6), latitude || null)
      .input("longitude", sql.Decimal(9, 6), longitude || null)
      .input("id_proof_url", sql.NVarChar(500), id_proof_url || null)
      .query(
        `INSERT INTO WorkerProfiles
         (user_id, category_id, experience_years, bio, pincode, city, state,
          latitude, longitude, id_proof_url)
         OUTPUT INSERTED.*
         VALUES
         (@user_id, @category_id, @experience_years, @bio, @pincode, @city, @state,
          @latitude, @longitude, @id_proof_url)`
      );
    return result.recordset[0];
  },

  async findByUserId(user_id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .query(
        `SELECT wp.*, u.name, u.email, u.phone, c.name AS category_name, c.icon AS category_icon
         FROM WorkerProfiles wp
         JOIN Users u ON u.id = wp.user_id
         JOIN ServiceCategories c ON c.id = wp.category_id
         WHERE wp.user_id = @user_id`
      );
    return result.recordset[0] || null;
  },

  async findById(id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        `SELECT wp.*, u.name, u.email, u.phone, c.name AS category_name, c.icon AS category_icon
         FROM WorkerProfiles wp
         JOIN Users u ON u.id = wp.user_id
         JOIN ServiceCategories c ON c.id = wp.category_id
         WHERE wp.id = @id`
      );
    return result.recordset[0] || null;
  },

  async updateByUserId(user_id, updates) {
    const pool = getPool();
    const req = pool.request().input("user_id", sql.Int, user_id);

    const fields = [];
    const map = {
      experience_years: sql.Int,
      bio: sql.NVarChar(1000),
      pincode: sql.NVarChar(10),
      city: sql.NVarChar(100),
      state: sql.NVarChar(100),
      latitude: sql.Decimal(9, 6),
      longitude: sql.Decimal(9, 6),
      availability: sql.Bit,
      profile_image_url: sql.NVarChar(500),
    };

    for (const [key, type] of Object.entries(map)) {
      if (updates[key] !== undefined) {
        req.input(key, type, updates[key]);
        fields.push(`${key} = @${key}`);
      }
    }

    if (!fields.length) return this.findByUserId(user_id);

    await req.query(
      `UPDATE WorkerProfiles
       SET ${fields.join(", ")}, updated_at = SYSUTCDATETIME()
       WHERE user_id = @user_id`
    );
    return this.findByUserId(user_id);
  },

  /**
   * Discover workers by category + pincode/location.
   * Category is optional. If lat/lng provided, distance is calculated in JS.
   * Only APPROVED, unblocked, available workers are returned.
   */
  async discover({ category_id, pincode }) {
    const pool = getPool();
    const req = pool.request();

    let whereClauses = [
      "wp.verification_status = 'approved'",
      "wp.availability = 1",
      "u.is_blocked = 0",
    ];

    if (category_id) {
      req.input("category_id", sql.Int, category_id);
      whereClauses.push("wp.category_id = @category_id");
    }

    if (pincode) {
      req.input("pincode", sql.NVarChar(10), pincode);
      // Match same pincode OR first 3 digits (rough proximity)
      whereClauses.push(
        "(wp.pincode = @pincode OR LEFT(wp.pincode, 3) = LEFT(@pincode, 3))"
      );
    }

    const result = await req.query(
      `SELECT wp.id, wp.user_id, wp.category_id, wp.experience_years, wp.bio,
              wp.pincode, wp.city, wp.state, wp.latitude, wp.longitude,
              wp.rating_avg, wp.total_reviews, wp.jobs_completed,
              wp.profile_image_url,
              u.name, u.phone,
              c.name AS category_name, c.icon AS category_icon
       FROM WorkerProfiles wp
       JOIN Users u ON u.id = wp.user_id
       JOIN ServiceCategories c ON c.id = wp.category_id
       WHERE ${whereClauses.join(" AND ")}`
    );

    return result.recordset;
  },

  async recalcStats(worker_user_id) {
    const pool = getPool();
    await pool
      .request()
      .input("uid", sql.Int, worker_user_id)
      .query(`
        UPDATE wp
        SET rating_avg = ISNULL(agg.avg_rating, 0),
            total_reviews = ISNULL(agg.cnt, 0),
            jobs_completed = ISNULL(jc.jobs, 0),
            updated_at = SYSUTCDATETIME()
        FROM WorkerProfiles wp
        LEFT JOIN (
          SELECT worker_id, AVG(CAST(rating AS DECIMAL(3,2))) AS avg_rating, COUNT(*) AS cnt
          FROM Reviews GROUP BY worker_id
        ) agg ON agg.worker_id = wp.user_id
        LEFT JOIN (
          SELECT worker_id, COUNT(*) AS jobs
          FROM ServiceRequests
          WHERE status = 'completed'
          GROUP BY worker_id
        ) jc ON jc.worker_id = wp.user_id
        WHERE wp.user_id = @uid
      `);
  },
};