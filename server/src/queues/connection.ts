import { Redis } from "ioredis";

const REDIS_URL = process.env.UPSTASH_REDIS_URL;

if (!REDIS_URL) {
  throw new Error("UPSTASH_REDIS_URL is not defined in environment variables.");
}

export const redisConnection = new Redis(REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
});