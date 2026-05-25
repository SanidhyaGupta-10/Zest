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
// FIX: Force limit connections to 1 and add pgbouncer for free-tier DBs
// This prevents the "Closed" error caused by too many open connections.
const params = "connect_timeout=30&sslmode=require&connection_limit=1&pgbouncer=true";
const enhancedUrl = dbUrl.includes("?")
    ? `${dbUrl}&${params}`
    : `${dbUrl}?${params}`;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: ["error", "warn"], // Cleaner logs for production
        datasources: {
            db: { url: enhancedUrl },
        },
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
async function connectDB() {
    try {
        await exports.prisma.$connect();
    }
    catch (err) {
        // Don't exit(1) here; let Render retry the connection on next request
    }
}
