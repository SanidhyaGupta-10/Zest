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



    // Cache strategy
    const cacheKey = `ai:${type.toLowerCase()}:${userId}:${identifier?.toLowerCase()}`;
    const cached = await getCache(cacheKey);
    if (cached) {

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
              // Try to extract JSON array from markdown code blocks or raw JSON
              let jsonStr = result.trim();

              // Remove markdown code blocks if present
              if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
              } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
              }

              // Try to find JSON array in the string
              const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
              if (arrayMatch) {
                jsonStr = arrayMatch[0];
              }

              parsedQuestions = JSON.parse(jsonStr);
            }
          } catch (e) {

            // Fallback: create a single question with the raw result
            parsedQuestions = [{
              id: 1,
              question: typeof result === "string" ? result : "Failed to generate questions",
              difficulty: "Medium",
              category: "General"
            }];
          }

          // Ensure parsedQuestions is an array
          if (!Array.isArray(parsedQuestions)) {

            parsedQuestions = [parsedQuestions];
          }

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

        default:
          throw new Error(`Unknown task type: ${type}`);
      }

      await job.updateProgress(80);

      // Cache result
      await setCache(cacheKey, result, 60 * 60 * 24);
      await job.updateProgress(100);


      return result;

    } catch (error: any) {

      throw error; // Let BullMQ handle retries
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5,
  }
);
