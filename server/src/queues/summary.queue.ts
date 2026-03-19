import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "./connection";

export const summaryQueue = new Queue("summary", {
  connection: redisConnection as any,
});

