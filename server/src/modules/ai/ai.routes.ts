import express from 'express';
import { generateQuestions } from './ai.controller';

const router = express.Router();

router.post('/generate-questions', generateQuestions)

export default router;