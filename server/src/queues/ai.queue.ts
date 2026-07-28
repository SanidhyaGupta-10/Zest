// BullMQ Queue Definition: Represents the asynchronous queue for heavy AI background tasks (summary, notes, questions).
import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const aiQueue = new Queue("ai-tasks", {
  connection: redisConnection as any,
});
