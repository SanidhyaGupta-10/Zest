import axios, { AxiosInstance } from 'axios';
import { 
  ChatRequest, 
  IngestRequest, 
  CreateTaskRequest 
} from '@/types/api.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Creates an axios instance with an optional Bearer token.
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

/**
 * Auth-related API calls
 */
export const authApi = {
  syncUser: (token: string) => 
    createApiClient(token).post('/auth/sync', {}),
};

/**
 * AI-related API calls
 */
export const aiApi = {
  chat: (data: ChatRequest, token?: string) => 
    createApiClient(token).post('/ai/chat', data),

  ingestDocument: (data: IngestRequest, token?: string) => 
    createApiClient(token).post('/ai/ingest', data),

  getChats: (token?: string) => 
    createApiClient(token).get('/ai/chats'),

  getChatMessages: (chatId: string, token?: string) => 
    createApiClient(token).get(`/ai/chats/${chatId}`),

  getUserSummaries: (token?: string) => 
    createApiClient(token).get('/ai/history/summaries'),

  getUserNotes: (token?: string) => 
    createApiClient(token).get('/ai/history/notes'),

  getUserQuestions: (token?: string) => 
    createApiClient(token).get('/ai/history/questions'),

  createTask: (data: CreateTaskRequest, token?: string) => 
    createApiClient(token).post('/ai/tasks', data),

  getJobStatus: (jobId: string, token?: string) => 
    createApiClient(token).get(`/jobs/${jobId}`),
};

export default api;
