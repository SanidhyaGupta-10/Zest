import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";

export const useHistory = () => {
  const { userId, getToken } = useAuth();

  const getNotes = useQuery({
    queryKey: ["history", "notes", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await aiApi.getUserNotes(token || undefined);
      return response.data?.notes || [];
    },
    enabled: !!userId,
  });

  const getSummaries = useQuery({
    queryKey: ["history", "summaries", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await aiApi.getUserSummaries(token || undefined);
      return response.data?.summaries || [];
    },
    enabled: !!userId,
  });

  const getQuestions = useQuery({
    queryKey: ["history", "questions", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await aiApi.getUserQuestions(token || undefined);
      return response.data?.questions || [];
    },
    enabled: !!userId,
  });

  const getChats = useQuery({
    queryKey: ["history", "chats", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await aiApi.getChats(token || undefined);
      return response.data?.chats || [];
    },
    enabled: !!userId,
  });

  const getChatMessages = async (chatId: string) => {
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
