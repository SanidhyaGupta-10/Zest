import { aiQueue } from "../../queues/ai.queue.js";
import { generateRAGResponse } from "./rag/rag.service.js";
import { prisma } from "../../config/db.js";
import { AiTaskType } from "../../queues/workers/ai.worker.js";
import { ingestDocument } from "./rag/ingestion/ingestion.service.js";
/**
 * @server\src\modules\ai\ai.controller.ts chatController
 * @description Hybrid RAG Chat Controller. Handles user queries with context retrieval and LLM fallback.
 * @access private
 */
export const chatController = async (req, res) => {
    try {
        const { query, chatId } = req.body;
        const userId = req.user?.userId;
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
        // Save Assistant Message
        await prisma.message.create({
            data: {
                chatId: chat.id,
                role: "assistant",
                content: result.answer ?? "No response generated"
            },
        });
        const responsePayload = { chatId: chat.id, answer: result.answer };
        res.json(responsePayload);
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Processing failed" });
        return;
    }
};
/**
 * @server\src\modules\ai\ai.controller.ts taskController
 * @description Unified Task Controller. Handles Summarization, Question Generation, and Note Generation via BullMQ.
 * @access private
 */
export const taskController = async (req, res) => {
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
        const job = await aiQueue.add(type.toLowerCase(), {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to queue task"
        });
        return;
    }
};
/**
 * @server\src\modules\ai\ai.controller.ts getChats
 * @description Retrieve all chat sessions for the authenticated user.
 * @access private
 */
export const getChats = async (req, res) => {
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
 * @server\src\modules\ai\ai.controller.ts getChatMessages
 * @description Retrieve all messages for a specific chat session.
 * @access private
 */
export const getChatMessages = async (req, res) => {
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
 * @server\src\modules\ai\ai.controller.ts getUserSummaries
 * @description Retrieve the history of all generated summaries for the user.
 * @access private
 */
export const getUserSummaries = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
/**
 * @server\src\modules\ai\ai.controller.ts getUserNotes
 * @description Retrieve the history of all generated study notes for the user.
 * @access private
 */
export const getUserNotes = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
/**
 * @server\src\modules\ai\ai.controller.ts getUserQuestions
 * @description Retrieve the history of all generated quiz questions for the user.
 * @access private
 */
export const getUserQuestions = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
/**
 * @server\src\modules\ai\ai.controller.ts ingestDocumentController
 * @description Document Ingestion Controller. Handles chunking and embedding storage for RAG.
 * @access private
 */
export const ingestDocumentController = async (req, res) => {
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
        // Process the document - chunk and store embeddings
        const result = await ingestDocument({
            userId,
            content,
        });
        res.json({
            success: true,
            chunks: result.chunks,
            message: `Document processed and indexed into ${result.chunks} chunks`,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to ingest document",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
