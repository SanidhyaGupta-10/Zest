"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.getCache = void 0;
const connection_1 = require("../queues/connection");
/**
 * Get data from cache
 */
const getCache = async (key) => {
    const data = await connection_1.redisConnection.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCache = getCache;
/**
 * Set data in cache
 */
const setCache = async (key, value, ttl) => {
    await connection_1.redisConnection.set(key, JSON.stringify(value), 'EX', ttl);
};
exports.setCache = setCache;
