import { Response } from "express";
import { questionQueue } from "../../queues/question.queue";
import { AuthenticatedRequest } from "../Request.type";
import { summaryQueue } from "../../queues/summary.queue";
import { notesQueue } from "../../queues/notes.queue";


export const generateQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic } = req.body;
    // Getting user ID from the request
    // but we can do also :-  const userId = (req as any).auth?.userId;
    // but below is the best way to get user ID from the request
    const userId = req.auth?.userId;

    // Checking if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Checking if topic is provided
    if (!topic) {
      return res.status(400).json({
        message: "Topic is required"
      });
    }

    // Adding job to queue
    const job = await questionQueue.add("generate", {
      topic,
      userId
    }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });

    return res.json({
      success: true,
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

export const summarizeController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const job = await summaryQueue.add("summarize", {
      content,
      userId,
    }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });

    return res.json({
      success: true,
      jobId: job.id,
      message: "Summary job queued successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const notesController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic } = req.body;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const job = await notesQueue.add("notes", {
      topic,
      userId,
    }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });

    return res.json({
      success: true,
      jobId: job.id,
      message: "Notes job queued successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};