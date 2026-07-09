import { z } from "zod";

export const registerCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerWorkerSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(6),
  category_id: z.number().int().positive(),
  experience_years: z.number().int().min(0).max(60),
  bio: z.string().max(1000).optional(),
  pincode: z.string().min(4).max(10),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  id_proof_url: z.string().url().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});