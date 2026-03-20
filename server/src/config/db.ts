import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

// Append params safely
const enhancedUrl = dbUrl.includes("?") 
  ? `${dbUrl}&connect_timeout=30&sslmode=require` 
  : `${dbUrl}?connect_timeout=30&sslmode=require`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
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
    process.exit(1);
  }
}
