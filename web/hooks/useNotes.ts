import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";

export const useNotes = (userId: string | null | undefined) => {
  return useMutation({
    mutationFn: (content: string) => {
      if (!userId) throw new Error("User not authenticated");
      return aiApi.ingest({ content, userId });
    },
  });
};
