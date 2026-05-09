// server.js (updated)
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import express from 'express';
import fileUpload from 'express-fileupload';
import connectDB from './config/db.js';
import modelRoutes from './routes/modelRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
// server.js (add this line)
import authRoutes from './routes/authRoutes.js';

connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload()); // Add this for file uploads
app.use('/api/auth', authRoutes);

app.use('/api/predictions', predictionRoutes);
app.use('/api/model', modelRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Python model API should be running on port 5001`);
});
