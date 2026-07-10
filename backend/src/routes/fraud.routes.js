import express from "express";
import { listAlerts, scan, resolveAlert } from "../controllers/fraud.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/alerts", listAlerts);
router.post("/scan", scan);
router.patch("/alerts/:id/resolve", resolveAlert);

export default router;