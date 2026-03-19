import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "./connection";

export const questionQueue = new Queue("question-generation", {
  connection: redisConnection as any,
});

