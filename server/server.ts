import 'dotenv/config';
import app from './src/app';
import { connectDB } from './src/config/db';

const PORT = process.env.PORT

connectDB()
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});