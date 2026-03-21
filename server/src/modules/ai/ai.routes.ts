import express from 'express';
import { chatController, taskController, getChats, getChatMessages } from './ai.controller';
import { requireAuth } from '@clerk/express';
import { rateLimit } from '../../middleware/rateLimit';

const router = express.Router();

/**
 * Chat / Ask AI (Hybrid RAG)
 * POST /api/ai/chat
 */
router.post(
    "/chat", 
    requireAuth(), 
    rateLimit,
    chatController
);

/**
 * Unified AI Tasks (Questions, Summary, Notes)
 * POST /api/ai/tasks
 */
router.post(
    "/tasks",
    requireAuth(),
    rateLimit,
    taskController
);

/**
 * Chat History
 */
router.get(
    "/chats",
    requireAuth(),
    getChats
);
router.get(
    "/chats/:chatId",
    requireAuth(),
    getChatMessages
);

export default router;