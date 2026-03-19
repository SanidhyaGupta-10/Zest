import { Request, Response } from "express";
import { questionQueue } from "../../queues/question.queue";

export const generateQuestions = async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    // Checking if topic is provided
    if (!topic) {
      return res.status(400).json({
        message: "Topic is required"
      });
    }

    // Adding job to queue
    const job = await questionQueue.add("generate", { topic });

    return res.json({
      success: true,
      data: job,
      jobId: job.id,
      message: "Job queued successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};