import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { WorkerProfileModel } from "../models/workerProfile.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  is_blocked: user.is_blocked,
  created_at: user.created_at,
});

// ---------------- REGISTER CUSTOMER ----------------
export const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existing = await UserModel.findByEmail(email);
  if (existing) throw new ApiError(409, "Email is already registered");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({
    name,
    email,
    phone,
    password_hash,
    role: "customer",
  });

  const token = signToken({ id: user.id, role: user.role });
  return ApiResponse.success(
    res,
    { user: sanitizeUser(user), token },
    "Customer registered successfully",
    201
  );
});

// ---------------- REGISTER WORKER ----------------
export const registerWorker = asyncHandler(async (req, res) => {
  const {
    name, email, phone, password,
    category_id, experience_years, bio,
    pincode, city, state, latitude, longitude, id_proof_url,
  } = req.body;

  const existing = await UserModel.findByEmail(email);
  if (existing) throw new ApiError(409, "Email is already registered");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({
    name, email, phone, password_hash, role: "worker",
  });

  await WorkerProfileModel.create({
    user_id: user.id,
    category_id,
    experience_years,
    bio,
    pincode,
    city,
    state,
    latitude,
    longitude,
    id_proof_url,
  });

  const token = signToken({ id: user.id, role: user.role });
  return ApiResponse.success(
    res,
    { user: sanitizeUser(user), token },
    "Worker registered. Pending admin verification.",
    201
  );
});

// ---------------- LOGIN ----------------
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) throw new ApiError(401, "Invalid email or password");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new ApiError(401, "Invalid email or password");

  if (user.is_blocked)
    throw new ApiError(403, "Your account has been blocked. Contact support.");

  const token = signToken({ id: user.id, role: user.role });
  return ApiResponse.success(
    res,
    { user: sanitizeUser(user), token },
    "Login successful"
  );
});

// ---------------- CURRENT USER ----------------
export const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, { user: sanitizeUser(req.user) });
});

// ---------------- LOGOUT (client-side clears token) ----------------
export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {}, "Logged out successfully");
});