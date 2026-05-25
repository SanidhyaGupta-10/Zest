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

  try {
    await prisma.note.create({
      data: {
        userId,
        topic,
        notes: textToProcess,
      },
    });
  } catch (dbErr) {
    console.error("Failed to save note to Note history table:", dbErr);
  }

  return { success: true, chunks: chunks.length };
};