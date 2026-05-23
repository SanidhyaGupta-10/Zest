import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/types/api.types";

export const useQuestions = () => {
  const taskMutation = useAiTask();

  return {
    ...taskMutation,
    mutate: (topic: string, options?: any) =>
      taskMutation.mutate({ type: AiTaskType.QUESTIONS, topic }, options),
    mutateAsync: (topic: string, options?: any) =>
      taskMutation.mutateAsync({ type: AiTaskType.QUESTIONS, topic }, options),
  };
};
