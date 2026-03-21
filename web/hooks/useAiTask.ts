import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { aiApi, AiTaskType } from "@/lib/api";

type TaskInput = {
  type: AiTaskType;
  topic?: string;
  content?: string;
};

// Shared polling function with token support
export const pollJobStatus = async (jobId: string, token?: string | null): Promise<string> => {
  console.log('[pollJobStatus] Starting poll for jobId:', jobId);

  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      const response = await aiApi.getJobStatus(jobId, token || undefined);
      const data = response.data;
      console.log('[pollJobStatus] Job status:', data.status, 'Attempt:', attempts);

      if (data.status === "completed") {
        console.log('[pollJobStatus] Job completed, result:', data.result);
        return data.result;
      }

      if (data.status === "failed") {
        console.error('[pollJobStatus] Job failed:', data.failedReason);
        throw new Error(data.failedReason || "Job failed");
      }

      // Wait 1s before next poll
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    } catch (error) {
      console.error('[pollJobStatus] Polling error:', error);
      throw error;
    }
  }

  throw new Error("Timeout waiting for job");
};

export const useAiTask = () => {
  const { userId, getToken } = useAuth();

  return useMutation({
    mutationFn: async (input: TaskInput) => {
      if (!userId) throw new Error("User not authenticated");

      const token = await getToken();
      console.log('[useAiTask] Creating task:', input);

      // Create the task
      const response = await aiApi.createTask(input, token || undefined);
      const data = response.data;
      console.log('[useAiTask] Task response:', data);

      if (!data.jobId) {
        throw new Error("No jobId returned from server");
      }

      // Poll until completion and return result
      const result = await pollJobStatus(data.jobId, token);
      console.log('[useAiTask] Final result:', result);

      return result;
    },
  });
};
