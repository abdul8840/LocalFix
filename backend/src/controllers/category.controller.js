import { CategoryModel } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.findAll();
  return ApiResponse.success(res, { categories });
});