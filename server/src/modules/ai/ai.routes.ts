import express from 'express';
import { generateQuestions } from './ai.controller';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.post('/generate-questions', requireAuth(), generateQuestions)

export default router;