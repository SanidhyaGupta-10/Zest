import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser } from "./user.controller";
import { attachUser } from "../../middleware/auth";

const router = Router();

/**
 * User routes.
 *
 * Base path: /api/user
 */
router.post('/sync', requireAuth(), attachUser, syncUser);

export default router;
