import { Router } from "express";
import prisma from "../lib/prisma";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../schemas/user.schema";

/**
 * Users API.
 *
 * TODO(auth): If this evolves into a real product, consider:
 * - password-based sign-up / OAuth
 * - email verification
 * - rate limiting to protect sign-up endpoints
 */
const router = Router();

// Create user 
router.post("/", validate(createUserSchema), async (req, res, next) => {
    const { name, email } = req.body;
    try {
        // Prisma will enforce `email` uniqueness (see schema). If the email already exists,
        // Prisma throws P2002 which our global error handler maps to HTTP 409.
        const user = await prisma.user.create({
            data: { email, name },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

// Get all users 
router.get("/", async (_req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, createdAt: true },
        });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

export default router;