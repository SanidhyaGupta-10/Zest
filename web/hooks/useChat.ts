import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { useState, useCallback } from "react";

export type Message = {
  role: "user" | "ai";
  content: string;
};

export const useChat = () => {
  const { userId, getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (query: string) => {
      if (!userId) throw new Error("User not authenticated");

      const token = await getToken();
      console.log('[useChat] Sending query:', query);
      console.log('[useChat] Token present:', !!token);
      console.log('[useChat] Token value (first 50 chars):', token ? token.substring(0, 50) + '...' : 'EMPTY');

      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await aiApi.chat({ query }, token);
      console.log('[useChat] Full response object:', response);
      console.log('[useChat] Response status:', response?.status);
      console.log('[useChat] Response data:', response?.data);
      const data = response.data;
      console.log('[useChat] Raw data:', JSON.stringify(data));

      // Handle sync response (direct answer) - check for answer OR result field
      const aiMessage = data?.answer || data?.result || data?.message;
      console.log('[useChat] Extracted AI message:', aiMessage);
      console.log('[useChat] Is truthy:', !!aiMessage);

      if (!aiMessage) {
        console.error('[useChat] No AI message found in response. Full data:', data);
        throw new Error("No AI response received from server");
      }

      return aiMessage;
    },
    onSuccess: (aiMessage: string) => {
      console.log('[useChat] Setting AI message:', aiMessage);
      setMessages((prev) => [...prev, { role: "ai", content: aiMessage }]);
      setError(null);
    },
    onError: (err: Error) => {
      console.error('[useChat] Error:', err);
      setError(err.message || "Failed to get AI response");
    },
  });

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Optimistic update: show user message immediately
    setMessages((prev) => [...prev, { role: "user", content }]);
    setError(null);
    mutation.mutate(content);
  }, [mutation]);

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
    error: error || mutation.error?.message || null,
  };
};
