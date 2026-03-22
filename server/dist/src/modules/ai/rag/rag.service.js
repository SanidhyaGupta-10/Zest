"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRAGResponse = void 0;
const llm_router_1 = require("../../../providers/llm.router");
const retrieval_service_1 = require("./retrieval/retrieval.service");
/**
 * Hybrid RAG + LLM Fallback Service
 */
const generateRAGResponse = async ({ userId, query, }) => {
    // 1. Retrieval Step: Try retrieving context from vector DB
    const context = await (0, retrieval_service_1.retrieveContext)({ userId, query });
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
    const response = await (0, llm_router_1.generateFromLLM)(prompt);
    return {
        answer: response,
        mode: contextExists ? "RAG" : "LLM_FALLBACK",
        sources: contextExists ? context : [],
    };
};
exports.generateRAGResponse = generateRAGResponse;
