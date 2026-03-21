import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/lib/api";

export const useNotes = () => {
  const taskMutation = useAiTask();

  return {
    ...taskMutation,
    mutate: (topic: string, options?: any) =>
      taskMutation.mutate({ type: AiTaskType.NOTES, topic }, options),
    mutateAsync: (topic: string, options?: any) =>
      taskMutation.mutateAsync({ type: AiTaskType.NOTES, topic }, options),
  };
};
