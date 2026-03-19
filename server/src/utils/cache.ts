import { redisConnection } from "../queues/connection";

/**
 * Get data from cache
 */
export const getCache = async (key: string) => {
    const data = await redisConnection.get(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Set data in cache
 */
export const setCache = async (key: string, value: any, ttl: number) => {
    await redisConnection.set(key, JSON.stringify(value), 'EX', ttl);
}

