import { Router } from "express";
import prisma from "../lib/prisma";
import { validate } from "../middleware/validate";
import { createTodoSchema, updateTodoSchema, deleteTodoSchema } from "../schemas/todo.schema";
import { NotFoundError } from "../utils/errors";
import { requireAuth } from "../middleware/auth";

/**
 * Todos API.
 *
 * Notes for learning:
 * - We validate inputs (body/params) with Zod before hitting the DB.
 * - We forward errors to the global error handler via `next(error)` so responses are consistent.
 *
 * TODO(auth): In a real app, "ownerId" should usually come from the authenticated user,
 * not from the request body (otherwise any client can create todos for any user).
 */
const router = Router();

// All todo endpoints require authentication.
router.use(requireAuth);

router.get("/", async (req, res, next) => {
    try {
        // A user should only see their own todos.
        const todos = await prisma.todo.findMany({
            where: { ownerId: req.user!.id },
        });
        // Empty list is valid: return 200 with [] (not 404).
        // 404 is for "this specific resource doesn't exist", e.g. GET /api/todos/999.
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
});

router.post("/", validate(createTodoSchema), async (req, res, next) => {
    const { title } = req.body;
    const ownerId = req.user!.id;

    try {
        // We explicitly verify the owner exists to return a clean 404.
        // Without this, Prisma would throw a generic foreign-key error (harder to learn from).
        const userExists = await prisma.user.findUnique({
            where: { id: ownerId },
        });

        if (!userExists) {
            throw new NotFoundError("Owner not found in database");
        }

        const newTodo = await prisma.todo.create({
            data: { title, ownerId, completed: false },
        });

        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});

router.put("/:id", validate(updateTodoSchema), async (req, res, next) => {
    // Runtime conversion (not just a TypeScript cast). Zod also coerces, but this keeps things safe
    // even if the middleware changes or if this handler is copied elsewhere.
    const id = Number(req.params.id);
    const { completed } = req.body;

    try {
        // Authorization: only update your own todo.
        const result = await prisma.todo.updateMany({
            where: { id, ownerId: req.user!.id },
            data: { completed },
        });

        if (result.count === 0) {
            throw new NotFoundError("Todo not found");
        }

        res.status(200).json({ message: "Updated" });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", validate(deleteTodoSchema), async (req, res, next) => {
    // Same reasoning as above: convert to number at runtime.
    const id = Number(req.params.id);

    try {
        // Authorization: only delete your own todo.
        const result = await prisma.todo.deleteMany({
            where: { id, ownerId: req.user!.id },
        });

        if (result.count === 0) {
            throw new NotFoundError("Todo not found");
        }

        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        next(error);
    }
});

export default router;