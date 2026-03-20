import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { getCache, setCache } from "../../utils/cache";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";
import { retrieveContext } from "../../modules/ai/rag/retrieval/retrieval.service";
import { questionPrompt } from "../../modules/ai/prompts/question.prompt";

type JobData = {
  topic: string;
  userId: string;
};

new Worker<JobData>(
  "question-generation",
  async (job: Job<JobData>) => {
    const { topic, userId } = job.data;

    console.log("🚀 Processing question job:", topic);

    // Cache key now includes userId to ensure user-specific context generation is cached correctly
    const cacheKey = `questions:${topic.toLowerCase()}:${userId}`;

    // 1️⃣ Progress: Started
    await job.updateProgress(10);

    // 2️⃣ Check cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("⚡ Cache hit");
      await job.updateProgress(100);
      return cached;
    }

    await job.updateProgress(30);

    // 3️⃣ Retrieval Step: Try getting context from user's notes
    // Hybrid logic: Attempt RAG, but proceed even if context is empty
    const context = await retrieveContext({ 
      userId, 
      query: topic 
    });
    const contextText = context?.length > 0 ? context.join("\n\n") : undefined;

    // 4️⃣ Decision Logic: Hybrid Prompt construction
    // Prompt strategy: Ground in context if it exists, fallback to general knowledge if not
    const prompt = questionPrompt(topic, contextText);

    // 5️⃣ Generate via LLM router
    const result = await generateQuestionsWithFallback(prompt);
    
    // 6️⃣ Processing & Validation
    // Safety check: extract JSON array from potentially conversational AI response
    let finalQuestions = result;
    try {
      if (typeof result === "string") {
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : result;
        finalQuestions = JSON.parse(jsonString);
      }
    } catch (e) {
      console.warn("JSON parse failed for questions, saving as raw result", e);
    }

    await job.updateProgress(70);

    // 7️⃣ Save to database
    const saved = await prisma.question.create({
      data: {
        topic,
        questions: finalQuestions as any,
        userId,
      },
    });

    // 8️⃣ Cache result
    await setCache(cacheKey, saved, 60 * 60 * 24);

    await job.updateProgress(100);
    console.log("✅ Question generation completed:", topic);

    return saved;
  },
  {
    connection: redisConnection as any,
    concurrency: 5,
  }
);