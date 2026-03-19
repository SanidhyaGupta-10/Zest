import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";

type NotesJobData = {
  topic: string;
  userId: string;
};

new Worker<NotesJobData>(
  "notes",
  async (job: Job<NotesJobData>) => {
    const { topic, userId } = job.data;

    console.log("🚀 Processing notes job for topic:", topic);

    const result = await generateQuestionsWithFallback(
      `Generate detailed study notes for this topic:\n${topic}`
    );

    const saved = await prisma.note.create({
      data: {
        topic,
        notes: JSON.stringify(result),
        userId,
      },
    });

    console.log("✅ Notes job completed:", saved.id);

    return saved;
  },
  { connection: redisConnection as any }
);
