import { useAuth } from "@clerk/nextjs";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";

/**
 * @web\hooks\useNotes.ts
 * @description Hook to ingest documents into the RAG system.
 * @flow useAuth -> aiApi.ingestDocument -> returns chunk count
 */
export const useNotes = (): UseMutationResult<number, Error, string> => {
  const { userId, getToken } = useAuth();

  return useMutation({
    mutationFn: async (content: string): Promise<number> => {
      if (!userId) {
        throw new Error("User not authenticated. Please log in to ingest knowledge.");
      }

      const token = await getToken();
      const response = await aiApi.ingestDocument({ content }, token || undefined);
      
      // The API returns { chunks: number } on success
      const chunks = response.data?.chunks;
      
      if (typeof chunks !== "number") {
        throw new Error("Invalid response from server: chunks count missing.");
      }
      
      return chunks;
    },
  });
};
