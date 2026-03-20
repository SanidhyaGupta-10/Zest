import express from 'express';
import { chatController, generateQuestions, notesController, summarizeController } from './ai.controller';
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
 *  Generate Questions
 *  POST /api/ai/generate-questions
 */
router.post(
    "/generate-questions", 
    requireAuth(), 
    rateLimit,
    generateQuestions
)

/**
 *  Summarize
 *  POST /api/ai/summarize
 */
router.post(
    "/summarize", 
    requireAuth(), 
    rateLimit,
    summarizeController
);

/**
 *  Notes
 *  POST /api/ai/notes
*/
router.post(
    "/notes", 
    requireAuth(), 
    rateLimit, 
    notesController
);

export default router;