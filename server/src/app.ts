import express from "express";
import aiRoutes from './modules/ai/ai.routes'

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZEST API is running 🚀");
});

app.use('/api/ai', aiRoutes)

export default app;