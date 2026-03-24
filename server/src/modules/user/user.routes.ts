import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser } from "./user.controller";
import { attachUser } from "../../middleware/auth";

const router = Router();

router.post('/sync', requireAuth(), attachUser, syncUser);

export default router;