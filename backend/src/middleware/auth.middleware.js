import { verifyToken } from "../utils/jwt.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  if (user.is_blocked) {
    throw new ApiError(403, "Your account has been blocked. Contact support.");
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Not authenticated"));
  }
  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(403, `Access denied. Required role: ${roles.join(" or ")}`)
    );
  }
  next();
};