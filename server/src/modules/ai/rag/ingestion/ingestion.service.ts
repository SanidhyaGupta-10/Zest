import { storeEmbedding } from "../store/vector.store.js";
import { chunkText } from "./chunker.js";
import { generateEmbedding } from "./embedder.js";

// What it is doing?
// => It is ingesting the document into the database.
// => It is chunking the document into smaller chunks.
// => It is generating embeddings for each chunk.
// => It is storing the embeddings in the database.

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