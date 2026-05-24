import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { TaskInput } from "@/types/hook.types";

/**
 * Poll a queued AI job until completion and return the final result string.
 */
export const pollJobStatus = async (jobId: string, token?: string | null): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      const response = await aiApi.getJobStatus(jobId, token || undefined);
      const data = response.data;
      if (data.status === "completed") {
        return data.result;
      }

      if (data.status === "failed") {
        throw new Error(data.failedReason || "Job failed");
      }

      // Wait 1s before next poll
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    } catch (error) {
      throw error;
    }
  }

  throw new Error("Timeout waiting for job");
};

/**
 * Run unified AI tasks (questions, notes, summary) through the backend queue.
 */
export const useAiTask = () => {
  const { userId, getToken } = useAuth();

  return useMutation({
    mutationFn: async (input: TaskInput) => {
      if (!userId) throw new Error("User not authenticated");

      const token = await getToken();
      const response = await aiApi.createTask(input, token || undefined);
      const data = response.data;
      if (!data.jobId) {
        throw new Error("No jobId returned from server");
      }

      const result = await pollJobStatus(data.jobId, token);
      return result;
    },
  });
};
