import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { useState } from "react";

export type Message = {
  role: "user" | "ai";
  content: string;
};

export const useChat = (userId: string | null | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const mutation = useMutation({
    mutationFn: (query: string) => {
      if (!userId) throw new Error("User not authenticated");
      return aiApi.chat({ query, userId });
    },
    onSuccess: (response, query) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: query },
        { role: "ai", content: response.data.answer || response.data.message },
      ]);
    },
  });

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    mutation.mutate(content);
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
