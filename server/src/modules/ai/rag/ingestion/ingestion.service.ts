import { storeEmbedding } from "../store/vector.store";
import { chunkText } from "./chunker";
import { generateEmbedding } from "./embedder";
import https from "https";
import { prisma } from "../../../../config/db";

const isUrl = (str: string): boolean => {
  try {
    const url = new URL(str.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

const fetchJinaReader = (targetUrl: string): Promise<string> => {
  const apiKey = process.env.JINA_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return Promise.reject(new Error("JINA_API_KEY environment variable is required"));
  }

  return new Promise((resolve, reject) => {
    // Sanitize and encode target URL portion to prevent malformed URL requests
    const encodedTargetUrl = encodeURI(targetUrl.trim());
    const url = `https://r.jina.ai/${encodedTargetUrl}`;
    const options = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    };

    const TIMEOUT_MS = 25000;

    const req = https.get(url, options, (res) => {
      // 1. Validate status codes (reject non-2xx)
      const statusCode = res.statusCode || 0;
      if (statusCode < 200 || statusCode >= 300) {
        res.resume(); // Consume response data to free up memory
        req.setTimeout(0); // Clear timeout
        reject(new Error(`HTTP ${statusCode}`));
        return;
      }

      let data = "";
      let receivedBytes = 0;
      const MAX_BYTES = 5 * 1024 * 1024; // 5MB maximum response size limit to prevent Denial of Service

      // 2. Track received bytes and reject if exceeded
      res.on("data", (chunk) => {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_BYTES) {
          res.destroy(); // Terminate the response stream immediately
          req.setTimeout(0); // Clear timeout
          reject(new Error("Response size exceeded maximum limit of 5MB"));
          return;
        }
        data += chunk;
      });

      res.on("end", () => {
        req.setTimeout(0); // Clear timeout
        resolve(data);
      });
    });

    // 3. Enforce request timeout
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.on("error", (e) => {
      req.setTimeout(0); // Clear timeout
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
  const contentIsUrl = isUrl(content);

  if (contentIsUrl) {
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

  // 3. Save to Note database table so it appears in the user's Notes History
  let topic = "Ingested Knowledge";
  if (contentIsUrl) {
    topic = `Web: ${content.replace(/^https?:\/\/(www\.)?/, "").slice(0, 45)}`;
  } else {
    const firstLine = textToProcess.split("\n")[0]?.replace(/[#*`]/g, "").trim();
    if (firstLine) {
      topic = firstLine.slice(0, 50);
    }
  }

  // 4. Truncate notes if they exceed database limits to prevent DB bloat
  const MAX_PERSIST_LENGTH = 100000; // ~100k characters max (~20-30 pages of text)
  let notesToPersist = textToProcess;
  if (notesToPersist.length > MAX_PERSIST_LENGTH) {
    notesToPersist = notesToPersist.slice(0, MAX_PERSIST_LENGTH) + "\n\n... [Content Truncated to prevent DB Bloat]";
  }

  try {
    await prisma.note.create({
      data: {
        userId,
        topic,
        notes: notesToPersist,
      },
    });
  } catch (dbErr) {
    console.error("Failed to save note to Note history table:", dbErr);
  }

  return { success: true, chunks: chunks.length };
};