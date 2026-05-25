"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestDocumentController = exports.getUserQuestions = exports.getUserNotes = exports.getUserSummaries = exports.getChatMessages = exports.getChats = exports.taskController = exports.chatController = void 0;
const ai_queue_1 = require("../../queues/ai.queue");
const rag_service_1 = require("./rag/rag.service");
const db_1 = require("../../config/db");
const ai_worker_1 = require("../../queues/workers/ai.worker");
const ingestion_service_1 = require("./rag/ingestion/ingestion.service");
/**
 * Hybrid RAG Chat Controller
 * Handles user queries with optional RAG context and LLM fallback
 */
const chatController = async (req, res) => {
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
        let chat = chatId ? await db_1.prisma.chat.findUnique({ where: { id: chatId } }) : null;
        if (chatId && (!chat || chat.userId !== userId)) {
            res.status(404).json({
                message: "Chat not found"
            });
            return;
        }
        if (!chat) {
            chat = await db_1.prisma.chat.create({
                data: {
                    userId,
                    title: query.slice(0, 50)
                },
            });
        }
        // Save User Message
        await db_1.prisma.message.create({
            data: {
                chatId: chat.id,
                role: "user",
                content: query
            },
        });
        // Generate Response
        const result = await (0, rag_service_1.generateRAGResponse)({ userId, query });
        // Save Assistant Message
        await db_1.prisma.message.create({
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
exports.chatController = chatController;
/**
 * Unified Task Controller
 * Handles Summarization, Question Generation, and Note Generation
 */
const taskController = async (req, res) => {
    try {
        const { type, topic, content } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        if (!type || !Object.values(ai_worker_1.AiTaskType).includes(type)) {
            res.status(400).json({ message: "Valid task type is required" });
            return;
        }
        // Queue the job
        const job = await ai_queue_1.aiQueue.add(type.toLowerCase(), {
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
exports.taskController = taskController;
/**
 * Get History Controllers
 */
const getChats = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const chats = await db_1.prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { messages: true } } },
    });
    res.json({
        success: true,
        chats
    });
};
exports.getChats = getChats;
/**
 * Get Chat Messages
 * GET /api/ai/chats/:chatId
 */
const getChatMessages = async (req, res) => {
    const chatId = String(req.params.chatId);
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const chat = await db_1.prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!chat || chat.userId !== userId) {
        res.status(404).json({ message: "Chat not found" });
        return;
    }
    res.json({ success: true, chat });
};
exports.getChatMessages = getChatMessages;
/**
 * Get User's Summaries History
 * GET /api/ai/history/summaries
 */
const getUserSummaries = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const summaries = await db_1.prisma.summary.findMany({
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
exports.getUserSummaries = getUserSummaries;
/**
 * Get User's Notes History
 * GET /api/ai/history/notes
 */
const getUserNotes = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const notes = await db_1.prisma.note.findMany({
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
exports.getUserNotes = getUserNotes;
/**
 * Get User's Questions History
 * GET /api/ai/history/questions
 */
const getUserQuestions = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const questions = await db_1.prisma.question.findMany({
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
exports.getUserQuestions = getUserQuestions;
/**
 * Document Ingestion Controller
 * Handles document chunking and embedding storage for RAG
 */
const ingestDocumentController = async (req, res) => {
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
        const result = await (0, ingestion_service_1.ingestDocument)({
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
exports.ingestDocumentController = ingestDocumentController;
