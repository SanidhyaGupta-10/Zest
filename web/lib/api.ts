import axios from 'axios'
import { api } from './axios'

// Response interceptor: log all responses
api.interceptors.response.use(
  (response) => { return response },
  (error) => { return Promise.reject(error)}
);

// Helper to create an axios instance with a custom token
export const createApiClient = (token?: string | null) => {
  const client = axios.create({
    baseURL: api.defaults.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
};

export enum AiTaskType {
  QUESTIONS = "QUESTIONS",
  SUMMARY = "SUMMARY",
  NOTES = "NOTES",
}

export const authApi = {
  syncUser: (token: string) => {
    return api.post('/auth/sync', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export const aiApi = {
  // Chat - returns { chatId, answer } directly (sync)
  chat: (data: { query: string; chatId?: string }, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.post('/ai/chat', data);
  },

  // Document Ingestion
  ingestDocument: (data: { content: string }, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.post('/ai/ingest', data);
  },

  // History
  getChats: (token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get('/ai/chats');
  },
  getChatMessages: (chatId: string, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get(`/ai/chats/${chatId}`);
  },

  // User Content History
  getUserSummaries: (token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get('/ai/history/summaries');
  },
  getUserNotes: (token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get('/ai/history/notes');
  },
  getUserQuestions: (token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get('/ai/history/questions');
  },

  // Unified Tasks - returns { jobId } (async)
  createTask: (data: { type: AiTaskType; topic?: string; content?: string }, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.post('/ai/tasks', data);
  },

  // Job Status - returns { status, result }
  getJobStatus: (jobId: string, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get(`/jobs/${jobId}`);
  },
};

export default api;
