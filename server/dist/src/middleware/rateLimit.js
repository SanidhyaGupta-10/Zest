"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
const express_1 = require("@clerk/express");
const connection_1 = require("../queues/connection");
const WINDOW = 60; // seconds
const MAX_REQUESTS = 10; // per user per window
const rateLimit = async (req, res, next) => {
    try {
        const userId = (0, express_1.getAuth)(req).userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const key = `rate:${userId}`;
        // get current count
        const current = await connection_1.redisConnection.get(key);
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
            await connection_1.redisConnection.set(key, 1, "EX", WINDOW);
        }
        else {
            // increment
            await connection_1.redisConnection.incr(key);
        }
        next();
    }
    catch (err) {
        console.error("Rate limit error:", err);
        next(); // don't block if redis fails
    }
};
exports.rateLimit = rateLimit;
