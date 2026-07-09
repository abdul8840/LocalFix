import express from "express";
import { getPool, sql } from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query("SELECT GETDATE() AS server_time");
    return ApiResponse.success(res, {
      status: "healthy",
      db: "connected",
      server_time: result.recordset[0].server_time,
    });
  } catch (err) {
    next(err);
  }
});

export default router;