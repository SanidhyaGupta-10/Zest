import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/types/api.types";

/**
 * @web\hooks\useSummary.ts
 * @description Hook to generate a summary of provided content.
 * @flow useAiTask -> parseSummary -> returns consistent string
 */
export const useSummary = () => {
  const taskMutation = useAiTask();

  const parseSummary = (res: unknown): string => {
    if (typeof res === 'string') return res;
    if (Array.isArray(res)) return res.join('\n');
    if (res && typeof res === 'object') {
      const obj = res as Record<string, unknown>;
      return (obj.result as string) || (obj.summary as string) || JSON.stringify(res);
    }
    return String(res);
  };

  return {
    ...taskMutation,
    mutate: (content: string, options?: { onSuccess?: (data: string, variables: string, context: unknown) => void }) =>
      taskMutation.mutate({ type: AiTaskType.SUMMARY, content }, {
        ...options,
        onSuccess: (data: unknown, variables: unknown, context: unknown) => {
          const parsed = parseSummary(data);
          if (options?.onSuccess) options.onSuccess(parsed, content, context);
        }
      }),
    mutateAsync: async (content: string, options?: unknown) => {
      const data = await taskMutation.mutateAsync({ type: AiTaskType.SUMMARY, content }, options as any);
      return parseSummary(data);
    },
  };
};
