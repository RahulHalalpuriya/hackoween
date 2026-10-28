import express from 'express';
import { getFinancesAndSDGImpact } from '../controllers/financesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getFinancesAndSDGImpact);

export default router;
