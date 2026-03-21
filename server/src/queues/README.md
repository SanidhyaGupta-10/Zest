# Queues & Workers

This directory handles asynchronous task processing using **BullMQ** and **Redis**.

## 📁 Structure

- **`ai.queue.ts`**: The main entry point for adding AI tasks (Questions, Summary, Notes) to the background queue.
- **`connection.ts`**: Shared Redis connection configuration.
- **`workers/ai.worker.ts`**: The consolidated worker that processes all AI tasks.

## 🔄 Task Flow

1. **Controller** adds a job to `aiQueue` with a specific `type`.
2. **Worker** picks up the job.
3. **Logic Flow**:
    - **Cache Check**: Skips processing if a result already exists in Redis.
    - **Context Retrieval (RAG)**: If the task type (like `QUESTIONS`) benefits from user data, it performs a vector similarity search.
    - **LLM Generation**: Calls the `llm.router` to generate responses with multi-provider fallback.
    - **Persistence**: Saves the final result to the Postgres database via Prisma.
    - **Caching**: Stores the result in Redis for future requests.

## 🛠️ Adding New Tasks

To add a new AI task type:
1. Update `AiTaskType` enum in `ai.worker.ts`.
2. Add a new `case` in the worker switch statement.
3. Implement the corresponding prompt and database model.
