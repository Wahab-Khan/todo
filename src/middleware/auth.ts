import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export type JwtPayload = {
  sub: number; // user id
  email: string;
};

/**
 * Require a valid Bearer token.
 *
 * Learning notes:
 * - JWTs are *signed*, not encrypted. Do not put secrets in the payload.
 * - The server verifies the signature using JWT_SECRET.
 * - We attach a small `req.user` object for downstream handlers.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? req.header("Authorization");
  if (!header) return next(new AppError("Missing Authorization header", 401));

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Authorization must be: Bearer <token>", 401));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Misconfiguration in production: better to fail fast.
    return next(new AppError("JWT_SECRET is not configured", 500));
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "object" || decoded === null) {
      return next(new AppError("Invalid or expired token", 401));
    }

    const payload = decoded as unknown as JwtPayload;
    // Minimal user info needed for authorization decisions.
    (req as any).user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}

