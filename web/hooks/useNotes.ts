import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";

export const useNotes = () => {
  const { userId, getToken } = useAuth();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error("User not authenticated");

      const token = await getToken();
      console.log('[useNotes] Ingesting document, content length:', content.length);

      // Ingest the document for RAG
      const response = await aiApi.ingestDocument({ content }, token || undefined);
      console.log('[useNotes] Ingestion response:', response.data);

      return response;
    },
  });
};
