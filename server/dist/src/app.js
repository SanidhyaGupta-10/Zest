import express from "express";
import aiRoutes from './modules/ai/ai.routes.js';
import jobRoutes from './modules/jobs/jobs.routes.js';
import userRoutes from './modules/user/user.routes.js';
import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';
const app = express();
app.set('strict routing', false);
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://zest-delta.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Log incoming auth header (first 50 chars of token)
app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth) {
    }
    next();
});
app.use(clerkMiddleware());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("ZEST API is running 🚀");
});
app.get('/health', (req, res) => {
    res.json({
        message: 'ZEST API is OK👍🚀',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', userRoutes);
export default app;
