// Prisma database connection manager with connection-pool configuration for Neon PostgreSQL.
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

// Append PgBouncer parameters and restrict pool size for serverless database stability
const params = "connect_timeout=30&sslmode=require&connection_limit=1&pgbouncer=true";
const enhancedUrl = dbUrl.includes("?") 
  ? `${dbUrl}&${params}` 
  : `${dbUrl}?${params}`;

// Singleton Prisma instance prevention in development mode
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: { url: enhancedUrl },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Explicit connection test called during server launch sequence
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("⚡ Database connected successfully.");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}
