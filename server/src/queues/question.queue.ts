import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "./connection";

export const questionQueue = new Queue("question-generation", {
  connection: redisConnection as any,
});

export const questionQueueEvents = new QueueEvents("question-generation", {
  connection: redisConnection as any,
});
