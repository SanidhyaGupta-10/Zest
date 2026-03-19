import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// 1. Extend the global object to hold the prisma instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Initialize Prisma using the global instance if it exists
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasources: {
      db: {
        // Append timeout and SSL requirements to the URL
        url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + "connect_timeout=30&sslmode=require",
      },
    },
  });

// 3. In development, save the instance to global so it survives restarts
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function connectDB() {
  try {
    // This is optional but good for testing the initial handshake
    await prisma.$connect();
    console.log("DB connected ✅");
  } catch (err) {
    console.error("❌ Prisma connection error:", err);
    // Important: Don't let the app start if DB is down
    process.exit(1); 
  }
}