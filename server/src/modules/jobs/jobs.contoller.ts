import { Response } from "express";
import { questionQueue } from "../../queues/question.queue";
import { AuthenticatedRequest } from "../Request.type";

export const getJobStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jobId, } = req.params;
    const userId = req.auth?.userId;

    // Checking jobId is provided or not
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }
    // Checking user is authenticated or not
    if(!userId){
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Checking job is present or not
    const job = await questionQueue.getJob(jobId as string);
     // 🔥 Check ownership
    if (job?.data.userId !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden" });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Getting job state
    const state = await job.getState(); // waiting | active | completed | failed

    // Returning job status
    return res.json({
      success: true,
      jobId,
      state,
      result: job.returnvalue ?? null,   // filled when completed
      failedReason: job.failedReason ?? null,
      progress: job.progress ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching job status"
    });
  }
};