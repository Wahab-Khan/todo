import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();


//create user 
router.post("/", async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { email: email, name: name },
        });
        res.status(201).json(user);
        console.log(user);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "User creation failed" });
    }
});


//get all users 
router.get("/", async (_, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

export default router;