import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser } from "./user.controller";
import { attachUser } from "../../middleware/auth";

const router = Router();

/**
 * @server\src\modules\user\user.routes.ts POST /api/auth/sync
 * @description Sync Clerk user data with the local database.
 * @access private
 */
router.post('/sync', requireAuth(), attachUser, syncUser);

export default router;