import bcrypt from 'bcryptjs';
import { connectDB, dbState } from '../database/db.js';
import { Farmer } from '../models/Farmer.js';
import { Farm } from '../models/Farm.js';
import { Worker } from '../models/Worker.js';
import { Task } from '../models/Task.js';
import { SensorLog } from '../models/SensorLog.js';
import { DecisionLog } from '../models/DecisionLog.js';
import { CallLog } from '../models/CallLog.js';

export async function seedDatabase() {
  await connectDB();

  console.log('[Seed] 🌾 Seeding KisanAI database with 3 sample farms and workers...');

  // Clean existing sample data
  await Farmer.deleteMany({ phone: '9876543210' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('kisanai', salt);

  // 1. Create Farmer
  const farmer = await Farmer.create({
    name: 'Sardar Ramesh Singh',
    phone: '9876543210',
    password: hashedPassword,
    village: 'Kisan Nagar, Khanna',
    district: 'Ludhiana',
    state: 'Punjab',
    preferredLanguage: 'hi',
    autoModePreferences: {
      irrigation: 'auto',
      spray: 'auto',
      harvest: 'ask'
    },
    emergencyOverride: false,
    fertilizerStock: [
      { name: 'IFFCO Urea (Neem Coated)', quantityKg: 150, unit: 'kg' },
      { name: 'DAP (Di-Ammonium Phosphate)', quantityKg: 100, unit: 'kg' },
      { name: 'Tilt (Propiconazole 25% EC)', quantityKg: 5, unit: 'litres' },
      { name: 'MOP (Muriate of Potash)', quantityKg: 50, unit: 'kg' }
    ]
  });

  const farmerId = farmer._id || farmer.id;

  // 2. Create Workers Directory
  const workerData = [
    {
      farmerId,
      role: 'sprayer',
      name: 'Suresh Kumar',
      phone: '+91 98123 45678',
      preferredLanguage: 'hi',
      availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ratePerAcre: 350,
      isBackup: false,
      rating: 4.9
    },
    {
      farmerId,
      role: 'sprayer',
      name: 'Harpreet Singh (Backup)',
      phone: '+91 98765 11223',
      preferredLanguage: 'pa',
      availabilityDays: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
      ratePerAcre: 380,
      isBackup: true,
      rating: 4.7
    },
    {
      farmerId,
      role: 'harvester',
      name: 'Gurmeet Singh (Combine Harvester)',
      phone: '+91 98234 56789',
      preferredLanguage: 'pa',
      availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      ratePerAcre: 1800,
      isBackup: false,
      rating: 4.9
    },
    {
      farmerId,
      role: 'tractor',
      name: 'Baldev Yadav',
      phone: '+91 98345 67890',
      preferredLanguage: 'hi',
      availabilityDays: ['Monday', 'Wednesday', 'Friday'],
      ratePerAcre: 900,
      isBackup: false,
      rating: 4.8
    },
    {
      farmerId,
      role: 'pump_operator',
      name: 'Jagdish Prasad',
      phone: '+91 98456 78901',
      preferredLanguage: 'hi',
      availabilityDays: ['All Days'],
      ratePerAcre: 250,
      isBackup: false,
      rating: 4.6
    }
  ];

  const workers = await Worker.insertMany(workerData);

  // 3. Create 3 Sample Farms (Wheat, Rice, Sugarcane)
  const now = new Date();
  const wheatSowing = new Date(now.getTime() - 42 * 86400000); // 42 days ago
  const riceSowing = new Date(now.getTime() - 35 * 86400000);
  const caneSowing = new Date(now.getTime() - 95 * 86400000);

  const farmData = [
    {
      farmerId,
      name: 'North Plot – Wheat HD-2967',
      area: 4.0,
      areaUnit: 'acre',
      location: { lat: 30.7046, lng: 76.7179, address: 'North Block, Khanna, Punjab' },
      cropName: 'wheat',
      cropVariety: 'HD-2967 (High Yield)',
      sowingDate: wheatSowing,
      expectedHarvestDate: new Date(wheatSowing.getTime() + 130 * 86400000),
      soilType: 'loam',
      irrigationType: 'tubewell',
      motorDetails: { hp: 7.5, pumpType: 'Submersible Tubewell', status: 'off' },
      soilSensorId: 'ESP32-WHEAT-01',
      currentMoisture: 38,
      currentTemp: 26.4,
      currentHealth: 'green',
      cropStage: 'Tillering / Crown Root',
      growthProgressPercent: 42,
      waterSavedLitres: 120000,
      chemicalSavedKg: 28
    },
    {
      farmerId,
      name: 'South Plot – Basmati Rice 1121',
      area: 3.5,
      areaUnit: 'acre',
      location: { lat: 30.7012, lng: 76.7198, address: 'Canal Bank, Khanna, Punjab' },
      cropName: 'rice',
      cropVariety: 'Pusa Basmati 1121',
      sowingDate: riceSowing,
      expectedHarvestDate: new Date(riceSowing.getTime() + 125 * 86400000),
      soilType: 'clay',
      irrigationType: 'tubewell',
      motorDetails: { hp: 10.0, pumpType: 'High Flow Tubewell', status: 'off' },
      soilSensorId: 'ESP32-RICE-02',
      currentMoisture: 68,
      currentTemp: 27.1,
      currentHealth: 'green',
      cropStage: 'Active Tillering',
      growthProgressPercent: 36,
      waterSavedLitres: 165000,
      chemicalSavedKg: 32
    },
    {
      farmerId,
      name: 'East Plot – Sugarcane Co-0238',
      area: 5.0,
      areaUnit: 'acre',
      location: { lat: 30.712, lng: 76.728, address: 'Sugar Mill Road, Khanna, Punjab' },
      cropName: 'sugarcane',
      cropVariety: 'Co-0238 (Karan 4)',
      sowingDate: caneSowing,
      expectedHarvestDate: new Date(caneSowing.getTime() + 320 * 86400000),
      soilType: 'loam',
      irrigationType: 'drip',
      motorDetails: { hp: 7.5, pumpType: 'Pressure Drip Motor', status: 'off' },
      soilSensorId: 'ESP32-CANE-03',
      currentMoisture: 52,
      currentTemp: 27.8,
      currentHealth: 'green',
      cropStage: 'Grand Growth Phase',
      growthProgressPercent: 55,
      waterSavedLitres: 240000,
      chemicalSavedKg: 45
    }
  ];

  const farms = await Farm.insertMany(farmData);

  // 4. Initial Sensor Logs for live charts
  for (const f of farms) {
    const fId = f._id || f.id;
    for (let h = 12; h >= 0; h--) {
      await SensorLog.create({
        farmId: fId,
        sensorId: f.soilSensorId,
        moisture: Math.round(f.currentMoisture + (Math.sin(h) * 4)),
        temperature: Math.round((f.currentTemp + (Math.cos(h) * 2)) * 10) / 10,
        soilPh: 6.8,
        humidity: 62,
        timestamp: new Date(now.getTime() - h * 3600000)
      });
    }
  }

  // 5. Initial Tasks
  const wheatId = farms[0]._id || farms[0].id;
  const riceId = farms[1]._id || farms[1].id;
  const caneId = farms[2]._id || farms[2].id;

  await Task.create({
    farmId: wheatId,
    farmerId,
    taskType: 'spray',
    title: 'Neem-Coated Urea 2nd Dose Application',
    description: 'Precision top-dressing during late tillering stage.',
    scheduledDate: new Date(now.getTime() + 86400000), // Tomorrow
    status: 'pending',
    priority: 'high',
    assignedWorkerName: 'Suresh Kumar'
  });

  await Task.create({
    farmId: riceId,
    farmerId,
    taskType: 'irrigation',
    title: 'Sub-surface Standing Water Top-up',
    description: 'Maintain 3-4 cm standing water depth for weed suppression.',
    scheduledDate: new Date(now.getTime() + 172800000),
    status: 'pending',
    priority: 'medium'
  });

  // 6. Initial Decision Logs
  await DecisionLog.create({
    farmId: wheatId,
    farmerId,
    farmName: farms[0].name,
    cycleId: 'init-cycle-01',
    stage: 'REPORT',
    actionType: 'routine_check',
    reason: 'Initial autonomous farm assessment complete. Soil moisture at 38% - monitored.',
    status: 'executed'
  });

  // 7. Initial Call Log
  await CallLog.create({
    farmerId,
    farmId: wheatId,
    farmName: farms[0].name,
    workerId: workers[0]._id || workers[0].id,
    workerName: 'Suresh Kumar',
    workerPhone: '+91 98123 45678',
    workerRole: 'sprayer',
    purpose: 'Urea Spray Confirmation',
    messageScript: 'नमस्ते सुरेश जी, मैं किसानAI बोल रहा हूँ रमेश जी के खेत से। कल सुबह खेत में यूरिया स्प्रे करना निर्धारित है।',
    language: 'hi',
    callStatus: 'confirmed',
    durationSec: 42
  });

  console.log('✅ [Seed] Successfully seeded 3 farms, 5 workers, initial IoT sensor trends, and logs!');
  return { farmer, farms, workers };
}

// Direct script execution support
if (process.argv[1]?.includes('seedData.js')) {
  seedDatabase().then(() => {
    console.log('Seed completed. Exiting.');
    process.exit(0);
  }).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
