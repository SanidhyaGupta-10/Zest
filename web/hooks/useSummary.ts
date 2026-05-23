import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/types/api.types";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * @web\hooks\useSummary.ts
 * @description Hook to generate a summary of provided content.
 * @flow useAiTask -> parseSummary -> returns consistent string
 */
export const useSummary = (): Omit<UseMutationResult<string, Error, string>, 'mutate' | 'mutateAsync'> & {
  mutate: (content: string, options?: any) => void;
  mutateAsync: (content: string, options?: any) => Promise<string>;
} => {
  const taskMutation = useAiTask();

  const parseSummary = (res: any): string => {
    if (typeof res === 'string') return res;
    if (Array.isArray(res)) return res.join('\n');
    if (res && typeof res === 'object') return res.result || res.summary || JSON.stringify(res);
    return String(res);
  };

  return {
    ...taskMutation,
    mutate: (content: string, options?: any) =>
      taskMutation.mutate({ type: AiTaskType.SUMMARY, content }, {
        ...options,
        onSuccess: (data: any, variables: any, context: any) => {
          const parsed = parseSummary(data);
          if (options?.onSuccess) options.onSuccess(parsed, variables, context);
        }
      }),
    mutateAsync: async (content: string, options?: any) => {
      const data = await taskMutation.mutateAsync({ type: AiTaskType.SUMMARY, content }, options);
      return parseSummary(data);
    },
  };
};
