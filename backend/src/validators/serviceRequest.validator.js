import { z } from "zod";

export const createRequestSchema = z.object({
  worker_id: z.number().int().positive(),
  category_id: z.number().int().positive(),
  description: z.string().min(5).max(1000),
  address: z.string().min(3).max(500),
  pincode: z.string().min(4).max(10),
  scheduled_date: z.string().datetime().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["accepted", "in_progress", "completed", "cancelled", "rejected"]),
  price: z.number().nonnegative().optional(),
  payment_status: z.enum(["unpaid", "paid_offline"]).optional(),
});