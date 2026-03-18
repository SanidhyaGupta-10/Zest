import { Request, Response } from "express";
import { generateQuestionsService } from "./ai.service";

export const generateQuestions = async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    // Checking if topic is provided
    if (!topic) {
      return res.status(400).json({
         message:"Topic is required" 
      });
    }

    // Calling the service
    const result = await generateQuestionsService(topic);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        success: false,
        message: "Something went wrong" 
    });
  }
};