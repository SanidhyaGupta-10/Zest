import { redisConnection } from "../queues/connection.js";
/**
 * Get data from cache
 */
export const getCache = async (key) => {
    const data = await redisConnection.get(key);
    return data ? JSON.parse(data) : null;
};
/**
 * Set data in cache
 */
export const setCache = async (key, value, ttl) => {
    await redisConnection.set(key, JSON.stringify(value), 'EX', ttl);
};
