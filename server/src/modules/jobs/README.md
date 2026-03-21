# Jobs Module

This module provides endpoints for tracking the status and results of background AI tasks.

## 📁 Structure

- **`jobs.controller.ts`**: Orchestrates job status retrieval across multiple BullMQ queues.
- **`jobs.routes.ts`**: Defines the endpoint for polling job status.

## 🔄 API Usage

### Poll Job Status
`GET /api/jobs/:jobId`

Returns the current state of a job:
- `waiting`: Job is in the queue.
- `active`: Job is currently being processed by a worker.
- `completed`: Job finished successfully (contains `result`).
- `failed`: Job failed after retries (contains `failedReason`).

---

> [!TIP]
> Use this endpoint in the frontend to show loading states and skeleton loaders until the AI task is complete.
