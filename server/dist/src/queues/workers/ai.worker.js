"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTaskType = void 0;
require("dotenv/config");
const bullmq_1 = require("bullmq");
const connection_1 = require("../connection");
const cache_1 = require("../../utils/cache");
const llm_router_1 = require("../../providers/llm.router");
const db_1 = require("../../config/db");
const retrieval_service_1 = require("../../modules/ai/rag/retrieval/retrieval.service");
const question_prompt_1 = require("../../modules/ai/prompts/question.prompt");
const notes_prompt_1 = require("../../modules/ai/prompts/notes.prompt");
const summary_prompt_1 = require("../../modules/ai/prompts/summary.prompt");
var AiTaskType;
(function (AiTaskType) {
    AiTaskType["QUESTIONS"] = "QUESTIONS";
    AiTaskType["SUMMARY"] = "SUMMARY";
    AiTaskType["NOTES"] = "NOTES";
})(AiTaskType || (exports.AiTaskType = AiTaskType = {}));
new bullmq_1.Worker("ai-tasks", async (job) => {
    const { type, userId, topic, content } = job.data;
    const identifier = topic || content?.slice(0, 30);
    // Cache strategy
    const cacheKey = `ai:${type.toLowerCase()}:${userId}:${identifier?.toLowerCase()}`;
    const cached = await (0, cache_1.getCache)(cacheKey);
    if (cached) {
        await job.updateProgress(100);
        return cached;
    }
    await job.updateProgress(20);
    let prompt = "";
    let result;
    let saved;
    try {
        switch (type) {
            case AiTaskType.QUESTIONS: {
                if (!topic)
                    throw new Error("Topic required for questions");
                const context = await (0, retrieval_service_1.retrieveContext)({ userId, query: topic });
                const contextText = context?.length > 0 ? context.join("\n\n") : undefined;
                prompt = (0, question_prompt_1.questionPrompt)(topic, contextText);
                result = await (0, llm_router_1.generateQuestionsWithFallback)(prompt);
                // Parse JSON if needed
                let parsedQuestions = result;
                try {
                    if (typeof result === "string") {
                        // Try to extract JSON array from markdown code blocks or raw JSON
                        let jsonStr = result.trim();
                        // Remove markdown code blocks if present
                        if (jsonStr.startsWith('```json')) {
                            jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
                        }
                        else if (jsonStr.startsWith('```')) {
                            jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
                        }
                        // Try to find JSON array in the string
                        const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
                        if (arrayMatch) {
                            jsonStr = arrayMatch[0];
                        }
                        parsedQuestions = JSON.parse(jsonStr);
                    }
                }
                catch (e) {
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
                saved = await db_1.prisma.question.create({
                    data: { topic, questions: parsedQuestions, userId },
                });
                break;
            }
            case AiTaskType.SUMMARY: {
                if (!content)
                    throw new Error("Content required for summary");
                prompt = (0, summary_prompt_1.summaryPrompt)(content);
                result = await (0, llm_router_1.generateQuestionsWithFallback)(prompt);
                saved = await db_1.prisma.summary.create({
                    data: { content, result: result, userId },
                });
                break;
            }
            case AiTaskType.NOTES: {
                if (!topic)
                    throw new Error("Topic required for notes");
                prompt = (0, notes_prompt_1.notesPrompt)(topic);
                result = await (0, llm_router_1.generateQuestionsWithFallback)(prompt);
                saved = await db_1.prisma.note.create({
                    data: { topic, notes: result, userId },
                });
                break;
            }
            default:
                throw new Error(`Unknown task type: ${type}`);
        }
        await job.updateProgress(80);
        // Cache result
        await (0, cache_1.setCache)(cacheKey, result, 60 * 60 * 24);
        await job.updateProgress(100);
        return result;
    }
    catch (error) {
        throw error; // Let BullMQ handle retries
    }
}, {
    connection: connection_1.redisConnection,
    concurrency: 5,
});
