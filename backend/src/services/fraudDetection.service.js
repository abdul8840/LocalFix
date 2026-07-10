import { getPool } from "../config/db.js";
import { FraudModel } from "../models/fraud.model.js";

const RULES = [
  {
    reason: "Low average rating (<2.5) with 3+ reviews",
    severity: "high",
    sql: `
      SELECT wp.user_id AS worker_id
      FROM WorkerProfiles wp
      WHERE wp.total_reviews >= 3 AND wp.rating_avg < 2.5
    `,
  },
  {
    reason: "High cancellation/rejection rate (>50%)",
    severity: "medium",
    sql: `
      SELECT worker_id FROM (
        SELECT worker_id,
               COUNT(*) AS total,
               SUM(CASE WHEN status IN ('cancelled','rejected') THEN 1 ELSE 0 END) AS bad
        FROM ServiceRequests
        GROUP BY worker_id
      ) x
      WHERE x.total >= 4 AND (x.bad * 1.0 / x.total) > 0.5
    `,
  },
  {
    reason: "Multiple 1-star reviews in last 30 days",
    severity: "medium",
    sql: `
      SELECT worker_id
      FROM Reviews
      WHERE rating = 1 AND created_at >= DATEADD(DAY, -30, SYSUTCDATETIME())
      GROUP BY worker_id
      HAVING COUNT(*) >= 3
    `,
  },
  {
    reason: "Profile approved but no jobs in 60+ days",
    severity: "low",
    sql: `
      SELECT wp.user_id AS worker_id
      FROM WorkerProfiles wp
      WHERE wp.verification_status = 'approved'
        AND wp.created_at <= DATEADD(DAY, -60, SYSUTCDATETIME())
        AND wp.jobs_completed = 0
    `,
  },
];

export const runFraudScan = async () => {
  const pool = getPool();
  const created = [];

  for (const rule of RULES) {
    const result = await pool.request().query(rule.sql);
    for (const row of result.recordset) {
      const already = await FraudModel.existsForWorker(row.worker_id, rule.reason);
      if (already) continue;
      const alert = await FraudModel.create({
        worker_id: row.worker_id,
        reason: rule.reason,
        severity: rule.severity,
      });
      created.push(alert);
    }
  }

  return { scanned_rules: RULES.length, new_alerts: created.length, alerts: created };
};