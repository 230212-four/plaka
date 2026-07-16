// server/src/routes/authRoutes.js
import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public endpoints (NO 'protect' middleware here!)
router.post('/register', register);
router.post('/login', login);

// Private endpoint (Requires a valid Bearer token)
router.get('/me', protect, getMe);

export default router;