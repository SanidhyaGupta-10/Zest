"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDB = connectDB;
const client_1 = require("@prisma/client");
require("dotenv/config");
const globalForPrisma = globalThis;
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
}
// Append params safely
const enhancedUrl = dbUrl.includes("?")
    ? `${dbUrl}&connect_timeout=30&sslmode=require`
    : `${dbUrl}?connect_timeout=30&sslmode=require`;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: ["query", "info", "warn", "error"],
        datasources: {
            db: { url: enhancedUrl },
        },
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
async function connectDB() {
    try {
        await exports.prisma.$connect();
        console.log("DB connected ✅");
    }
    catch (err) {
        console.error("❌ Prisma connection error:", err);
        process.exit(1);
    }
}
