// Redis-backed rate limiter: Enforces sliding request limits per authenticated user to prevent AI API abuse.
import { Request, Response, NextFunction } from "express";
import { redisConnection } from "../queues/connection";

const WINDOW = 60; // Window duration in seconds
const MAX_REQUESTS = 10; // Max requests allowed per user within the window

export const rateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
      return;
    }

    const key = `rate:${userId}`;
    const current = await redisConnection.get(key);
    const remaining = MAX_REQUESTS - (Number(current) || 0);

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", Math.max(remaining - 1, 0));

    // Reject request if rate limit exceeded
    if (current && Number(current) >= MAX_REQUESTS) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    // Set initial window count or increment existing request counter
    if (!current) {
      await redisConnection.set(key, 1, "EX", WINDOW);
    } else {
      await redisConnection.incr(key);
    }

    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    next(); // Fallback: allow request if Redis temporarily fails
  }
};
