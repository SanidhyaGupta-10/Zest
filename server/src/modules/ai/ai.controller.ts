import { Request, Response } from "express";
import { questionQueue, questionQueueEvents } from "../../queues/question.queue";

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

    // Wait for worker to finish and return the result
    const result = await job.waitUntilFinished(questionQueueEvents);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};