import express from 'express';
import { createPrediction, getPredictions } from '../controllers/predictionController.js';

const router = express.Router();

router.post('/', createPrediction);
router.get('/', getPredictions);

export default router;
