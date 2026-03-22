"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUser = void 0;
const express_1 = require("@clerk/express");
const db_1 = require("../../config/db");
const syncUser = async (req, res) => {
    try {
        // 1. Get auth state from Clerk
        const { userId } = (0, express_1.getAuth)(req);
        // 2. If Clerk middleware didn't catch it, check the header manually for debugging
        if (!userId) {
            console.error("❌ Auth Error: No userId found in request.");
            console.log("Raw Auth Header present:", !!req.headers.authorization);
            return res.status(401).json({
                error: "Unauthorized",
                message: "No active session found. Ensure your token is valid and system clock is synced."
            });
        }
        // 3. Fetch fresh data from Clerk (Source of Truth)
        const clerkUser = await express_1.clerkClient.users.getUser(userId);
        if (!clerkUser) {
            return res.status(404).json({ error: "User not found in Clerk" });
        }
        console.log("Clerk user data:", clerkUser);
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
        console.log("✅ Sync Successful for:", email);
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error("❌ Error syncing user:", error);
        // Check for specific Prisma/Clerk errors
        const status = error.status || 500;
        res.status(status).json({
            error: "Failed to sync user",
            details: error.message
        });
    }
};
exports.syncUser = syncUser;
