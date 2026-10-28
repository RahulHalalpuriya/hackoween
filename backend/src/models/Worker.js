import { createDualModel } from './modelHelper.js';

const workerSchema = {
  farmerId: { type: String, required: true },
  role: {
    type: String,
    enum: ['sprayer', 'harvester', 'tractor', 'pump_operator', 'labour'],
    required: true
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  preferredLanguage: { type: String, default: 'hi' },
  availabilityDays: [{ type: String }],
  ratePerAcre: { type: Number, default: 350 },
  isBackup: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  activeTasksCount: { type: Number, default: 0 }
};

export const Worker = createDualModel('Worker', workerSchema, 'workers');
export default Worker;
