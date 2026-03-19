import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { getCache, setCache } from "../../utils/cache";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";

type JobData = {
  topic: string;
};

new Worker<JobData>(
  "question-generation",
  async (job: Job<JobData>) => {
    const { topic } = job.data;

    console.log("🚀 Processing job:", topic);

    const cacheKey = `questions:${topic.toLowerCase()}`;

    // 1️⃣ Progress: started
    // 10% - job started
    await job.updateProgress(10);

    // 2️⃣ Check cache
    // 30% - cache hit
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("⚡ Cache hit");
      await job.updateProgress(100);
      return cached;
    }

    // 30% - cache miss
    await job.updateProgress(30);

    // 3️⃣ Generate via LLM router
    // 70% - LLM generation
    const questions = await generateQuestionsWithFallback(topic);

    await job.updateProgress(70);

    // 4️⃣ Save to DB
    const saved = await prisma.question.create({
      data: {
        topic,
        questions,
      },
    });

    // 5️⃣ Cache result
    await setCache(cacheKey, saved, 60 * 60 * 24);

    await job.updateProgress(100);

    console.log("✅ Job completed:", topic);

    return saved;
  },
  {
    connection: redisConnection as any, // but i have // ✅ no "as any"
    concurrency: 5,
  }
);