import express from "express";
import { createReview, getWorkerReviews } from "../controllers/review.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createReviewSchema } from "../validators/review.validator.js";

const router = express.Router();

router.post("/", protect, authorize("customer"),
  validate(createReviewSchema), createReview);
router.get("/worker/:userId", getWorkerReviews);

export default router;