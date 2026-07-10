import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { WorkerProfileModel } from "../models/workerProfile.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/requests (customer only)
export const createRequest = asyncHandler(async (req, res) => {
  const worker = await UserModel.findById(req.body.worker_id);
  if (!worker || worker.role !== "worker") {
    throw new ApiError(404, "Worker not found");
  }
  if (worker.is_blocked) throw new ApiError(400, "This worker is unavailable");

  const workerProfile = await WorkerProfileModel.findByUserId(worker.id);
  if (!workerProfile || workerProfile.verification_status !== "approved") {
    throw new ApiError(400, "Worker is not yet verified");
  }

  const request = await ServiceRequestModel.create({
    customer_id: req.user.id,
    worker_id: req.body.worker_id,
    category_id: req.body.category_id,
    description: req.body.description,
    address: req.body.address,
    pincode: req.body.pincode,
    scheduled_date: req.body.scheduled_date
      ? new Date(req.body.scheduled_date)
      : null,
  });

  return ApiResponse.success(res, { request }, "Request created", 201);
});

// GET /api/requests/mine  (customer's requests)
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequestModel.findByCustomer(req.user.id);
  return ApiResponse.success(res, { requests });
});

// GET /api/requests/assigned  (worker's incoming/active jobs)
export const getAssignedRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequestModel.findByWorker(req.user.id);
  return ApiResponse.success(res, { requests });
});

// PATCH /api/requests/:id/status
// Workers: accepted, in_progress, completed, rejected
// Customers: cancelled
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await ServiceRequestModel.findById(Number(req.params.id));
  if (!request) throw new ApiError(404, "Request not found");

  const { status, price, payment_status } = req.body;
  const isWorker = req.user.id === request.worker_id;
  const isCustomer = req.user.id === request.customer_id;

  if (!isWorker && !isCustomer) throw new ApiError(403, "Not allowed");

  const workerStatuses = ["accepted", "in_progress", "completed", "rejected"];
  const customerStatuses = ["cancelled"];

  if (isWorker && !workerStatuses.includes(status))
    throw new ApiError(400, "Invalid status transition for worker");
  if (isCustomer && !customerStatuses.includes(status))
    throw new ApiError(400, "Customers can only cancel requests");

  // Basic transition guard
  const terminal = ["completed", "cancelled", "rejected"];
  if (terminal.includes(request.status))
    throw new ApiError(400, "This request is already closed");

  const updated = await ServiceRequestModel.updateStatus(request.id, status, {
    price,
    payment_status,
  });

  // Refresh worker stats when a job completes
  if (status === "completed") {
    await WorkerProfileModel.recalcStats(request.worker_id);
  }

  return ApiResponse.success(res, { request: updated }, "Status updated");
});