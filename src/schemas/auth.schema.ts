import { z } from "zod";

/**
 * Auth schemas.
 *
 * Notes:
 * - We keep password constraints simple for learning. You can tighten them later
 *   (min length, complexity, etc).
 */
export const registerSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address format"),
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address format"),
    password: z.string().min(1, "Password is required"),
  }),
});

