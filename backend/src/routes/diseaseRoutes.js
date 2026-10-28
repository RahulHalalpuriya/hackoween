import express from 'express';
import { scanCropDisease } from '../controllers/diseaseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/scan', scanCropDisease);

export default router;
