import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_, res) => {
    const todos = await prisma.todo.findMany();
    res.json(todos).status(200);
});

router.post("/", async (req, res) => {
    const { title, ownerId } = req.body;

    const newTodo = await prisma.todo.create({
        data: { title, ownerId, completed: false },
    });

    res.status(201).json(newTodo);
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