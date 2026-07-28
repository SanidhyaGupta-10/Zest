// Upstash Redis Connection: Initializes the single shared Redis instance for BullMQ background workers and caching.
import { Redis } from "ioredis";

const REDIS_URL = process.env.UPSTASH_REDIS_URL;

if (!REDIS_URL) {
  throw new Error("UPSTASH_REDIS_URL is not defined in environment variables.");
}

// ioredis client configured with TLS and disabled max retries per request (required for BullMQ)
export const redisConnection = new Redis(REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
});