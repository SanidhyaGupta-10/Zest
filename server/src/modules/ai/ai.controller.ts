import { Response } from "express";
import { getAuth } from "@clerk/express";
import { AuthenticatedRequest } from "../Request.type";
import { aiQueue } from "../../queues/ai.queue";
import { generateRAGResponse } from "./rag/rag.service";
import { prisma } from "../../config/db";
import { AiTaskType } from "../../queues/workers/ai.worker";
import { ingestDocument } from "./rag/ingestion/ingestion.service";

/**
 * Hybrid RAG Chat Controller
 * Handles user queries with optional RAG context and LLM fallback
 */
export const chatController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, chatId } = req.body;
    const userId = getAuth(req).userId;

    console.log('[ChatController] Request body:', req.body);
    console.log('[ChatController] UserId from auth:', userId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Handle Chat Session
    let chat = chatId ? await prisma.chat.findUnique({ where: { id: chatId } }) : null;

    if (chatId && (!chat || chat.userId !== userId)) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: { userId, title: query.slice(0, 50) },
      });
    }

    // Save User Message
    await prisma.message.create({
      data: { chatId: chat.id, role: "user", content: query },
    });

    // Generate Response
    const result = await generateRAGResponse({ userId, query });
    console.log('[ChatController] RAG result:', JSON.stringify(result));

    // Save Assistant Message
    await prisma.message.create({
      data: { chatId: chat.id, role: "assistant", content: result.answer ?? "No response generated" },
    });

    const responsePayload = { chatId: chat.id, answer: result.answer };
    console.log('[ChatController] Sending response:', JSON.stringify(responsePayload));
    return res.json(responsePayload);

  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({ success: false, message: "Processing failed" });
  }
};

/**
 * Unified Task Controller
 * Handles Summarization, Question Generation, and Note Generation
 */
export const taskController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, topic, content } = req.body;
    const userId = getAuth(req).userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!type || !Object.values(AiTaskType).includes(type)) {
      return res.status(400).json({ message: "Valid task type is required" });
    }

    // Queue the job
    const job = await aiQueue.add(type.toLowerCase(), {
      type,
      userId,
      topic,
      content
    }, {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    });

    return res.json({
      success: true,
      jobId: job.id,
      message: `${type} task queued successfully`,
    });

  } catch (error) {
    console.error("Task Controller Error:", error);
    return res.status(500).json({ success: false, message: "Failed to queue task" });
  }
};

/**
 * Get History Controllers
 */
export const getChats = async (req: AuthenticatedRequest, res: Response) => {
  const userId = getAuth(req).userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return res.json({ success: true, chats });
};

export const getChatMessages = async (req: AuthenticatedRequest, res: Response) => {
  const chatId = req.params.chatId as string;
  const userId = getAuth(req).userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat || chat.userId !== userId) {
    return res.status(404).json({ message: "Chat not found" });
  }

  return res.json({ success: true, chat });
};

/**
 * Get User's Summaries History
 * GET /api/ai/history/summaries
 */
export const getUserSummaries = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getAuth(req).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

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

    return res.json({ success: true, summaries });
  } catch (error: any) {
    console.error("Get Summaries Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get User's Notes History
 * GET /api/ai/history/notes
 */
export const getUserNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getAuth(req).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

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

    return res.json({ success: true, notes });
  } catch (error: any) {
    console.error("Get Notes Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get User's Questions History
 * GET /api/ai/history/questions
 */
export const getUserQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getAuth(req).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

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

    return res.json({ success: true, questions });
  } catch (error: any) {
    console.error("Get Questions Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Document Ingestion Controller
 * Handles document chunking and embedding storage for RAG
 */
export const ingestDocumentController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = getAuth(req).userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Content is required and must be a string" });
    }

    console.log(`[IngestDocument] Processing document for user: ${userId}, content length: ${content.length}`);

    // Process the document - chunk and store embeddings
    const result = await ingestDocument({
      userId,
      content,
    });

    console.log(`[IngestDocument] Successfully ingested ${result.chunks} chunks`);

    return res.json({
      success: true,
      chunks: result.chunks,
      message: `Document processed and indexed into ${result.chunks} chunks`,
    });

  } catch (error: any) {
    console.error("Ingest Document Controller Error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to ingest document",
      error: error.message,
    });
  }
};