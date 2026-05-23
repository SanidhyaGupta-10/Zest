import { generateEmbedding } from "../ingestion/embedder.js";
import { searchSimilar } from "../store/vector.store.js";
/**
 * @server\src\modules\ai\rag\retrieval\retrieval.service.ts retrieveContext
 * @description Retrieves relevant context for a given query by generating an embedding and searching the vector database.
 * @access private
 */
export const retrieveContext = async ({ userId, query, limit = 5, }) => {
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
