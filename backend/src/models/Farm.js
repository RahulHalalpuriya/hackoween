import { createDualModel } from './modelHelper.js';

const farmSchema = {
  farmerId: { type: String, required: true },
  name: { type: String, required: true },
  area: { type: Number, required: true },
  areaUnit: { type: String, enum: ['acre', 'bigha', 'hectare'], default: 'acre' },
  location: {
    lat: { type: Number, default: 30.7333 }, // Default to Punjab agricultural belt
    lng: { type: Number, default: 76.7794 },
    address: { type: String, default: 'Ludhiana, Punjab' }
  },
  cropName: { type: String, required: true }, // wheat, rice, sugarcane, cotton, mustard, potato, maize
  cropVariety: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  soilType: { type: String, enum: ['sandy', 'loam', 'clay', 'black', 'alluvial'], default: 'loam' },
  irrigationType: { type: String, enum: ['tubewell', 'canal', 'drip', 'sprinkler'], default: 'tubewell' },
  motorDetails: {
    hp: { type: Number, default: 7.5 },
    pumpType: { type: String, default: 'Submersible Tubewell' },
    status: { type: String, enum: ['off', 'on'], default: 'off' },
    lastToggled: { type: Date }
  },
  soilSensorId: { type: String, default: 'ESP32-DEFAULT' },
  currentMoisture: { type: Number, default: 45 }, // percentage
  currentTemp: { type: Number, default: 28 }, // Celsius
  currentHealth: { type: String, enum: ['green', 'yellow', 'red'], default: 'green' },
  cropStage: { type: String, default: 'Vegetative' },
  growthProgressPercent: { type: Number, default: 40 },
  lastIrrigatedAt: { type: Date },
  waterSavedLitres: { type: Number, default: 0 },
  chemicalSavedKg: { type: Number, default: 0 },
  activeAlerts: [{ type: String }]
};

export const Farm = createDualModel('Farm', farmSchema, 'farms');
export default Farm;
