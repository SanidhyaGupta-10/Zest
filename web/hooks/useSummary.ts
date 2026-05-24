import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/lib/api";

/**
 * Wrapper around useAiTask configured for summarization.
 */
export const useSummary = () => {
  const taskMutation = useAiTask();

  return {
    ...taskMutation,
    mutate: (content: string, options?: any) =>
      taskMutation.mutate({ type: AiTaskType.SUMMARY, content }, options),
    mutateAsync: (content: string, options?: any) =>
      taskMutation.mutateAsync({ type: AiTaskType.SUMMARY, content }, options),
  };
};
