import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import predictionRoutes from './routes/predictionRoutes.js';

connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/predictions', predictionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
