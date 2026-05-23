/**
 * @server\src\queues\workers\ai.worker.ts
 * @description 🤖 The AI Brain Worker. This file handles heavy, long-running tasks in the background.
 * It listens for jobs (like "Generate a Summary") and processes them so the user doesn't have to wait.
 */

import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisConnection } from "../connection.js";
import { getCache, setCache } from "../../utils/cache.js";
import { generateQuestionsWithFallback } from "../../providers/llm.router.js";
import { prisma } from "../../config/db.js";
import { retrieveContext } from "../../modules/ai/rag/retrieval/retrieval.service.js";
import { questionPrompt } from "../../modules/ai/prompts/question.prompt.js";
import { notesPrompt } from "../../modules/ai/prompts/notes.prompt.js";
import { summaryPrompt } from "../../modules/ai/prompts/summary.prompt.js";

/** 
 * 📋 Types of jobs this worker can handle 
 */
export enum AiTaskType {
  QUESTIONS = "QUESTIONS", // Create a quiz
  SUMMARY = "SUMMARY",     // Distill text into key points
  NOTES = "NOTES",       // Generate study notes
}

type JobData = {
  type: AiTaskType;
  userId: string;
  topic?: string;
  content?: string;
};

/**
 * 🏭 THE WORKER FACTORY
 * This worker connects to Redis and waits for new assignments.
 */
new Worker<JobData>(
  "ai-tasks",
  async (job: Job<JobData>) => {
    const { type, userId, topic, content } = job.data;
    const identifier = topic || content?.slice(0, 30);

    /**
     * ⚡ SPEED CHECK (Caching)
     * Before calling expensive AI models, we check if we've already done this task.
     * If yes, we return the saved result instantly!
     */
    const cacheKey = `ai:${type.toLowerCase()}:${userId}:${identifier?.toLowerCase()}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      await job.updateProgress(100);
      return cached;
    }

    // 🚀 Start processing
    await job.updateProgress(20);

    let prompt = "";
    let result: any;
    let saved: any;

    try {
      /**
       * 🛤️ TASK ROUTING
       * Depending on the "type", we pick a different path.
       */
      switch (type) {
        
        case AiTaskType.QUESTIONS: {
          /** 📝 TASK: Generate a Quiz */
          if (!topic) throw new Error("Topic required for questions");

          // 🔎 1. Search for relevant context (RAG)
          const context = await retrieveContext({ userId, query: topic });
          const contextText = context?.length > 0 ? context.join("\n\n") : undefined;

          // 🧠 2. Prepare the AI prompt and call the LLM
          prompt = questionPrompt(topic, contextText);
          result = await generateQuestionsWithFallback(prompt);

          // 🛠️ 3. Parse the AI's messy response into clean JSON
          let parsedQuestions = result;
          try {
            if (typeof result === "string") {
              let jsonStr = result.trim();
              if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
              } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
              }
              const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
              if (arrayMatch) jsonStr = arrayMatch[0];
              parsedQuestions = JSON.parse(jsonStr);
            }
          } catch (e) {
            // Fallback if AI output is not valid JSON
            parsedQuestions = [{
              id: 1,
              question: typeof result === "string" ? result : "Failed to generate questions",
              difficulty: "Medium",
              category: "General"
            }];
          }

          if (!Array.isArray(parsedQuestions)) parsedQuestions = [parsedQuestions];

          // 💾 4. Save to Database
          saved = await prisma.question.create({
            data: { topic, questions: parsedQuestions as any, userId },
          });
          break;
        }

        case AiTaskType.SUMMARY: {
          /** 📖 TASK: Summarize Content */
          if (!content) throw new Error("Content required for summary");
          prompt = summaryPrompt(content);
          result = await generateQuestionsWithFallback(prompt);
          
          // 💾 Save result
          saved = await prisma.summary.create({
            data: { content, result: result as string, userId },
          });
          break;
        }

        case AiTaskType.NOTES: {
          /** ✍️ TASK: Generate Study Notes */
          if (!topic) throw new Error("Topic required for notes");
          prompt = notesPrompt(topic);
          result = await generateQuestionsWithFallback(prompt);
          
          // 💾 Save result
          saved = await prisma.note.create({
            data: { topic, notes: result as string, userId },
          });
          break;
        }

        default:
          throw new Error(`Unknown task type: ${type}`);
      }

      // ✅ Almost done!
      await job.updateProgress(80);

      /**
       * 💾 MEMORY SAVE (Caching)
       * We save the result for next time so we don't have to call the AI again.
       */
      await setCache(cacheKey, result, 60 * 60 * 24);
      await job.updateProgress(100);

      return result;

    } catch (error: any) {
      /** 🔴 ERROR HANDLING: If something goes wrong, BullMQ will try again automatically. */
      throw error; 
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5, // 🚦 Can process 5 jobs at the same time
  }
);
