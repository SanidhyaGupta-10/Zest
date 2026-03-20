import { openai } from "../../../../providers/openai.provider";

// What it is doing?
// => It is generating embeddings for the given text.
// => The embeddings are generated using the OpenAI API.
// => The embeddings are stored in the database.

export const generateEmbedding = async (text: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
};