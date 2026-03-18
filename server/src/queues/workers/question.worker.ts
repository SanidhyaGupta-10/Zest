import 'dotenv/config';
import { Worker } from "bullmq";
import { redisConnection } from "../connection";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";

new Worker(
  "question-generation",
  async (job) => {
    const { topic } = job.data;

    console.log("Processing job:", topic);

    const questions = await generateQuestionsWithFallback(topic);

    const saved = await prisma.question.create({
      data: {
        topic,
        questions,
      },
    });

    return saved;
  },
  {
    connection: redisConnection as any,
  }
);