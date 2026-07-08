import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * Why:
 * - We create one PrismaClient for the whole process.
 * - Creating a new PrismaClient per request can exhaust DB connections.
 *
 * TODO(prisma): Add graceful shutdown (on SIGTERM) to `prisma.$disconnect()`
 * when running in production environments.
 */
const prisma = new PrismaClient();

export default prisma;