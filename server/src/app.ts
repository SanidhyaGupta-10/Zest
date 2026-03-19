import express from "express";
import aiRoutes from './modules/ai/ai.routes'
import jobRoutes from './modules/jobs/jobs.routes'

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZEST API is running 🚀");
});

app.use('/api/ai', aiRoutes)
app.use('/api/jobs', jobRoutes)

export default app;