import { Response } from "express";
import { getAuth } from "@clerk/express";
import { aiQueue } from "../../queues/ai.queue";
import { AuthenticatedRequest } from "../Request.type";

const queues = [aiQueue];

export const getJobStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = getAuth(req).userId;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Try to find the job in any queue
    let job;
    for (const queue of queues) {
      job = await queue.getJob(jobId as string);
      if (job) break;
    }

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.data.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Get job state: waiting | active | completed | failed
    const state = await job.getState();

    // Map state to status for frontend compatibility
    let status: string;
    if (state === "completed") {
      status = "completed";
    } else if (state === "failed") {
      status = "failed";
    } else {
      status = "queued"; // waiting | active
    }

    return res.json({
      status,
      result: job.returnvalue ?? null,
      failedReason: job.failedReason ?? null,
      progress: job.progress ?? 0,
    });
  } catch (err) {
    console.error("Error fetching job status:", err);
    return res.status(500).json({ message: "Error fetching job status" });
  }
};
