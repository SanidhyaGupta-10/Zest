import app from './src/app';
import 'dotenv/config';
import { connectDB } from './src/config/db';

const PORT = process.env.PORT

connectDB()
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});