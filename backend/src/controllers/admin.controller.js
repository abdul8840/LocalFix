import { AdminModel } from "../models/admin.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ---------- ANALYTICS ----------
export const getAnalytics = asyncHandler(async (req, res) => {
  const [kpis, timeseries, categories, topWorkers] = await Promise.all([
    AdminModel.getKpis(),
    AdminModel.getRequestsPerDay(14),
    AdminModel.getCategoryBreakdown(),
    AdminModel.getTopWorkers(5),
  ]);
  return ApiResponse.success(res, { kpis, timeseries, categories, topWorkers });
});

// ---------- WORKERS ----------
export const listWorkers = asyncHandler(async (req, res) => {
  const workers = await AdminModel.listWorkers({ status: req.query.status });
  return ApiResponse.success(res, { workers });
});

export const setWorkerVerification = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  await AdminModel.setWorkerVerification(id, status);
  return ApiResponse.success(res, {}, `Worker ${status}`);
});

// ---------- USERS ----------
export const listUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const users = await AdminModel.listUsers({ role, search });
  return ApiResponse.success(res, { users });
});

export const setUserBlocked = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await UserModel.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "admin") throw new ApiError(400, "Cannot block an admin");
  await UserModel.setBlocked(id, req.body.is_blocked);
  return ApiResponse.success(res, {}, req.body.is_blocked ? "User blocked" : "User unblocked");
});

// ---------- REVIEWS ----------
export const listReviews = asyncHandler(async (req, res) => {
  const flagged =
    req.query.flagged === "true" ? true :
    req.query.flagged === "false" ? false : undefined;
  const reviews = await AdminModel.listReviews({ flagged });
  return ApiResponse.success(res, { reviews });
});

export const flagReview = asyncHandler(async (req, res) => {
  await AdminModel.setReviewFlag(Number(req.params.id), req.body.is_flagged);
  return ApiResponse.success(res, {}, req.body.is_flagged ? "Review flagged" : "Flag removed");
});

export const deleteReview = asyncHandler(async (req, res) => {
  await AdminModel.deleteReview(Number(req.params.id));
  return ApiResponse.success(res, {}, "Review deleted");
});