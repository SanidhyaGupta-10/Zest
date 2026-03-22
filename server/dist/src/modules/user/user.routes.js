"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@clerk/express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.post('/sync', (0, express_2.requireAuth)(), user_controller_1.syncUser);
exports.default = router;
