import { getPool, sql } from "../config/db.js";

export const WorkerProfileModel = {
  async create({
    user_id,
    category_id,
    experience_years,
    bio,
    pincode,
    city,
    state,
    latitude,
    longitude,
    id_proof_url,
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
      .query("SELECT * FROM WorkerProfiles WHERE user_id = @user_id");
    return result.recordset[0] || null;
  },
};