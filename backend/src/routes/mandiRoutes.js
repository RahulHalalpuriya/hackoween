import express from 'express';
import { getMandiRates } from '../controllers/mandiController.js';

const router = express.Router();

router.get('/', getMandiRates);

export default router;
