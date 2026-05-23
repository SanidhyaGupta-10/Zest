import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { Note, Summary, Question, Chat, Message } from "@/types/history.types";

/**
 * @web\hooks\useHistory.ts
 * @description Centralized hook for managing user history. Provides optimized, cached queries.
 * @flow useAuth -> getToken -> aiApi -> useQuery -> components
 */
export const useHistory = () => {
  const { userId, getToken } = useAuth();

  // Cache configuration for high performance
  const CACHE_CONFIG = {
    staleTime: 5 * 60 * 1000, // Data remains "fresh" for 5 minutes
    gcTime: 30 * 60 * 1000,    // Keep data in memory for 30 minutes
    retry: 2,
    refetchOnWindowFocus: false, // Prevents annoying flashes when switching windows
  };

  /**
   * Fetches the user's generated study notes history.
   */
  const getNotes: UseQueryResult<Note[], Error> = useQuery({
    queryKey: ["history", "notes", userId],
    queryFn: async (): Promise<Note[]> => {
      const token = await getToken();
      const response = await aiApi.getUserNotes(token || undefined);
      return response.data?.notes || [];
    },
    enabled: !!userId,
    ...CACHE_CONFIG,
  });

  /**
   * Fetches the user's summary generation history.
   */
  const getSummaries: UseQueryResult<Summary[], Error> = useQuery({
    queryKey: ["history", "summaries", userId],
    queryFn: async (): Promise<Summary[]> => {
      const token = await getToken();
      const response = await aiApi.getUserSummaries(token || undefined);
      return response.data?.summaries || [];
    },
    enabled: !!userId,
    ...CACHE_CONFIG,
  });

  /**
   * Fetches the user's generated quiz questions history.
   */
  const getQuestions: UseQueryResult<Question[], Error> = useQuery({
    queryKey: ["history", "questions", userId],
    queryFn: async (): Promise<Question[]> => {
      const token = await getToken();
      const response = await aiApi.getUserQuestions(token || undefined);
      return response.data?.questions || [];
    },
    enabled: !!userId,
    ...CACHE_CONFIG,
  });

  /**
   * Fetches the user's chat conversation history.
   */
  const getChats: UseQueryResult<Chat[], Error> = useQuery({
    queryKey: ["history", "chats", userId],
    queryFn: async (): Promise<Chat[]> => {
      const token = await getToken();
      const response = await aiApi.getChats(token || undefined);
      return response.data?.chats || [];
    },
    enabled: !!userId,
    ...CACHE_CONFIG,
  });

  /**
   * Retrieves specific messages for a selected chat.
   * 
   * @param {string} chatId - The unique identifier of the chat session.
   * @returns {Promise<Message[]>} Array of conversation messages.
   */
  const getChatMessages = async (chatId: string): Promise<Message[]> => {
    const token = await getToken();
    const response = await aiApi.getChatMessages(chatId, token || undefined);
    return response.data?.chat?.messages || [];
  };

  return {
    notes: getNotes,
    summaries: getSummaries,
    questions: getQuestions,
    chats: getChats,
    getChatMessages,
  };
};
