import express from "express";
import { getJobStatus } from "./jobs.controller.js";
import { requireAuth } from "@clerk/express";
import { attachUser } from "../../middleware/auth.js";

const router = express.Router();

/**
 * @server\src\modules\jobs\jobs.routes.ts GET /api/jobs/:jobId
 * @description Poll the status and result of a long-running background job.
 * @access private
 */
router.get("/:jobId", requireAuth(), attachUser, getJobStatus);

export default router;
