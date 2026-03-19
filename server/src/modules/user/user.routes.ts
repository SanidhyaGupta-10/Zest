import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser } from "./user.controller";

const router = Router();

// /api/users/sync - POST => sync the  clerk user to DB ( PROTECTED )

router.post('/sync', requireAuth(), syncUser)


export default router;