"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = void 0;
const express_1 = require("@clerk/express");
const ai_queue_1 = require("../../queues/ai.queue");
const queues = [ai_queue_1.aiQueue];
const getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = (0, express_1.getAuth)(req).userId;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Try to find the job in any queue
        let job;
        for (const queue of queues) {
            job = await queue.getJob(jobId);
            if (job)
                break;
        }
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.data.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        // Get job state: waiting | active | completed | failed
        const state = await job.getState();
        // Map state to status for frontend compatibility
        let status;
        if (state === "completed") {
            status = "completed";
        }
        else if (state === "failed") {
            status = "failed";
        }
        else {
            status = "queued"; // waiting | active
        }
        return res.json({
            status,
            result: job.returnvalue ?? null,
            failedReason: job.failedReason ?? null,
            progress: job.progress ?? 0,
        });
    }
    catch (err) {
        console.error("Error fetching job status:", err);
        return res.status(500).json({ message: "Error fetching job status" });
    }
};
exports.getJobStatus = getJobStatus;
