import mongoose from 'mongoose';

const prediction = new mongoose.Schema({
  userId: String,
  crop: String,
  disease: String,
  confidence: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Prediction', prediction);
