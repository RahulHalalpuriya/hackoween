import express from 'express';
import {
  registerFarmer,
  loginFarmer,
  getCurrentFarmer,
  updatePreferences,
  updateProfile,
  sendOtp,
  verifyOtp
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerFarmer);
router.post('/login', loginFarmer);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', authenticateToken, getCurrentFarmer);
router.put('/preferences', authenticateToken, updatePreferences);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile', authenticateToken, updateProfile);
router.put('/update-details', authenticateToken, updateProfile);
router.post('/update-details', authenticateToken, updateProfile);

export default router;
