"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const jobs_routes_1 = __importDefault(require("./modules/jobs/jobs.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const express_2 = require("@clerk/express");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.set('strict routing', false);
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Log incoming auth header (first 50 chars of token)
app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth) {
        console.log('[Auth Middleware] Authorization header:', auth.substring(0, 50) + '...');
    }
    else {
        console.log('[Auth Middleware] No Authorization header');
    }
    next();
});
app.use((0, express_2.clerkMiddleware)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("ZEST API is running 🚀");
});
app.get('/health', (req, res) => {
    res.send('OK');
});
app.use('/api/ai', ai_routes_1.default);
app.use('/api/jobs', jobs_routes_1.default);
app.use('/api/auth', user_routes_1.default);
exports.default = app;
