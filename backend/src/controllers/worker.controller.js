import { WorkerProfileModel } from "../models/workerProfile.model.js";
import { ReviewModel } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { haversineKm } from "../utils/distance.js";
import { rankWorkers } from "../utils/recommendation.js";

// GET /api/workers/discover?category_id=&pincode=&lat=&lng=&radius=
export const discoverWorkers = asyncHandler(async (req, res) => {
  const { category_id, pincode, lat, lng, radius } = req.query;

  let workers = await WorkerProfileModel.discover({
    category_id: category_id ? Number(category_id) : null,
    pincode: pincode || null,
  });

  // Attach distance if lat/lng provided
  const userLat = lat ? Number(lat) : null;
  const userLng = lng ? Number(lng) : null;

  workers = workers.map((w) => {
    const distance_km =
      userLat !== null && userLng !== null && w.latitude && w.longitude
        ? haversineKm(userLat, userLng, Number(w.latitude), Number(w.longitude))
        : null;
    return { ...w, distance_km };
  });

  // Optional radius filter
  if (radius && userLat !== null && userLng !== null) {
    const maxKm = Number(radius);
    workers = workers.filter(
      (w) => w.distance_km !== null && w.distance_km <= maxKm
    );
  }

  // AI-lite ranking
  const ranked = rankWorkers(workers);

  return ApiResponse.success(res, {
    count: ranked.length,
    workers: ranked,
  });
});

// GET /api/workers/:id  (public detail view)
export const getWorkerById = asyncHandler(async (req, res) => {
  const worker = await WorkerProfileModel.findById(Number(req.params.id));
  if (!worker) throw new ApiError(404, "Worker not found");

  const reviews = await ReviewModel.findByWorker(worker.user_id);
  return ApiResponse.success(res, { worker, reviews });
});

// GET /api/workers/me  (logged-in worker's own profile)
export const getMyWorkerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfileModel.findByUserId(req.user.id);
  if (!profile) throw new ApiError(404, "Worker profile not found");
  const reviews = await ReviewModel.findByWorker(req.user.id);
  return ApiResponse.success(res, { profile, reviews });
});

// PATCH /api/workers/me
export const updateMyWorkerProfile = asyncHandler(async (req, res) => {
  const updated = await WorkerProfileModel.updateByUserId(req.user.id, req.body);
  return ApiResponse.success(res, { profile: updated }, "Profile updated");
});