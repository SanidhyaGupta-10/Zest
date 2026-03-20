import { generateEmbedding } from "../ingestion/embedder";
import { searchSimilar } from "../store/vector.store";

export const retrieveContext = async ({
  userId,
  query,
  limit = 5,
}: {
  userId: string;
  query: string;
  limit?: number;
}) => {
  // 1. Convert query → embedding
  const embedding = await generateEmbedding(query);

  // 2. Search similar chunks
  const results = await searchSimilar({
    userId,
    embedding,
    limit,
  });

  // 3. Extract only content
  const context = results.map((r) => r.content);

  return context;
};