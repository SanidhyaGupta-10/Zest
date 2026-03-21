# AI Module Documentation

Welcome to the **AI Module** of Zest. This module is the heart of our AI-driven features, handling everything from prompt engineering and specialized services to advanced Retrieval-Augmented Generation (RAG).

## 📁 Directory Structure

The module is organized into several key areas:

### 1. `prompts/` 🧠
This directory contains standardized templates for interacting with Large Language Models (LLMs).
- **`notes.prompt.ts`**: Defines the "System" and "User" rules for generating structured notes from raw transcriptions or documents.
- **`question.prompt.ts`**: Contains prompts for generating insightful questions based on the provided context.
- **`summary.prompt.ts`**: Simple, direct prompts for creating concise summaries of long-form content.

### 2. `services/` 🛠️
Specific logic handlers for different AI features. These services usually combine prompts with LLM calls (e.g., via LangChain or OpenAI direct).
- **`notes.service.ts`**: Core logic for parsing context into high-quality study notes.
- **`question.service.ts`**: Logic for extracting key queries and quiz-like questions from data.
- **`summary.service.ts`**: Handles the transformation of raw text into a summarized format.

### 3. `rag/` 🚀 (Retrieval-Augmented Generation)
Our RAG system allows the AI to "know" things about your specific data by retrieving relevant snippets before generating a response.
- **`rag.service.ts`**: The main entry point for RAG operations.
- **`ingestion/`**:
  - **`chunker.ts`**: Splits large documents into smaller, manageable pieces.
  - **`embedder.ts`**: Converts text chunks into mathematical vectors (embeddings) that the AI understands.
  - **`ingestion.service.ts`**: Orchestrates the flow of data from raw file to vector store.
- **`retrieval/`**:
  - **`retrieval.service.ts`**: Searches the vector store for the most relevant context based on a user's query.
- **`store/`**:
  - **`vector.store.ts`**: Configuration and connection logic for our vector database (e.g., Pinecone or Supabase Vector).

### 4. 🚀 Entry Points
- **`ai.controller.ts`**: The HTTP layer. Defines the API endpoints (e.g., `POST /ai/chat`, `POST /ai/tasks`).
- **`ai.routes.ts`**: Connects the controller methods to specific URL paths.

## 🔄 The Flow of Information

### Standard LLM Task
`Client Request` -> `AI Controller` -> `AI Queue (Job)` -> `AI Worker` -> `LLM (OpenAI/Gemini)` -> `Prisma (Save)` -> `Client (Poll Job Status)`

### RAG-Enabled Chat
1. **Ingestion**: `Document` -> `Chunker` -> `Embedder` -> `Vector Store`
2. **Querying**: `User Query` -> `Retrieval Service` -> `Found Context` -> `LLM (with Context)` -> `Smart Response`

---

> [!TIP]
> Always use the prompt templates in `prompts/` instead of hardcoding strings in services. This makes it easier to iterate on AI behavior without touching the core logic.
