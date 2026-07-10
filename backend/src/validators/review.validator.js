import { z } from "zod";

export const createReviewSchema = z.object({
  request_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});