import { createDualModel } from './modelHelper.js';

const decisionLogSchema = {
  farmId: { type: String, required: true },
  farmerId: { type: String, required: true },
  farmName: { type: String, default: 'Farm' },
  cycleId: { type: String, required: true },
  stage: {
    type: String,
    enum: ['OBSERVE', 'REASON', 'PLAN', 'ACT', 'REPORT'],
    required: true
  },
  actionType: {
    type: String,
    enum: [
      'start_irrigation',
      'stop_irrigation',
      'skip_irrigation',
      'call_worker',
      'schedule_task',
      'reschedule_tasks',
      'send_farmer_alert',
      'disease_treatment',
      'routine_check'
    ],
    required: true
  },
  reason: { type: String, required: true },
  explanation: { type: String, default: '' },
  details: { type: Object, default: {} },
  status: {
    type: String,
    enum: ['executed', 'waiting_approval', 'overridden', 'skipped', 'failed'],
    default: 'executed'
  },
  waterSavedLitres: { type: Number, default: 0 },
  chemicalSavedKg: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
};

export const DecisionLog = createDualModel('DecisionLog', decisionLogSchema, 'decisionLogs');
export default DecisionLog;
