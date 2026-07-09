import { getPool, sql } from "../config/db.js";

export const UserModel = {
  async findByEmail(email) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("email", sql.NVarChar(150), email)
      .query("SELECT * FROM Users WHERE email = @email");
    return result.recordset[0] || null;
  },

  async findById(id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        `SELECT id, name, email, phone, role, is_blocked, created_at
         FROM Users WHERE id = @id`
      );
    return result.recordset[0] || null;
  },

  async create({ name, email, phone, password_hash, role }) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("name", sql.NVarChar(150), name)
      .input("email", sql.NVarChar(150), email)
      .input("phone", sql.NVarChar(20), phone || null)
      .input("password_hash", sql.NVarChar(255), password_hash)
      .input("role", sql.NVarChar(20), role)
      .query(
        `INSERT INTO Users (name, email, phone, password_hash, role)
         OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.phone,
                INSERTED.role, INSERTED.is_blocked, INSERTED.created_at
         VALUES (@name, @email, @phone, @password_hash, @role)`
      );
    return result.recordset[0];
  },

  async setBlocked(id, blocked) {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("blocked", sql.Bit, blocked ? 1 : 0)
      .query(
        `UPDATE Users SET is_blocked = @blocked, updated_at = SYSUTCDATETIME()
         WHERE id = @id`
      );
  },
};