"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachUser = void 0;
const express_1 = require("@clerk/express");
/**
 * Auth Middleware
 * Extracts userId from Clerk's auth state and attaches it to `req.user`.
 * Must be used AFTER `clerkMiddleware()` or `requireAuth()` in the middleware chain.
 */
const attachUser = (req, res, next) => {
    try {
        const auth = (0, express_1.getAuth)(req);
        const userId = auth.userId;
        if (userId) {
            req.user = { userId };
        }
        next();
    }
    catch (error) {
        console.error("[AuthMiddleware] Error extracting user:", error);
        next();
    }
};
exports.attachUser = attachUser;
