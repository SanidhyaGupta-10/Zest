import express from "express";
import { getJobStatus } from "./jobs.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/:jobId", requireAuth(), getJobStatus);

export default router;
