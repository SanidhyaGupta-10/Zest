// Auth Middleware: Extracts authenticated Clerk userId and attaches it to req.user for downstream controllers.
import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export const attachUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (userId) {
      req.user = { userId };
    }

    next();
  } catch (error) {
    console.error("[AuthMiddleware] Error extracting user:", error);
    next();
  }
};
