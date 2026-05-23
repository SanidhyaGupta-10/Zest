import axios, { AxiosInstance } from 'axios';
import { 
  ChatRequest, 
  IngestRequest, 
  CreateTaskRequest 
} from '@/types/api.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * @web\lib\api.ts createApiClient
 * @description Creates an axios instance with an optional Bearer token.
 * @access internal
 */
export const createApiClient = (token?: string | null): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('[API Error]:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

// Default instance for non-auth or general use
const api = createApiClient();

export const authApi = {
  /**
   * @web\lib\api.ts POST /api/auth/sync
   * @description Triggers a sync of Clerk user data with the backend database.
   * @access private
   */
  syncUser: (token: string) => 
    createApiClient(token).post('/auth/sync', {}),
};

export const aiApi = {
  /**
   * @web\lib\api.ts POST /api/ai/chat
   * @description Sends a user query to the AI and retrieves a response (RAG enabled).
   * @access private
   */
  chat: (data: ChatRequest, token?: string) => 
    createApiClient(token).post('/ai/chat', data),

  /**
   * @web\lib\api.ts POST /api/ai/ingest
   * @description Ingests document content to be chunked and embedded for RAG.
   * @access private
   */
  ingestDocument: (data: IngestRequest, token?: string) => 
    createApiClient(token).post('/ai/ingest', data),

  /**
   * @web\lib\api.ts GET /api/ai/chats
   * @description Retrieves the user's history of chat sessions.
   * @access private
   */
  getChats: (token?: string) => 
    createApiClient(token).get('/ai/chats'),

  /**
   * @web\lib\api.ts GET /api/ai/chats/:chatId
   * @description Retrieves all messages for a specific chat session.
   * @access private
   */
  getChatMessages: (chatId: string, token?: string) => 
    createApiClient(token).get(`/ai/chats/${chatId}`),

  /**
   * @web\lib\api.ts GET /api/ai/history/summaries
   * @description Retrieves the user's summary generation history.
   * @access private
   */
  getUserSummaries: (token?: string) => 
    createApiClient(token).get('/ai/history/summaries'),

  /**
   * @web\lib\api.ts GET /api/ai/history/notes
   * @description Retrieves the user's generated study notes history.
   * @access private
   */
  getUserNotes: (token?: string) => 
    createApiClient(token).get('/ai/history/notes'),

  /**
   * @web\lib\api.ts GET /api/ai/history/questions
   * @description Retrieves the user's generated quiz questions history.
   * @access private
   */
  getUserQuestions: (token?: string) => 
    createApiClient(token).get('/ai/history/questions'),

  /**
   * @web\lib\api.ts POST /api/ai/tasks
   * @description Queues a background AI task (summary, questions, or notes).
   * @access private
   */
  createTask: (data: CreateTaskRequest, token?: string) => 
    createApiClient(token).post('/ai/tasks', data),

  /**
   * @web\lib\api.ts GET /api/jobs/:jobId
   * @description Polls the server for the status of a background AI task.
   * @access private
   */
  getJobStatus: (jobId: string, token?: string) => 
    createApiClient(token).get(`/jobs/${jobId}`),
};

export default api;
