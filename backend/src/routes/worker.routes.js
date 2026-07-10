import express from "express";
import {
  discoverWorkers, getWorkerById,
  getMyWorkerProfile, updateMyWorkerProfile,
} from "../controllers/worker.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateWorkerProfileSchema } from "../validators/worker.validator.js";

const router = express.Router();

// Public
router.get("/discover", discoverWorkers);

// Worker self
router.get("/me", protect, authorize("worker"), getMyWorkerProfile);
router.patch("/me", protect, authorize("worker"),
  validate(updateWorkerProfileSchema), updateMyWorkerProfile);

// Public detail (place after /me and /discover)
router.get("/:id", getWorkerById);

export default router;