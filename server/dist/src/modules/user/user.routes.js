"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@clerk/express");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
/**
 * User routes.
 *
 * Base path: /api/user
 */
router.post('/sync', (0, express_2.requireAuth)(), auth_1.attachUser, user_controller_1.syncUser);
exports.default = router;
