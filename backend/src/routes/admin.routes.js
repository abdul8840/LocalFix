import express from "express";
import {
  getAnalytics, listWorkers, setWorkerVerification,
  listUsers, setUserBlocked,
  listReviews, flagReview, deleteReview,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  verificationSchema, blockSchema, flagReviewSchema,
} from "../validators/admin.validator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/analytics", getAnalytics);

router.get("/workers", listWorkers);
router.patch("/workers/:id/verification", validate(verificationSchema), setWorkerVerification);

router.get("/users", listUsers);
router.patch("/users/:id/blocked", validate(blockSchema), setUserBlocked);

router.get("/reviews", listReviews);
router.patch("/reviews/:id/flag", validate(flagReviewSchema), flagReview);
router.delete("/reviews/:id", deleteReview);

export default router;