import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_, res) => {
    const todos = await prisma.todo.findMany();
    res.json(todos).status(200);
});

router.post("/", async (req, res) => {
    const { title, ownerId } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ error: "Title is required and must be a non-empty string" });
        return;
    }

    if (ownerId === undefined || ownerId === null) {
        res.status(400).json({ error: "Owner ID is required" });
        return;
    }

    const parsedOwnerId = Number(ownerId);
    if (isNaN(parsedOwnerId)) {
        res.status(400).json({ error: "Owner ID must be a valid number" });
        return;
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { id: parsedOwnerId },
        });

        if (!userExists) {
            res.status(404).json({ error: "Owner not found in database" });
            return;
        }

        const newTodo = await prisma.todo.create({
            data: { title, ownerId: parsedOwnerId, completed: false },
        });

        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { completed } = req.body;

    const todo = await prisma.todo.update({
        where: { id },
        data: { completed },
    });

    res.json({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    await prisma.todo.delete({
        where: { id },
    });

    res.json({ message: "Deleted" });
});

export default router;