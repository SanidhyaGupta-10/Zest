import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";

import { notesPrompt } from "../../modules/ai/prompts/notes.prompt";

type NotesJobData = {
  topic: string;
  userId: string;
};

new Worker<NotesJobData>(
  "notes",
  async (job: Job<NotesJobData>) => {
    const { topic, userId } = job.data;

    console.log("🚀 Processing notes generation job for topic:", topic);

    // Prompt Strategy: Generate comprehensive notes from topic (no vector DB dependency)
    const prompt = notesPrompt(topic);

    const result = await generateQuestionsWithFallback(prompt);

    const saved = await prisma.note.create({
      data: {
        topic,
        notes: result as string, // Store the generated markdown notes
        userId,
      },
    });

    console.log("✅ Notes generation job completed:", saved.id);

    return saved;
  },
  { connection: redisConnection as any }
);
