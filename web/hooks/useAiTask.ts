import { useAuth } from "@clerk/nextjs";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { TaskInput } from "@/types/hooks.types";
import { AxiosError } from "axios";

/**
 * Shared polling function with token support to check on AI job status.
 */
export const pollJobStatus = async (jobId: string, token?: string | null): Promise<unknown> => {
  let attempts = 0;
  const maxAttempts = 60; // Increased timeout to 60s for complex tasks

  while (attempts < maxAttempts) {
    try {
      const response = await aiApi.getJobStatus(jobId, token || undefined);
      const data = response.data;

      if (data.status === "completed") {
        return data.result;
      }

      if (data.status === "failed") {
        throw new Error(data.failedReason || "AI processing failed. Please try again.");
      }

      // Wait 1s before next poll
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message || "Failed to poll job status");
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred during polling");
    }
  }

  throw new Error("Processing timeout: The AI is taking longer than expected. Please check your history in a moment.");
};

/**
 * @web\hooks\useAiTask.ts
 * @description Core hook for managing long-running AI tasks (Questions, Summaries).
 * @flow createTask -> pollJobStatus -> returns final result
 */
export const useAiTask = (): UseMutationResult<unknown, Error, TaskInput> => {
  const { userId, getToken } = useAuth();

  return useMutation({
    mutationFn: async (input: TaskInput): Promise<unknown> => {
      if (!userId) {
        throw new Error("User not authenticated. Please log in to perform AI tasks.");
      }

      const token = await getToken();

      // Create the task
      const response = await aiApi.createTask(input, token || undefined);
      const data = response.data;

      if (!data.jobId) {
        throw new Error("Failed to initialize AI task: No jobId received.");
      }

      // Poll until completion and return result
      return await pollJobStatus(data.jobId, token);
    },
  });
};
