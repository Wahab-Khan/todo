import { z } from "zod";

/**
 * Request schemas.
 *
 * Why we validate:
 * - Prevents invalid data from reaching Prisma/DB
 * - Gives clients clear, consistent error messages (handled by errorHandler)
 */
export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required and must not be empty"),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int("Todo ID must be an integer"),
  }),
  body: z.object({
    completed: z.boolean(),
  }),
});

export const deleteTodoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int("Todo ID must be an integer"),
  }),
});
