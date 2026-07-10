import { getPool, sql } from "../config/db.js";

export const ServiceRequestModel = {
  async create({
    customer_id, worker_id, category_id,
    description, address, pincode, scheduled_date,
  }) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("customer_id", sql.Int, customer_id)
      .input("worker_id", sql.Int, worker_id)
      .input("category_id", sql.Int, category_id)
      .input("description", sql.NVarChar(1000), description)
      .input("address", sql.NVarChar(500), address)
      .input("pincode", sql.NVarChar(10), pincode)
      .input("scheduled_date", sql.DateTime2, scheduled_date || null)
      .query(
        `INSERT INTO ServiceRequests
         (customer_id, worker_id, category_id, description, address, pincode, scheduled_date)
         OUTPUT INSERTED.*
         VALUES
         (@customer_id, @worker_id, @category_id, @description, @address, @pincode, @scheduled_date)`
      );
    return result.recordset[0];
  },

  async findById(id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        `SELECT sr.*,
                cu.name AS customer_name, cu.phone AS customer_phone,
                wu.name AS worker_name, wu.phone AS worker_phone,
                c.name AS category_name
         FROM ServiceRequests sr
         JOIN Users cu ON cu.id = sr.customer_id
         JOIN Users wu ON wu.id = sr.worker_id
         JOIN ServiceCategories c ON c.id = sr.category_id
         WHERE sr.id = @id`
      );
    return result.recordset[0] || null;
  },

  async findByCustomer(customer_id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("cid", sql.Int, customer_id)
      .query(
        `SELECT sr.*,
                wu.name AS worker_name, wu.phone AS worker_phone,
                c.name AS category_name, c.icon AS category_icon,
                CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS has_review
         FROM ServiceRequests sr
         JOIN Users wu ON wu.id = sr.worker_id
         JOIN ServiceCategories c ON c.id = sr.category_id
         LEFT JOIN Reviews r ON r.request_id = sr.id
         WHERE sr.customer_id = @cid
         ORDER BY sr.created_at DESC`
      );
    return result.recordset;
  },

  async findByWorker(worker_id) {
    const pool = getPool();
    const result = await pool
      .request()
      .input("wid", sql.Int, worker_id)
      .query(
        `SELECT sr.*,
                cu.name AS customer_name, cu.phone AS customer_phone,
                c.name AS category_name, c.icon AS category_icon
         FROM ServiceRequests sr
         JOIN Users cu ON cu.id = sr.customer_id
         JOIN ServiceCategories c ON c.id = sr.category_id
         WHERE sr.worker_id = @wid
         ORDER BY sr.created_at DESC`
      );
    return result.recordset;
  },

  async updateStatus(id, status, extras = {}) {
    const pool = getPool();
    const req = pool.request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar(20), status);

    let sets = ["status = @status"];
    if (extras.price !== undefined) {
      req.input("price", sql.Decimal(10, 2), extras.price);
      sets.push("price = @price");
    }
    if (extras.payment_status !== undefined) {
      req.input("payment_status", sql.NVarChar(20), extras.payment_status);
      sets.push("payment_status = @payment_status");
    }
    if (status === "completed") sets.push("completed_at = SYSUTCDATETIME()");

    await req.query(
      `UPDATE ServiceRequests SET ${sets.join(", ")} WHERE id = @id`
    );
    return this.findById(id);
  },
};