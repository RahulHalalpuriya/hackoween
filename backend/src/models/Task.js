import { createDualModel } from './modelHelper.js';

const taskSchema = {
  farmId: { type: String, required: true },
  farmerId: { type: String, required: true },
  taskType: {
    type: String,
    enum: ['irrigation', 'spray', 'harvest', 'fertilizer', 'scouting', 'weeding'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  scheduledDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'medium', 'low'],
    default: 'medium'
  },
  assignedWorkerId: { type: String },
  assignedWorkerName: { type: String },
  requiresApproval: { type: Boolean, default: false },
  approvedByFarmer: { type: Boolean, default: false },
  reasonForChange: { type: String, default: '' },
  previousScheduledDate: { type: Date },
  replanDiff: {
    before: { type: String },
    after: { type: String },
    reason: { type: String }
  }
};

export const Task = createDualModel('Task', taskSchema, 'tasks');
export default Task;
