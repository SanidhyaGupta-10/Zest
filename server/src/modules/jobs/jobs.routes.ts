import express from "express";
import { getJobStatus } from "./jobs.contoller";

const router = express.Router();

router.get("/:jobId", getJobStatus);

export default router;