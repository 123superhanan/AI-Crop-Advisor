// routes/authRoutes.js
import express from 'express';
import { getCurrentUser, login, signup } from '../controllers/authController.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (need token)
router.get('/me', protectRoute, getCurrentUser);

export default router;
