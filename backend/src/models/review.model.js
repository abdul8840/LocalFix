import { getPool, sql } from "../config/db.js";

export const ReviewModel = {
  async create({ request_id, customer_id, worker_id, rating, comment }) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("request_id", sql.Int, request_id)
      .input("customer_id", sql.Int, customer_id)
      .input("worker_id", sql.Int, worker_id)
      .input("rating", sql.Int, rating)
      .input("comment", sql.NVarChar(1000), comment || null)
      .query(
        `INSERT INTO Reviews (request_id, customer_id, worker_id, rating, comment)
         OUTPUT INSERTED.*
         VALUES (@request_id, @customer_id, @worker_id, @rating, @comment)`
      );
    return result.recordset[0];
  },

  async findByRequestId(request_id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("rid", sql.Int, request_id)
      .query("SELECT * FROM Reviews WHERE request_id = @rid");
    return result.recordset[0] || null;
  },

  async findByWorker(worker_id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("wid", sql.Int, worker_id)
      .query(
        `SELECT r.*, u.name AS customer_name
         FROM Reviews r
         JOIN Users u ON u.id = r.customer_id
         WHERE r.worker_id = @wid
         ORDER BY r.created_at DESC`
      );
    return result.recordset;
  },
};