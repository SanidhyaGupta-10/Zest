import { Request, Response } from "express";
import { questionQueue } from "../../queues/question.queue";

export const getJobStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    // Checking jobId is provided or not
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    // Checking job is present or not
    const job = await questionQueue.getJob(jobId as string);

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