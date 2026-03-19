import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";

type SummaryJobData = {
  content: string;
  userId: string;
};

new Worker<SummaryJobData>(
  "summary",
  async (job: Job<SummaryJobData>) => {
    const { content, userId } = job.data;

    console.log("🚀 Processing summary job for user:", userId);

    const result = await generateQuestionsWithFallback(
      `Summarize this:\n${content}`
    );

    const saved = await prisma.summary.create({
      data: {
        content,
        result: JSON.stringify(result),
        userId,
      },
    });

    console.log("✅ Summary job completed:", saved.id);

    return saved;
  },
  { connection: redisConnection as any }
);
