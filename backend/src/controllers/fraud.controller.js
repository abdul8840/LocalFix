import { FraudModel } from "../models/fraud.model.js";
import { runFraudScan } from "../services/fraudDetection.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAlerts = asyncHandler(async (req, res) => {
  const resolved =
    req.query.resolved === "true" ? true :
    req.query.resolved === "false" ? false : undefined;
  const alerts = await FraudModel.list({ resolved });
  return ApiResponse.success(res, { alerts });
});

export const scan = asyncHandler(async (req, res) => {
  const summary = await runFraudScan();
  return ApiResponse.success(res, summary, "Fraud scan completed");
});

export const resolveAlert = asyncHandler(async (req, res) => {
  await FraudModel.resolve(Number(req.params.id));
  return ApiResponse.success(res, {}, "Alert resolved");
});