import { createDualModel } from './modelHelper.js';

const sensorLogSchema = {
  farmId: { type: String, required: true },
  sensorId: { type: String, default: 'ESP32-SOIL-01' },
  moisture: { type: Number, required: true }, // %
  temperature: { type: Number, required: true }, // °C
  soilPh: { type: Number, default: 6.8 },
  humidity: { type: Number, default: 65 }, // %
  timestamp: { type: Date, default: Date.now }
};

export const SensorLog = createDualModel('SensorLog', sensorLogSchema, 'sensorLogs');
export default SensorLog;
