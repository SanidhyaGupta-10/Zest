import { clerkClient, getAuth } from "@clerk/express";
import { prisma } from "../../config/db";
import { AuthenticatedRequest } from "../Request.type";
import type { Response } from "express"

export const syncUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ 
        error: "Unauthorized" 
      });
    }

    // 🔥 Fetch from Clerk (trusted)
    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`;
    const imageUrl = clerkUser.imageUrl;

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email,
        name,
        imageUrl
      },
      create: {
        id: userId,   // 👈 IMPORTANT
        email,
        name,
        imageUrl
      },
    });

    return res.status(200).json({ user });

  } catch (error) {
    console.log("Error syncing user", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
};