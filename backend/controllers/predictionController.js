// controllers/predictionController.js (Update)
import axios from 'axios';
import Prediction from '../models/Prediction.js';

const NESTJS_API_URL = process.env.NESTJS_API_URL || 'http://localhost:3001';

// Create prediction - Save to MongoDB AND Forward to NestJS
export const createPrediction = async (req, res) => {
  try {
    // Save to MongoDB
    const data = await Prediction.create(req.body);

    // Forward to NestJS for analytics
    try {
      await axios.post(`${NESTJS_API_URL}/api/analytics/predictions`, {
        userId: req.body.userId,
        crop: req.body.crop,
        disease: req.body.disease,
        confidence: req.body.confidence,
        severity: req.body.severity,
        mongodbId: data._id.toString(),
      });
      console.log('✅ Data forwarded to NestJS analytics');
    } catch (forwardError) {
      console.error('Failed to forward to NestJS:', forwardError.message);
      // Don't fail the main request if analytics fails
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all predictions (from MongoDB only)
export const getPredictions = async (req, res) => {
  try {
    const data = await Prediction.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics from NestJS (new endpoint)
export const getAnalytics = async (req, res) => {
  try {
    const response = await axios.get(`${NESTJS_API_URL}/api/analytics/summary`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
