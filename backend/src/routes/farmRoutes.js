import express from 'express';
import {
  getAllFarms,
  createFarm,
  getFarmDetails,
  updateFarmDetails,
  toggleMotor,
  getSensorHistory,
  getWorkers,
  addWorker
} from '../controllers/farmController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllFarms);
router.post('/', createFarm);
router.get('/workers', getWorkers);
router.post('/workers', addWorker);
router.get('/:id', getFarmDetails);
router.put('/:id', updateFarmDetails);
router.post('/:id/motor', toggleMotor);
router.get('/:id/sensors', getSensorHistory);

export default router;
