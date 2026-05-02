import Prediction from '../models/Prediction.js';

// Create prediction
export const createPrediction = async (req, res) => {
  try {
    const data = await Prediction.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all predictions
export const getPredictions = async (req, res) => {
  try {
    const data = (await Prediction.find()).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
