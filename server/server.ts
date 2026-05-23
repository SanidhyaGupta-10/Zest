import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Zest server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});