import express from "express";
import { getJobStatus } from "./jobs.controller";
import { requireAuth } from "@clerk/express";
import { attachUser } from "../../middleware/auth";

const router = express.Router();

/**
 * Job status routes.
 *
 * Base path: /api/jobs
 */
router.get("/:jobId", requireAuth(), attachUser, getJobStatus);

export default router;
