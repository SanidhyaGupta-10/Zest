// Express application setup and core global middleware config.
import express from "express";
import aiRoutes from './modules/ai/ai.routes';
import jobRoutes from './modules/jobs/jobs.routes';
import userRoutes from './modules/user/user.routes';
import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';

const app = express();

// Disable strict routing so trailing slashes don't mismatch endpoints
app.set('strict routing', false);

// List of allowed origins for cross-origin requests
const allowedOrigins = [
  // TODO: Replace with your new Vercel frontend URL after deploying frontend
  "https://zest-delta.vercel.app",
  "http://127.0.0.1:3000"
];

// Configure CORS policy to allow cookies/auth headers from trusted domains
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      origin.startsWith("http://localhost:") ||
      origin.startsWith("https://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.startsWith("https://127.0.0.1:") ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Global auth & body parser middleware
app.use(clerkMiddleware());
app.use(express.json());

// Health check endpoints
app.get("/", (req, res) => {
  res.send("ZEST API is running 🚀");
});

app.get('/health', (req, res) => {
  res.json({
    message: 'ZEST API is OK👍🚀',
    timestamp: new Date().toISOString()
  });
});

// API Module Route Registration
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', userRoutes);

export default app;