import { createDualModel } from './modelHelper.js';

const callLogSchema = {
  farmerId: { type: String, required: true },
  farmId: { type: String },
  farmName: { type: String, default: '' },
  workerId: { type: String, required: true },
  workerName: { type: String, required: true },
  workerPhone: { type: String, required: true },
  workerRole: { type: String, required: true },
  purpose: { type: String, required: true },
  messageScript: { type: String, required: true },
  language: { type: String, default: 'hi' },
  callStatus: {
    type: String,
    enum: ['completed', 'confirmed', 'no_answer', 'declined', 'rescheduled', 'calling'],
    default: 'completed'
  },
  audioSimulatedUrl: { type: String, default: '' },
  isMock: { type: Boolean, default: true },
  durationSec: { type: Number, default: 42 },
  timestamp: { type: Date, default: Date.now }
};

export const CallLog = createDualModel('CallLog', callLogSchema, 'callLogs');
export default CallLog;
