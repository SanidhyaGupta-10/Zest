import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { useState, useCallback } from "react";
import { Message } from "@/types/hooks.types";

export const useChat = () => {
  const { userId, getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (query: string) => {
      if (!userId) throw new Error("User not authenticated");

      const token = await getToken();


      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await aiApi.chat({ query }, token);

      const data = response.data;


      // Handle sync response (direct answer) - check for answer OR result field
      const aiMessage = data?.answer || data?.result || data?.message;


      if (!aiMessage) {
        throw new Error("No AI response received from server");
      }

      return aiMessage;
    },
    onSuccess: (aiMessage: string) => {

      setMessages((prev) => [...prev, { role: "ai", content: aiMessage }]);
      setError(null);
    },
    onError: (err: Error) => {

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
