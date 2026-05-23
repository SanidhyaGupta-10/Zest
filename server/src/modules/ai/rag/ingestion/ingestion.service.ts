import { storeEmbedding } from "../store/vector.store.js";
import { chunkText } from "./chunker.js";
import { generateEmbedding } from "./embedder.js";

/**
 * @server\src\modules\ai\rag\ingestion\ingestion.service.ts ingestDocument
 * @description Ingests a document by chunking the text, generating embeddings for each chunk, and storing them in the vector database.
 * @access private
 */
export const ingestDocument = async ({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) => {
  // 1. chunk
  const chunks = chunkText(content);



  // 2. process each chunk
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    await storeEmbedding({
      userId,
      content: chunk,
      embedding,
    });
  }

  return { success: true, chunks: chunks.length };
};