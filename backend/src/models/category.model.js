import { getPool } from "../config/db.js";

export const CategoryModel = {
  async findAll() {
    const pool = getPool();
    const result = await pool
      .request()
      .query(
        `SELECT id, name, description, icon, is_active
         FROM ServiceCategories
         WHERE is_active = 1
         ORDER BY name`
      );
    return result.recordset;
  },
};