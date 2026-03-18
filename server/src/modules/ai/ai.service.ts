import { prisma } from "../../config/db";
import { generateQuestionsFromGroq } from "../../providers/groq.provider";

export const generateQuestionsService = async (topic: string) => {
  // 🔥 Call Groq
  const questions = await generateQuestionsFromGroq(topic);

  // Save to DB
  const saved = await prisma.question.create({
    data: {
      topic,
      questions,
    },
  });

  return saved;
};