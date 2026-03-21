import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const aiQueue = new Queue("ai-tasks", {
  connection: redisConnection as any,
});
