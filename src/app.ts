import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
// import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import { getOpenApiSpec } from "./openapi";

// dotenv.config();

const app = express();

/**
 * App wiring:
 * - middleware first (CORS, JSON parsing)
 * - routes next
 * - error handler last (so it catches errors from routes)
 *
 * TODO(cors): In production, restrict `cors()` origins to your frontend domain(s).
 */
app.use(cors());
app.use(express.json());

// Swagger UI (interactive API docs)
// Server URL is resolved per request so local vs EC2 "Try it out" targets the right host.
app.get("/openapi.json", (req, res) => {
  res.json(getOpenApiSpec(req));
});
app.use("/docs", swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
  swaggerUi.setup(getOpenApiSpec(req))(req, res, next);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// Health endpoint for uptime checks (Render, load balancers, etc).
app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});

// Global Error Handler
app.use(errorHandler);

export default app;