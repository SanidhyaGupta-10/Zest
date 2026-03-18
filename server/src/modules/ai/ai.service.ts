import { prisma } from "../../config/db";
import { generateQuestionsWithFallback } from "../../providers/llm.router";

export const generateQuestionsService = async (topic: string) => {
  // 🔥 Calling LLM Router
  // That helps me any LLM API is down then it will automatically switch to another LLM API
  const questions = await generateQuestionsWithFallback(topic);

  // Save to DB
  const saved = await prisma.question.create({
    data: {
      topic,
      questions,
    },
  });

  return saved;
};