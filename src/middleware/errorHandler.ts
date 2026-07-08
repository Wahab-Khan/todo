import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

/**
 * Centralized error handling.
 *
 * Why:
 * - Route handlers can stay focused on "happy path"
 * - We map known error types to clear HTTP statuses and messages
 *
 * TODO(logging): Consider structured logging and avoiding sensitive data in logs.
 * TODO(prisma): Optionally map more Prisma error codes if you add more constraints/relations.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    // Map paths to be cleaner (e.g., body.email -> email)
    const formattedErrors = err.issues.map((e) => {
      // Remove top-level request properties (body, params, query) from path if they exist
      const cleanPath = e.path[0] === "body" || e.path[0] === "params" || e.path[0] === "query"
        ? e.path.slice(1)
        : e.path;
      return {
        field: cleanPath.join("."),
        message: e.message,
      };
    });

    res.status(400).json({
      error: "Validation failed",
      details: formattedErrors,
    });
    return;
  }

  // 2. Custom App Operational Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  // 3. Prisma DB Errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as any;
    // P2002: Unique constraint failed
    if (prismaErr.code === "P2002") {
      const targetFields = prismaErr.meta?.target?.join(", ") || "field";
      res.status(409).json({
        error: `A record with this ${targetFields} already exists.`,
      });
      return;
    }
    // P2025: Record not found
    if (prismaErr.code === "P2025") {
      res.status(404).json({
        error: prismaErr.meta?.cause || "Record not found.",
      });
      return;
    }
  }

  // 4. Default Internal Server Error
  console.error("Unhandled Error Logged:", err);
  res.status(500).json({
    error: "Internal server error",
  });
};
