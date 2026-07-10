import { z } from "zod";

export const verificationSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
});

export const blockSchema = z.object({
  is_blocked: z.boolean(),
});

export const flagReviewSchema = z.object({
  is_flagged: z.boolean(),
});