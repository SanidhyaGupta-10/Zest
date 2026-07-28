// Redis Cache Helpers: Provides simple JSON get/set operations with TTL expiration for LLM responses.
import { redisConnection } from "../queues/connection";

// Retrieve and deserialize cached JSON payload
export const getCache = async (key: string) => {
    const data = await redisConnection.get(key);
    return data ? JSON.parse(data) : null;
};

// Serialize and store payload in Redis with TTL in seconds
export const setCache = async (key: string, value: any, ttl: number) => {
    await redisConnection.set(key, JSON.stringify(value), 'EX', ttl);
};
