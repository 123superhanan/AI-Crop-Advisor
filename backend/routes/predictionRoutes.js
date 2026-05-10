// routes/predictionRoutes.js
import express from 'express';
import {
  createPrediction,
  getAnalytics,
  getPredictions,
} from '../controllers/predictionController.js';

const router = express.Router();

router.post('/', createPrediction);
router.get('/', getPredictions);
router.get('/analytics', getAnalytics);

export default router;
