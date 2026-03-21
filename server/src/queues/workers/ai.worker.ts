import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection";
import { getCache, setCache } from "../../utils/cache";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { prisma } from "../../config/db";
import { retrieveContext } from "../../modules/ai/rag/retrieval/retrieval.service";
import { questionPrompt } from "../../modules/ai/prompts/question.prompt";
import { notesPrompt } from "../../modules/ai/prompts/notes.prompt";
import { summaryPrompt } from "../../modules/ai/prompts/summary.prompt";

export enum AiTaskType {
  QUESTIONS = "QUESTIONS",
  SUMMARY = "SUMMARY",
  NOTES = "NOTES",
}

type JobData = {
  type: AiTaskType;
  userId: string;
  topic?: string;
  content?: string;
};

new Worker<JobData>(
  "ai-tasks",
  async (job: Job<JobData>) => {
    const { type, userId, topic, content } = job.data;
    const identifier = topic || content?.slice(0, 30);

    console.log(`🚀 Processing ${type} job for ${identifier}`);

    // Cache strategy
    const cacheKey = `ai:${type.toLowerCase()}:${userId}:${identifier?.toLowerCase()}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("⚡ Cache hit");
      await job.updateProgress(100);
      return cached;
    }

    await job.updateProgress(20);

    let prompt = "";
    let result: any;
    let saved: any;

    try {
      switch (type) {
        case AiTaskType.QUESTIONS: {
          if (!topic) throw new Error("Topic required for questions");
          const context = await retrieveContext({ userId, query: topic });
          const contextText = context?.length > 0 ? context.join("\n\n") : undefined;
          prompt = questionPrompt(topic, contextText);
          result = await generateQuestionsWithFallback(prompt);
          
          // Parse JSON if needed
          let parsedQuestions = result;
          try {
            if (typeof result === "string") {
              const jsonMatch = result.match(/\[[\s\S]*\]/);
              parsedQuestions = JSON.parse(jsonMatch ? jsonMatch[0] : result);
            }
          } catch (e) { console.warn("Parse failed for questions", e); }

          saved = await prisma.question.create({
            data: { topic, questions: parsedQuestions as any, userId },
          });
          break;
        }

        case AiTaskType.SUMMARY: {
          if (!content) throw new Error("Content required for summary");
          prompt = summaryPrompt(content);
          result = await generateQuestionsWithFallback(prompt);
          saved = await prisma.summary.create({
            data: { content, result: result as string, userId },
          });
          break;
        }

        case AiTaskType.NOTES: {
          if (!topic) throw new Error("Topic required for notes");
          prompt = notesPrompt(topic);
          result = await generateQuestionsWithFallback(prompt);
          saved = await prisma.note.create({
            data: { topic, notes: result as string, userId },
          });
          break;
        }
      }

      await job.updateProgress(80);
      
      // Cache result
      await setCache(cacheKey, result, 60 * 60 * 24);
      await job.updateProgress(100);

      console.log(`✅ ${type} completed:`, result);
      return result;

    } catch (error: any) {
      console.error(`${type} Worker Error:`, error);
      throw error; // Let BullMQ handle retries
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5,
  }
);
