import { Request, Response, NextFunction } from "express";
import { redisConnection } from "../queues/connection";
import { AuthenticatedRequest } from "../modules/Request.type";

const WINDOW = 60; // seconds
const MAX_REQUESTS = 10; // per user per window

export const rateLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }

    const key = `rate:${userId}`;

    // get current count
    const current = await redisConnection.get(key);

    const remaining = MAX_REQUESTS - (Number(current) || 0);
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", Math.max(remaining - 1, 0));

    if (current && Number(current) >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    if (!current) {
      // first request → set with expiry
      await redisConnection.set(key, 1, "EX", WINDOW);
    } else {
      // increment
      await redisConnection.incr(key);
    }

    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    next(); // don't block if redis fails
  }
};
