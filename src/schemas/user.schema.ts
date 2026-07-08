import { z } from "zod";

/**
 * User creation schema.
 *
 * TODO(users): Decide whether `name` should be required and/or have a max length.
 */
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    email: z.string().trim().email("Invalid email address format"),
  }),
});
