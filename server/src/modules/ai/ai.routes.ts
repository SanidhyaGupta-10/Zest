import express from 'express';
import {
    chatController,
    taskController,
    getChats,
    getChatMessages,
    ingestDocumentController,
    getUserSummaries,
    getUserNotes,
    getUserQuestions
    } from './ai.controller.js';

import { requireAuth } from '@clerk/express';
import { rateLimit } from '../../middleware/rateLimit.js';
import { attachUser } from '../../middleware/auth.js';


const router = express.Router();

// Ensure all AI routes are protected and have req.user populated
router.use(requireAuth(), attachUser);

/**
 * @server\src\modules\ai\ai.routes.ts POST /api/ai/chat
 * @description Chat / Ask AI (Hybrid RAG). Processes user query with context retrieval.
 * @access private
 */
router.post(
    "/chat",
    rateLimit,
    chatController
);

/**
 * @server\src\modules\ai\ai.routes.ts POST /api/ai/tasks
 * @description Unified AI Tasks (Questions, Summary, Notes). Creates a background job.
 * @access private
 */
router.post(
    "/tasks",
    rateLimit,
    taskController
);

/**
 * @server\src\modules\ai\ai.routes.ts GET /api/ai/chats
 * @description Retrieve all chat sessions for the authenticated user.
 * @access private
 */
router.get(
    "/chats",
    getChats
);

/**
 * @server\src\modules\ai\ai.routes.ts GET /api/ai/chats/:chatId
 * @description Retrieve all messages for a specific chat session.
 * @access private
 */
router.get(
    "/chats/:chatId",
    getChatMessages
);

/**
 * @server\src\modules\ai\ai.routes.ts GET /api/ai/history/summaries
 * @description Retrieve the history of all generated summaries for the user.
 * @access private
 */
router.get(
    "/history/summaries",
    getUserSummaries
);

/**
 * @server\src\modules\ai\ai.routes.ts GET /api/ai/history/notes
 * @description Retrieve the history of all generated study notes for the user.
 * @access private
 */
router.get(
    "/history/notes",
    getUserNotes
);

/**
 * @server\src\modules\ai\ai.routes.ts GET /api/ai/history/questions
 * @description Retrieve the history of all generated quiz questions for the user.
 * @access private
 */
router.get(
    "/history/questions",
    getUserQuestions
);

/**
 * @server\src\modules\ai\ai.routes.ts POST /api/ai/ingest
 * @description Document Ingestion. Chunks content and stores embeddings for RAG.
 * @access private
 */
router.post(
    "/ingest",
    rateLimit,
    ingestDocumentController
);

export default router;