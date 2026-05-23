// User
export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

// Sync User
export interface SyncUserInput {
  email: string;
  name: string;
  imageUrl: string;
}

// AI Tasks
export enum AiTaskType {
  QUESTIONS = "QUESTIONS",
  SUMMARY = "SUMMARY",
  NOTES = "NOTES",
}

export interface ChatRequest {
  query: string;
  chatId?: string;
}

export interface IngestRequest {
  content: string;
}

export interface CreateTaskRequest {
  type: AiTaskType;
  topic?: string;
  content?: string;
}

// Responses
export interface ChatResponse {
  chatId: string;
  answer: string;
}

export interface JobResponse {
  jobId: string;
}

export interface JobStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
}
