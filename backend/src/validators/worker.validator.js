import { z } from "zod";

export const updateWorkerProfileSchema = z.object({
  experience_years: z.number().int().min(0).max(60).optional(),
  bio: z.string().max(1000).optional(),
  pincode: z.string().min(4).max(10).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  availability: z.boolean().optional(),
  profile_image_url: z.string().url().optional(),
});