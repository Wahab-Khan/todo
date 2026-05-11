"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todos = [];
router.get("/", (_, res) => {
    res.json(todos);
});
router.post("/", (req, res) => {
    const { title } = req.body;
    const newTodo = {
        id: Date.now(),
        title,
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { completed } = req.body;
    todos = todos.map((todo) => todo.id === id ? { ...todo, completed } : todo);
    res.json({ message: "Updated" });
});
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    todos = todos.filter((todo) => todo.id !== id);
    res.json({ message: "Deleted" });
});
exports.default = router;
