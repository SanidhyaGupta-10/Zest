import { AiTaskType } from "@/lib/api";

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
