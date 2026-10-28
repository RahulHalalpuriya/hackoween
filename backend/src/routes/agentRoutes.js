import express from 'express';
import {
  triggerAgentCycle,
  getAgentFeed,
  setEmergencyOverride,
  approvePendingDecision,
  runJudgeDemoScenario,
  callWorkerDirectly,
  getTwilioConfig,
  saveTwilioConfig
} from '../controllers/agentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/trigger', triggerAgentCycle);
router.get('/feed', getAgentFeed);
router.post('/override', setEmergencyOverride);
router.post('/approve', approvePendingDecision);
router.post('/demo-scenario', runJudgeDemoScenario);
router.post('/call-worker', callWorkerDirectly);
router.get('/twilio-config', getTwilioConfig);
router.post('/twilio-config', saveTwilioConfig);

export default router;
