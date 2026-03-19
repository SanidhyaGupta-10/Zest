import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "./connection";

export const notesQueue = new Queue("notes", {
  connection: redisConnection as any,
});

