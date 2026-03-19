import express from 'express';
import { generateQuestions, notesController, summarizeController } from './ai.controller';
import { requireAuth } from '@clerk/express';
import { rateLimit } from '../../middleware/rateLimit';

const router = express.Router();

/** 
 *  Generate Questions
 *  POST /api/ai/generate-questions
 *  PROTECTED
 *  RATE LIMITED
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
 *  PROTECTED
 *  RATE LIMITED
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
 *  PROTECTED
 *  RATE LIMITED
*/
router.post(
    "/notes", 
    requireAuth(), 
    rateLimit, 
    notesController
);

export default router;