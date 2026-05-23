import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/types/api.types";
import { QuestionItem } from "@/types/history.types";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * @web\hooks\useQuestions.ts
 * @description Hook to generate quiz questions based on a topic.
 * @flow useAiTask -> parseQuestions -> returns structured QuestionItem[]
 */
export const useQuestions = (): Omit<UseMutationResult<QuestionItem[], Error, string>, 'mutate' | 'mutateAsync'> & {
  mutate: (topic: string, options?: any) => void;
  mutateAsync: (topic: string, options?: any) => Promise<QuestionItem[]>;
} => {
  const taskMutation = useAiTask();

  const parseQuestions = (res: any): QuestionItem[] => {
    let qList: QuestionItem[] = [];
    let parsedRes = res;

    if (typeof res === 'string') {
      try {
        const jsonMatch = res.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedRes = JSON.parse(jsonMatch[0]);
        } else {
          parsedRes = JSON.parse(res);
        }
      } catch (e) {
        parsedRes = res;
      }
    }

    if (Array.isArray(parsedRes)) {
      qList = parsedRes.map((item, idx) => {
        if (typeof item === 'string') {
          return { id: idx + 1, question: item, difficulty: 'Medium', category: 'General' };
        }
        return {
          id: item.id || idx + 1,
          question: item.question || String(item),
          difficulty: item.difficulty || 'Medium',
          category: item.category || 'General'
        };
      });
    } else if (typeof parsedRes === 'string') {
      qList = [{ id: 1, question: parsedRes, difficulty: 'Medium', category: 'General' }];
    } else if (parsedRes && typeof parsedRes === 'object') {
      const questionsArray = parsedRes.questions || parsedRes.result || parsedRes;
      if (Array.isArray(questionsArray)) {
        qList = questionsArray.map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          question: item.question || String(item),
          difficulty: item.difficulty || 'Medium',
          category: item.category || 'General'
        }));
      }
    }

    return qList;
  };

  return {
    ...taskMutation,
    mutate: (topic: string, options?: any) =>
      taskMutation.mutate({ type: AiTaskType.QUESTIONS, topic }, {
        ...options,
        onSuccess: (data: any, variables: any, context: any) => {
          const parsed = parseQuestions(data);
          if (options?.onSuccess) options.onSuccess(parsed, variables, context);
        }
      }),
    mutateAsync: async (topic: string, options?: any) => {
      const data = await taskMutation.mutateAsync({ type: AiTaskType.QUESTIONS, topic }, options);
      return parseQuestions(data);
    },
  };
};
