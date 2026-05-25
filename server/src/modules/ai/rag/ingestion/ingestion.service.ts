import { storeEmbedding } from "../store/vector.store";
import { chunkText } from "./chunker";
import { generateEmbedding } from "./embedder";
import https from "https";

const isUrl = (str: string): boolean => {
  try {
    const url = new URL(str.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

const fetchJinaReader = (targetUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Trim the target URL and encode it to construct a clean Jina Reader URL
    const url = `https://r.jina.ai/${targetUrl.trim()}`;
    const options = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.JINA_API_KEY || "jina_4107debeabd242b7adb7976256423134AMC51eRBlIZGK774Xx-kk81_LMVG"}`
      }
    };

    https.get(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(data);
      });
    }).on("error", (e) => {
      reject(e);
    });
  });
};

export const ingestDocument = async ({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) => {
  let textToProcess = content;

  if (isUrl(content)) {
    try {
      console.log(`Ingesting content from URL via Jina Reader: ${content}`);
      const fetchedContent = await fetchJinaReader(content);
      if (fetchedContent && fetchedContent.trim().length > 0) {
        textToProcess = fetchedContent;
      }
    } catch (err) {
      console.error("Failed to fetch URL content via Jina Reader:", err);
      throw new Error(`Failed to fetch website content: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 1. chunk
  const chunks = chunkText(textToProcess);

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