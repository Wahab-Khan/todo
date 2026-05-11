import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes";
import userRoutes from "./routes/user.routes";

// dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});

export default app;