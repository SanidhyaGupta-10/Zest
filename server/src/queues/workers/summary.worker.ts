import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";

import { summaryPrompt } from "../../modules/ai/prompts/summary.prompt";

type SummaryJobData = {
  content: string;
  userId: string;
};

new Worker<SummaryJobData>(
  "summary",
  async (job: Job<SummaryJobData>) => {
    const { content, userId } = job.data;

    console.log("🚀 Processing summary job for user:", userId);

    // Prompt Strategy: Summarize directly from provided content (no vector DB dependency)
    const prompt = summaryPrompt(content);

    const result = await generateQuestionsWithFallback(prompt);

    // Save summary directly
    const saved = await prisma.summary.create({
      data: {
        content,
        result: result as string, // Store the generated summary
        userId,
      },
    });

    console.log("✅ Summary job completed:", saved.id);

    return saved;
  },
  { connection: redisConnection as any }
);
