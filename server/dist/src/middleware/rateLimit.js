import { redisConnection } from "../queues/connection.js";
const WINDOW = 60; // seconds
const MAX_REQUESTS = 10; // per user per window
export const rateLimit = async (req, res, next) => {
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
        // get current count
        const current = await redisConnection.get(key);
        const remaining = MAX_REQUESTS - (Number(current) || 0);
        res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
        res.setHeader("X-RateLimit-Remaining", Math.max(remaining - 1, 0));
        if (current && Number(current) >= MAX_REQUESTS) {
            res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
            });
            return;
        }
        if (!current) {
            // first request → set with expiry
            await redisConnection.set(key, 1, "EX", WINDOW);
        }
        else {
            // increment
            await redisConnection.incr(key);
        }
        next();
    }
    catch (err) {
        console.error("Rate limit error:", err);
        next(); // don't block if redis fails
    }
};
