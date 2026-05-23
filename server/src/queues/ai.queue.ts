import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const aiQueue = new Queue("ai-tasks", {
  connection: redisConnection as any,
});
