// Frontend API Methods: Defines typed HTTP callers for Auth, Chat, RAG Ingestion, and Job Queues.
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  withCredentials: true,
});

// Log responses and transparently pass errors downstream
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Factory function generating an Axios client attached with Clerk Bearer token
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
    (response) => response,
    (error) => Promise.reject(error)
  );

  return client;
};

// Supported async background task types
export enum AiTaskType {
  QUESTIONS = "QUESTIONS",
  SUMMARY = "SUMMARY",
  NOTES = "NOTES",
}

// Auth endpoints
export const authApi = {
  syncUser: (token: string) => {
    return api.post('/auth/sync', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

// AI & Queue management endpoints
export const aiApi = {
  chat: (data: { query: string; chatId?: string }, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.post('/ai/chat', data);
  },

  ingestDocument: (data: { content: string }, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.post('/ai/ingest', data);
  },

  getChats: (token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get('/ai/chats');
  },
  
  getChatMessages: (chatId: string, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get(`/ai/chats/${chatId}`);
  },

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

  createTask: (data: { type: AiTaskType; topic?: string; content?: string }, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.post('/ai/tasks', data);
  },

  getJobStatus: (jobId: string, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get(`/jobs/${jobId}`);
  },
};

export default api;
