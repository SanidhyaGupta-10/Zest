"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiQueue = void 0;
const bullmq_1 = require("bullmq");
const connection_1 = require("./connection");
exports.aiQueue = new bullmq_1.Queue("ai-tasks", {
    connection: connection_1.redisConnection,
});
