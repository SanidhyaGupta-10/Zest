import { AiTaskType } from "@/lib/api";

export type TaskInput = {
  type: AiTaskType;
  topic?: string;
  content?: string;
};

export type ChatMessage = {
  role: "user" | "ai";
  content: string;
};
