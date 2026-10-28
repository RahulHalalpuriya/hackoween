import { createDualModel } from './modelHelper.js';

const farmerSchema = {
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  preferredLanguage: { type: String, default: 'hi' }, // 'hi', 'en', 'pa', 'hr', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ur'
  autoModePreferences: {
    irrigation: { type: String, enum: ['auto', 'ask'], default: 'auto' },
    spray: { type: String, enum: ['auto', 'ask'], default: 'auto' },
    harvest: { type: String, enum: ['auto', 'ask'], default: 'ask' }
  },
  emergencyOverride: { type: Boolean, default: false },
  fertilizerStock: [
    {
      name: String,
      quantityKg: Number,
      unit: String
    }
  ]
};

export const Farmer = createDualModel('Farmer', farmerSchema, 'farmers');
export default Farmer;
