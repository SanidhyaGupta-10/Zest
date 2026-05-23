import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/types/api.types";

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
