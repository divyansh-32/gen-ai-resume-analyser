// src/schema/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export const signUpSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    name: z.string().min(3, "Minimum 3 characters").max(30, "Maximum 30 characters"),
});