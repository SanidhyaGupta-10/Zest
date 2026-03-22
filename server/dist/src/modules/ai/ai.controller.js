"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestDocumentController = exports.getUserQuestions = exports.getUserNotes = exports.getUserSummaries = exports.getChatMessages = exports.getChats = exports.taskController = exports.chatController = void 0;
const express_1 = require("@clerk/express");
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
        const userId = (0, express_1.getAuth)(req).userId;
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
        console.log('[ChatController] RAG result:', JSON.stringify(result));
        // Save Assistant Message
        await db_1.prisma.message.create({
            data: {
                chatId: chat.id,
                role: "assistant",
                content: result.answer ?? "No response generated"
            },
        });
        const responsePayload = { chatId: chat.id, answer: result.answer };
        console.log('[ChatController] Sending response:', JSON.stringify(responsePayload));
        return res.json(responsePayload);
    }
    catch (error) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({ success: false, message: "Processing failed" });
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
        const userId = (0, express_1.getAuth)(req).userId;
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
        return res.json({
            success: true,
            jobId: job.id,
            message: `${type} task queued successfully`,
        });
    }
    catch (error) {
        console.error("Task Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to queue task"
        });
    }
};
exports.taskController = taskController;
/**
 * Get History Controllers
 */
const getChats = async (req, res) => {
    const userId = (0, express_1.getAuth)(req).userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const chats = await db_1.prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { messages: true } } },
    });
    return res.json({
        success: true,
        chats
    });
};
exports.getChats = getChats;
/**
 * Get Chat Messages
 * GET /api/ai/history/chats/:chatId
 */
const getChatMessages = async (req, res) => {
    const chatId = req.params.chatId;
    const userId = (0, express_1.getAuth)(req).userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const chat = await db_1.prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!chat || chat.userId !== userId) {
        return res.status(404).json({ message: "Chat not found" });
    }
    return res.json({ success: true, chat });
};
exports.getChatMessages = getChatMessages;
/**
 * Get User's Summaries History
 * GET /api/ai/history/summaries
 */
const getUserSummaries = async (req, res) => {
    try {
        const userId = (0, express_1.getAuth)(req).userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
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
        return res.json({
            success: true,
            summaries
        });
    }
    catch (error) {
        console.error("Get Summaries Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
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
        const userId = (0, express_1.getAuth)(req).userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
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
        return res.json({
            success: true,
            notes
        });
    }
    catch (error) {
        console.error("Get Notes Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserNotes = getUserNotes;
/**
 * Get User's Questions History
 * GET /api/ai/history/questions
 */
const getUserQuestions = async (req, res) => {
    try {
        const userId = (0, express_1.getAuth)(req).userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
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
        return res.json({
            success: true,
            questions
        });
    }
    catch (error) {
        console.error("Get Questions Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
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
        const userId = (0, express_1.getAuth)(req).userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!content || typeof content !== "string") {
            return res.status(400).json({ message: "Content is required and must be a string" });
        }
        console.log(`[IngestDocument] Processing document for user: ${userId}, content length: ${content.length}`);
        // Process the document - chunk and store embeddings
        const result = await (0, ingestion_service_1.ingestDocument)({
            userId,
            content,
        });
        console.log(`[IngestDocument] Successfully ingested ${result.chunks} chunks`);
        return res.json({
            success: true,
            chunks: result.chunks,
            message: `Document processed and indexed into ${result.chunks} chunks`,
        });
    }
    catch (error) {
        console.error("Ingest Document Controller Error:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: "Failed to ingest document",
            error: error.message,
        });
    }
};
exports.ingestDocumentController = ingestDocumentController;
