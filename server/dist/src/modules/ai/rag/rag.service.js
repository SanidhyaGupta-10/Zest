import { generateFromLLM } from "../../../providers/llm.router.js";
import { retrieveContext } from "./retrieval/retrieval.service.js";
/**
 * @server\src\modules\ai\rag\rag.service.ts generateRAGResponse
 * @description Hybrid RAG + LLM Fallback Service. Attempts to retrieve context for a query; if context is found, uses RAG prompt, otherwise falls back to standard LLM generation.
 * @access private
 */
export const generateRAGResponse = async ({ userId, query, }) => {
    // 1. Retrieval Step: Try retrieving context from vector DB
    const context = await retrieveContext({ userId, query });
    const contextExists = context && context.length > 0;
    let prompt;
    if (contextExists) {
        // 2. Decision Logic: → Use RAG prompt (context + query)
        const contextText = context
            .map((c, i) => `Context [${i + 1}]: ${c}`)
            .join("\n\n");
        prompt = `
Use the provided context only.

CONTEXT:
${contextText}

QUESTION:
${query}

ANSWER:
`;
    }
    else {
        // 2. Decision Logic: NO context → Fallback to normal LLM (query only)
        prompt = `
Answer using your knowledge clearly and concisely.

QUESTION:
${query}

ANSWER:
`;
    }
    // 3. Call LLM (Chat Endpoint functionality)
    // Always respond (never "Not found in context")
    const response = await generateFromLLM(prompt);
    return {
        answer: response,
        mode: contextExists ? "RAG" : "LLM_FALLBACK",
        sources: contextExists ? context : [],
    };
};
