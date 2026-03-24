import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

// FIX: Force limit connections to 1 and add pgbouncer for free-tier DBs
// This prevents the "Closed" error caused by too many open connections.
const params = "connect_timeout=30&sslmode=require&connection_limit=1&pgbouncer=true";
const enhancedUrl = dbUrl.includes("?") 
  ? `${dbUrl}&${params}` 
  : `${dbUrl}?${params}`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"], // Cleaner logs for production
    datasources: {
      db: { url: enhancedUrl },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("DB connected ✅");
  } catch (err) {
    console.error("❌ Prisma connection error:", err);
    // Don't exit(1) here; let Render retry the connection on next request
  }
}
