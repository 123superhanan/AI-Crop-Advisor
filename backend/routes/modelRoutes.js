// routes/modelRoutes.js
import axios from 'axios';
import express from 'express';
import FormData from 'form-data';
import Prediction from '../models/Prediction.js';

const router = express.Router();
const PYTHON_API_URL = 'http://localhost:5001';

// Proxy prediction request to Python backend
router.post('/analyze', async (req, res) => {
  try {
    // Forward the request to Python Flask app
    const formData = new FormData();

    if (req.files && req.files.image) {
      formData.append('image', req.files.image.data, {
        filename: req.files.image.name,
        contentType: req.files.image.mimetype,
      });
    }

    // Add form fields
    if (req.body.cropType) formData.append('cropType', req.body.cropType);
    if (req.body.organicFarming) formData.append('organicFarming', req.body.organicFarming);
    if (req.body.weather) formData.append('weather', req.body.weather);
    if (req.body.temperature) formData.append('temperature', req.body.temperature);

    const response = await axios.post(`${PYTHON_API_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Save prediction to MongoDB
    const prediction = new Prediction({
      userId: req.body.userId || 'anonymous',
      crop: response.data.prediction.crop,
      disease: response.data.prediction.disease,
      confidence: response.data.prediction.confidence,
      recommendations: response.data.recommendations,
      severity: response.data.severity,
    });

    await prediction.save();

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error calling Python model:', error);
    res.status(500).json({
      error: 'Model prediction failed',
      details: error.message,
    });
  }
});

// Get prediction history
router.get('/history/:userId', async (req, res) => {
  try {
    const predictions = await Prediction.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
