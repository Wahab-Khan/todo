/**
 * Static OpenAPI spec for learning.
 *
 * Why static (instead of auto-generated):
 * - Easy to read and understand as "API contract"
 * - No magic: what you see here is what Swagger UI shows
 *
 * Notes:
 * - `servers.url` should match where the API is running.
 *   For local dev: http://localhost:8080
 *   For Render:    https://<your-service>.onrender.com
 */
export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Todo Backend API",
    version: "1.0.0",
    description: "Learning project: Express + Prisma + Zod",
  },
  servers: [{ url: "http://localhost:8080" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Todos" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "OK" },
                  },
                  required: ["status"],
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user and get JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created user + token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and get JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "User + token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },
    "/api/todos": {
      get: {
        tags: ["Todos"],
        summary: "List todos",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of todos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Todo" },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalServerError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Todos"],
        summary: "Create todo",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTodoInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created todo",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalServerError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/todos/{id}": {
      put: {
        tags: ["Todos"],
        summary: "Update todo completion",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/TodoIdParam" },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTodoInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string", example: "Updated" } },
                  required: ["message"],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalServerError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      delete: {
        tags: ["Todos"],
        summary: "Delete todo",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/TodoIdParam" },
        ],
        responses: {
          "200": {
            description: "Deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string", example: "Deleted" } },
                  required: ["message"],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalServerError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    parameters: {
      TodoIdParam: {
        name: "id",
        in: "path",
        required: true,
        description: "Todo id",
        schema: { type: "integer", example: 1 },
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", example: "test@example.com" },
          name: { type: "string", nullable: true, example: "Awais" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "email", "createdAt"],
      },
      Todo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Buy milk" },
          completed: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          ownerId: { type: "integer", example: 1 },
        },
        required: ["id", "title", "completed", "createdAt", "ownerId"],
      },
      CreateUserInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Awais" },
          email: { type: "string", example: "test@example.com" },
        },
        required: ["email"],
      },
      CreateTodoInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "Buy milk" },
        },
        required: ["title"],
      },
      RegisterInput: {
        type: "object",
        properties: {
          email: { type: "string", example: "test@example.com" },
          name: { type: "string", example: "Awais" },
          password: { type: "string", example: "secret123" },
        },
        required: ["email", "password"],
      },
      LoginInput: {
        type: "object",
        properties: {
          email: { type: "string", example: "test@example.com" },
          password: { type: "string", example: "secret123" },
        },
        required: ["email", "password"],
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string" },
        },
        required: ["user", "token"],
      },
      UpdateTodoInput: {
        type: "object",
        properties: {
          completed: { type: "boolean", example: true },
        },
        required: ["completed"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Validation failed" },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Invalid email address format" },
              },
              required: ["field", "message"],
            },
          },
        },
        required: ["error", "details"],
      },
    },
    responses: {
      InternalServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Internal server error" },
          },
        },
      },
      ValidationError: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Resource not found" },
          },
        },
      },
      Conflict: {
        description: "Conflict (e.g. unique constraint)",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Unauthorized: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Invalid or expired token" },
          },
        },
      },
    },
  },
} as const;
