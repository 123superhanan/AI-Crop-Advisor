// models/Prediction.js
import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: String,
  crop: String,
  disease: String,
  confidence: Number,
  severity: String,
  recommendations: {
    disease: String,
    confidence: String,
    severity: String,
    priority: String,
    immediate_action: [String],
    treatment_plan: [String],
    prevention_tips: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Prediction', predictionSchema);
