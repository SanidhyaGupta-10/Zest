import express from "express";
import aiRoutes from './modules/ai/ai.routes'
import jobRoutes from './modules/jobs/jobs.routes'
import userRoutes from './modules/user/user.routes'
import { clerkMiddleware } from "@clerk/express";
import cors from 'cors'
import { ingestDocument } from "./modules/ai/rag/ingestion/ingestion.service";

const app = express();

app.set('strict routing', false);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(clerkMiddleware())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZEST API is running 🚀");
});
app.post("/api/test-ingest", async (req, res) => {
  const { content, userId } = req.body;

  const result = await ingestDocument({ userId, content });

  res.json(result);
});

app.use('/api/ai', aiRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

export default app;