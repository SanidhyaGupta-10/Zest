import { Request, Response } from "express";
import { aiQueue } from "../../queues/ai.queue";
import { generateRAGResponse } from "./rag/rag.service";
import { prisma } from "../../config/db";
import { AiTaskType } from "../../queues/workers/ai.worker";
import { ingestDocument } from "./rag/ingestion/ingestion.service";

/**
 * Hybrid RAG Chat Controller
 * Handles user queries with optional RAG context and LLM fallback
 */
export const chatController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, chatId } = req.body;
    const userId = req.user?.userId;

    console.log('[ChatController] Request body:', req.body);
    console.log('[ChatController] UserId from auth:', userId);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!query) {
      res.status(400).json({ message: "Query is required" });
      return;
    }

    // Handle Chat Session
    let chat = chatId ? await prisma.chat.findUnique({ where: { id: chatId } }) : null;

    if (chatId && (!chat || chat.userId !== userId)) {
      res.status(404).json({ 
        message: "Chat not found" 
      });
      return;
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: { 
          userId, 
          title: query.slice(0, 50) 
        },
      });
    }

    // Save User Message
    await prisma.message.create({
      data: { 
        chatId: chat.id, 
        role: "user", 
        content: query 
      },
    });

    // Generate Response
    const result = await generateRAGResponse({ userId, query });
    console.log('[ChatController] RAG result:', JSON.stringify(result));

    // Save Assistant Message
    await prisma.message.create({
      data: { 
        chatId: chat.id, 
        role: "assistant", 
        content: result.answer ?? "No response generated" 
      },
    });

    const responsePayload = { chatId: chat.id, answer: result.answer };
    console.log('[ChatController] Sending response:', JSON.stringify(responsePayload));
    res.json(responsePayload);
    return;

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ success: false, message: "Processing failed" });
    return;
  }
};

/**
 * Unified Task Controller
 * Handles Summarization, Question Generation, and Note Generation
 */
export const taskController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, topic, content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        message: "Unauthorized" 
      });
      return;
    }
    if (!type || !Object.values(AiTaskType).includes(type)) {
      res.status(400).json({ message: "Valid task type is required" });
      return;
    }

    // Queue the job
    const job = await aiQueue.add(
      type.toLowerCase(), 
    {
      type,
      userId,
      topic,
      content
    }, {
      attempts: 3,
      backoff: { 
        type: "exponential", 
        delay: 1000 
      },
    });

    res.json({
      success: true,
      jobId: job.id,
      message: `${type} task queued successfully`,
    });
    return;

  } catch (error) {
    console.error("Task Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to queue task" 
    });
    return;
  }
};

/**
 * Get History Controllers
 */
export const getChats = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  res.json({ 
    success: true, 
    chats 
  });
};

/**
 * Get Chat Messages
 * GET /api/ai/chats/:chatId
 */
export const getChatMessages = async (req: Request, res: Response): Promise<void> => {
  const chatId = String(req.params.chatId);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }


  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat || chat.userId !== userId) {
    res.status(404).json({ message: "Chat not found" });
    return;
  }

  res.json({ success: true, chat });
};

/**
 * Get User's Summaries History
 * GET /api/ai/history/summaries
 */
export const getUserSummaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const summaries = await prisma.summary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        result: true,
        createdAt: true,
      },
    });

    res.json({ 
      success: true, 
      summaries 
    });
  } catch (error) {
    console.error("Get Summaries Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

/**
 * Get User's Notes History
 * GET /api/ai/history/notes
 */
export const getUserNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        topic: true,
        notes: true,
        createdAt: true,
      },
    });

    res.json({ 
      success: true, 
      notes 
    });
  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

/**
 * Get User's Questions History
 * GET /api/ai/history/questions
 */
export const getUserQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const questions = await prisma.question.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        topic: true,
        questions: true,
        createdAt: true,
      },
    });

    res.json({ 
      success: true, 
      questions 
    });
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Document Ingestion Controller
 * Handles document chunking and embedding storage for RAG
 */
export const ingestDocumentController = async (
  req: Request, res: Response
): Promise<void> => {
  try {
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!content || typeof content !== "string") {
      res.status(400).json({ message: "Content is required and must be a string" });
      return;
    }

    console.log(`[IngestDocument] Processing document for user: ${userId}, content length: ${content.length}`);

    // Process the document - chunk and store embeddings
    const result = await ingestDocument({
      userId,
      content,
    });

    console.log(`[IngestDocument] Successfully ingested ${result.chunks} chunks`);

    res.json({
      success: true,
      chunks: result.chunks,
      message: `Document processed and indexed into ${result.chunks} chunks`,
    });

  } catch (error) {
    console.error("Ingest Document Controller Error:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    res.status(500).json({
      success: false,
      message: "Failed to ingest document",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};