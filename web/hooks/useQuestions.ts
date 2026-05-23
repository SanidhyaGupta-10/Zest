import { useAiTask } from "./useAiTask";
import { AiTaskType } from "@/types/api.types";
import { QuestionItem } from "@/types/history.types";

/**
 * @web\hooks\useQuestions.ts
 * @description Hook to generate quiz questions based on a topic.
 * @flow useAiTask -> parseQuestions -> returns structured QuestionItem[]
 */
export const useQuestions = () => {
  const taskMutation = useAiTask();

  const parseQuestions = (res: unknown): QuestionItem[] => {
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
      } catch {
        parsedRes = res;
      }
    }

    if (Array.isArray(parsedRes)) {
      qList = (parsedRes as any[]).map((item, idx) => {
        if (!item) return { id: idx + 1, question: "Malformed question", difficulty: 'Medium', category: 'General' };
        
        if (typeof item === 'string') {
          return { id: idx + 1, question: item, difficulty: 'Medium', category: 'General' };
        }
        
        const qItem = item as Record<string, any>;
        return {
          id: Number(qItem.id) || idx + 1,
          question: String(qItem.question || item),
          difficulty: String(qItem.difficulty || 'Medium'),
          category: String(qItem.category || 'General'),
          hint: qItem.hint ? String(qItem.hint) : undefined,
          solution: qItem.solution ? String(qItem.solution) : undefined
        };
      });
    } else if (typeof parsedRes === 'string') {
      qList = [{ id: 1, question: parsedRes, difficulty: 'Medium', category: 'General' }];
    } else if (parsedRes && typeof parsedRes === 'object') {
      const obj = parsedRes as Record<string, unknown>;
      const questionsArray = obj.questions || obj.result || obj;
      if (Array.isArray(questionsArray)) {
        qList = (questionsArray as any[]).map((item, idx) => {
          if (!item) return { id: idx + 1, question: "Malformed question", difficulty: 'Medium', category: 'General' };
          
          if (typeof item === 'string') {
            return { id: idx + 1, question: item, difficulty: 'Medium', category: 'General' };
          }
          
          const qItem = item as Record<string, any>;
          return {
            id: Number(qItem.id) || idx + 1,
            question: String(qItem.question || item),
            difficulty: String(qItem.difficulty || 'Medium'),
            category: String(qItem.category || 'General'),
            hint: qItem.hint ? String(qItem.hint) : undefined,
            solution: qItem.solution ? String(qItem.solution) : undefined
          };
        });
      }
    }

    return qList;
  };

  return {
    ...taskMutation,
    mutate: (topic: string, options?: { onSuccess?: (data: QuestionItem[], variables: string, context: unknown) => void }) =>
      taskMutation.mutate({ type: AiTaskType.QUESTIONS, topic }, {
        ...options,
        onSuccess: (data: unknown, variables: unknown, context: unknown) => {
          const parsed = parseQuestions(data);
          if (options?.onSuccess) options.onSuccess(parsed, topic, context);
        }
      }),
    mutateAsync: async (topic: string, options?: unknown) => {
      const data = await taskMutation.mutateAsync({ type: AiTaskType.QUESTIONS, topic }, options as any);
      return parseQuestions(data);
    },
  };
};
