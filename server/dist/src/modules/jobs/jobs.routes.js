"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobs_controller_1 = require("./jobs.controller");
const express_2 = require("@clerk/express");
const router = express_1.default.Router();
router.get("/:jobId", (0, express_2.requireAuth)(), jobs_controller_1.getJobStatus);
exports.default = router;
