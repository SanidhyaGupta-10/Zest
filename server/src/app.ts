import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZEST API is running 🚀");
});

export default app;