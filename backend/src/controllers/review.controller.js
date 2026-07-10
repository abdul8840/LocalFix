import { ReviewModel } from "../models/review.model.js";
import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { WorkerProfileModel } from "../models/workerProfile.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/reviews  (customer only, after completion)
export const createReview = asyncHandler(async (req, res) => {
  const { request_id, rating, comment } = req.body;
  const request = await ServiceRequestModel.findById(request_id);

  if (!request) throw new ApiError(404, "Request not found");
  if (request.customer_id !== req.user.id)
    throw new ApiError(403, "You can only review your own requests");
  if (request.status !== "completed")
    throw new ApiError(400, "You can only review completed jobs");

  const existing = await ReviewModel.findByRequestId(request_id);
  if (existing) throw new ApiError(409, "You already reviewed this job");

  const review = await ReviewModel.create({
    request_id,
    customer_id: req.user.id,
    worker_id: request.worker_id,
    rating,
    comment,
  });

  await WorkerProfileModel.recalcStats(request.worker_id);

  return ApiResponse.success(res, { review }, "Review submitted", 201);
});

// GET /api/reviews/worker/:userId  (public)
export const getWorkerReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewModel.findByWorker(Number(req.params.userId));
  return ApiResponse.success(res, { reviews });
});