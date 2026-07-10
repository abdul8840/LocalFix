import express from "express";
import {
  createRequest, getMyRequests, getAssignedRequests, updateRequestStatus,
} from "../controllers/serviceRequest.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createRequestSchema, updateStatusSchema,
} from "../validators/serviceRequest.validator.js";

const router = express.Router();

router.post("/", protect, authorize("customer"),
  validate(createRequestSchema), createRequest);
router.get("/mine", protect, authorize("customer"), getMyRequests);
router.get("/assigned", protect, authorize("worker"), getAssignedRequests);
router.patch("/:id/status", protect, authorize("customer", "worker"),
  validate(updateStatusSchema), updateRequestStatus);

export default router;