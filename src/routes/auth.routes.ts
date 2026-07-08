import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { AppError } from "../utils/errors";

/**
 * Auth routes.
 *
 * Endpoints:
 * - POST /api/auth/register: create a user with password
 * - POST /api/auth/login: return a JWT token
 *
 * TODO(auth): Add refresh tokens / token rotation if you need long-lived sessions.
 */
const router = Router();

function signToken(user: { id: number; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET is not configured", 500);

  // `sub` (subject) is a standard JWT claim; we use it as the user id.
  return jwt.sign({ sub: user.id, email: user.email }, secret, {
    expiresIn: "7d",
  });
}

router.post("/register", validate(registerSchema), async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const token = signToken({ id: user.id, email: user.email });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, createdAt: true, passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      // Avoid leaking whether the email exists.
      throw new AppError("Invalid email or password", 401);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError("Invalid email or password", 401);

    const token = signToken({ id: user.id, email: user.email });
    const safeUser = { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
    res.status(200).json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
});

export default router;

