import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  syncUser: (data: { token: string}) => {
    return api.post('/auth/sync', data);
  }
};

export const aiApi = {
  chat: (data: { query: string; userId: string }) => 
    api.post('/test-rag', data),
  
  ingest: (data: { content: string; userId: string }) => 
    api.post('/test-ingest', data),
  
  summarize: (data: { content: string }) => 
    api.post('/ai/summarize', data),
  
  generateQuestions: (data: { topic: string }) => 
    api.post('/ai/generate-questions', data),

  getJobStatus: (jobId: string) =>
    api.get(`/jobs/${jobId}`),
};

export default api;