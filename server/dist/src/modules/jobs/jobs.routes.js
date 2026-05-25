"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobs_controller_1 = require("./jobs.controller");
const express_2 = require("@clerk/express");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
/**
 * Job status routes.
 *
 * Base path: /api/jobs
 */
router.get("/:jobId", (0, express_2.requireAuth)(), auth_1.attachUser, jobs_controller_1.getJobStatus);
exports.default = router;
