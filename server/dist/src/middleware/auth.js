import { getAuth } from "@clerk/express";
/**
 * Auth Middleware
 * Extracts userId from Clerk's auth state and attaches it to `req.user`.
 * Must be used AFTER `clerkMiddleware()` or `requireAuth()` in the middleware chain.
 */
export const attachUser = (req, res, next) => {
    try {
        const auth = getAuth(req);
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
