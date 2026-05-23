import { Request, Response } from "express";
import { aiQueue } from "../../queues/ai.queue.js";


const queues = [aiQueue];

/**
 * @server\src\modules\jobs\jobs.controller.ts getJobStatus
 * @description Poll the status and result of a long-running background job from the AI queue.
 * @access private
 */
export const getJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.userId;

    if (!jobId) {
      res.status(400).json({ message: "Job ID is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Try to find the job in any queue
    let job;
    for (const queue of queues) {
      job = await queue.getJob(String(jobId));
      if (job) break;
    }

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    if (job.data.userId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
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

    res.json({
      status,
      result: job.returnvalue ?? null,
      failedReason: job.failedReason ?? null,
      progress: job.progress ?? 0,
    });
  } catch (err) {
    console.error("Error fetching job status:", err);
    res.status(500).json({ message: "Error fetching job status" });
  }
};
