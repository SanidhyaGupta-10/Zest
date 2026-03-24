import "express";

declare global {
  namespace Express {
    interface Request {
      /** Populated by the auth middleware after verifying the Clerk session */
      user?: {
        userId: string;
      };
    }
  }
}
