import { AiTaskType } from "@/types/api.types";

// useAiTask
export type TaskInput = {
  type: AiTaskType;
  topic?: string;
  content?: string;
};

// useChat
export type Message = {
  role: "user" | "ai";
  content: string;
};
