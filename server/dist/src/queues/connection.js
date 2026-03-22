"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = require("ioredis");
const REDIS_URL = process.env.UPSTASH_REDIS_URL;
exports.redisConnection = new ioredis_1.Redis(REDIS_URL, {
    tls: {},
    maxRetriesPerRequest: null,
});
