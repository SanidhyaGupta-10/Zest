import { Redis } from "ioredis";

const REDIS_URL = process.env.UPSTASH_REDIS_URL;

export const redisConnection = new Redis(REDIS_URL!, {
  tls: {},
  maxRetriesPerRequest: null,
});