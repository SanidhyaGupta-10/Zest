"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUser = void 0;
const express_1 = require("@clerk/express");
const db_1 = require("../../config/db");
/**
 * Synchronize the authenticated Clerk user into the local database.
 */
const syncUser = async (req, res) => {
    try {
        // 1. Get userId from auth middleware
        const userId = req.user?.userId;
        // 2. If Clerk middleware didn't catch it, check the header manually for debugging
        if (!userId) {
            res.status(401).json({
                error: "Unauthorized",
                message: "No active session found. Ensure your token is valid and system clock is synced."
            });
            return;
        }
        // 3. Fetch fresh data from Clerk (Source of Truth)
        const clerkUser = await express_1.clerkClient.users.getUser(userId);
        if (!clerkUser) {
            res.status(404).json({ error: "User not found in Clerk" });
            return;
        }
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
        const imageUrl = clerkUser.imageUrl;
        // 4. Database Upsert (Neon/Prisma)
        const user = await db_1.prisma.user.upsert({
            where: { id: userId },
            update: {
                email,
                name,
                imageUrl,
            },
            create: {
                id: userId,
                email: email || "", // Ensure email isn't null if your schema requires it
                name: name || "New User",
                imageUrl,
            },
        });
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        // Check for specific Prisma/Clerk errors
        const status = (error instanceof Error && "status" in error)
            ? error.status
            : 500;
        res.status(status).json({
            error: "Failed to sync user",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.syncUser = syncUser;
