import 'dotenv/config';
import app from './src/app';
import { connectDB } from './src/config/db';

const PORT = process.env.PORT

async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

startServer()