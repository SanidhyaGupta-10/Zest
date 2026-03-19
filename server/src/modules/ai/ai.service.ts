import { prisma } from "../../config/db";
import { generateQuestionsWithFallback } from "../../providers/llm.router";
import { getCache, setCache } from "../../utils/cache";

export const generateQuestionsService = async (topic: string) => {
  const cacheKey = `questions:${topic.toLowerCase()}`;

  // 1️⃣ Check cache
  const cached = await getCache(cacheKey);
  if (cached) {
    console.log("Cache hit ✅");
    return cached;
  }

  console.log("Cache miss ❌");

  // 2️⃣ Generate from AI
  const questions = await generateQuestionsWithFallback(topic);

  // 3️⃣ Save to DB
  const saved = await prisma.question.create({
    data: {
      topic,
      questions,
    },
  });

  // 4️⃣ Store in cache
  await setCache(cacheKey, saved, 60 * 60 * 24);

  return saved;
};