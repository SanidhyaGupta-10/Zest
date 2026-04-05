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

export const useAiTask = () => {
  const { userId, getToken } = useAuth();

  return useMutation({
    mutationFn: async (input: TaskInput) => {
      if (!userId) throw new Error("User not authenticated");

      const token = await getToken();


      // Create the task
      const response = await aiApi.createTask(input, token || undefined);
      const data = response.data;


      if (!data.jobId) {
        throw new Error("No jobId returned from server");
      }

      // Poll until completion and return result
      const result = await pollJobStatus(data.jobId, token);


      return result;
    },
  });
};
