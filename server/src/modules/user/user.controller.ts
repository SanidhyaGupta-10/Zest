import { clerkClient } from "@clerk/express";
import { prisma } from "../../config/db";
import { Request, Response } from "express";

export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get userId from auth middleware
    const userId = req.user?.userId;

    // 2. If Clerk middleware didn't catch it, check the header manually for debugging
    if (!userId) {
      console.error("❌ Auth Error: No userId found in request.");
      console.log("Raw Auth Header present:", !!req.headers.authorization);
      
      res.status(401).json({ 
        error: "Unauthorized",
        message: "No active session found. Ensure your token is valid and system clock is synced."
      });
      return;
    }

    // 3. Fetch fresh data from Clerk (Source of Truth)
    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      res.status(404).json({ error: "User not found in Clerk" });
      return;
    }
    console.log("Clerk user data:", clerkUser);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
    const imageUrl = clerkUser.imageUrl;

    // 4. Database Upsert (Neon/Prisma)
    const user = await prisma.user.upsert({
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

    res.status(200).json({ 
      success: true,
      user 
    });

  } catch (error) {
    console.error("❌ Error syncing user:", error);
    
    // Check for specific Prisma/Clerk errors
    const status = (error instanceof Error && "status" in error) 
      ? (error as { status: number }).status 
      : 500;
    res.status(status).json({ 
      error: "Failed to sync user",
      details: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};