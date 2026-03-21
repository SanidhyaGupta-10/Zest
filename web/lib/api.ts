import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: log all responses
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.config?.url, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

// Helper to create an axios instance with a custom token
export const createApiClient = (token?: string | null) => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('[createApiClient] Token set in header:', token.substring(0, 30) + '...');
  } else {
    console.log('[createApiClient] NO TOKEN provided');
  }

  client.interceptors.response.use(
    (response) => {
      console.log('[API Response]', response.config.url, response.data);
      return response;
    },
    (error) => {
      console.error('[API Error]', error.config?.url, error.response?.data, error.message);
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

  // History
  getChats: (token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get('/ai/chats');
  },
  getChatMessages: (chatId: string, token?: string) => {
    const client = token ? createApiClient(token) : api;
    return client.get(`/ai/chats/${chatId}`);
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
