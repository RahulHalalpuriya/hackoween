import { Farm } from '../models/Farm.js';
import { Worker } from '../models/Worker.js';
import { Task } from '../models/Task.js';
import { SensorLog } from '../models/SensorLog.js';
import { DecisionLog } from '../models/DecisionLog.js';
import { CallLog } from '../models/CallLog.js';
import { fetchFarmWeather } from '../services/weatherService.js';
import { emitToFarmer } from '../services/socketService.js';

export async function getAllFarms(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const farms = await Farm.find({ farmerId });
    return res.json({ success: true, farms });
  } catch (err) {
    next(err);
  }
}

export async function createFarm(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const {
      name,
      area,
      areaUnit = 'acre',
      location,
      cropName,
      cropVariety,
      sowingDate,
      expectedHarvestDate,
      soilType,
      irrigationType,
      motorHp,
      pumpType,
      soilSensorId
    } = req.body;

    const sowing = sowingDate ? new Date(sowingDate) : new Date();
    const harvest = expectedHarvestDate ? new Date(expectedHarvestDate) : new Date(sowing.getTime() + 120 * 86400000);

    const farm = await Farm.create({
      farmerId,
      name: name || `${cropName || 'Crop'} Field`,
      area: Number(area) || 2,
      areaUnit,
      location: location || { lat: 30.7333, lng: 76.7794, address: 'Ludhiana, Punjab' },
      cropName: (cropName || 'wheat').toLowerCase(),
      cropVariety: cropVariety || 'Default Variety',
      sowingDate: sowing,
      expectedHarvestDate: harvest,
      soilType: soilType || 'loam',
      irrigationType: irrigationType || 'tubewell',
      motorDetails: {
        hp: Number(motorHp) || 7.5,
        pumpType: pumpType || 'Submersible Tubewell',
        status: 'off'
      },
      soilSensorId: soilSensorId || `ESP32-${Math.floor(1000 + Math.random() * 9000)}`,
      currentMoisture: cropName === 'rice' ? 70 : 45,
      currentTemp: 28,
      currentHealth: 'green',
      cropStage: 'Vegetative'
    });

    emitToFarmer(farmerId, 'farm:created', farm);

    return res.status(201).json({ success: true, farm });
  } catch (err) {
    next(err);
  }
}

export async function getFarmDetails(req, res, next) {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const [tasks, recentSensors, decisions, calls, weather] = await Promise.all([
      Task.find({ farmId: id }),
      SensorLog.find({ farmId: id }),
      DecisionLog.find({ farmId: id }),
      CallLog.find({ farmId: id }),
      fetchFarmWeather(farm.location?.lat, farm.location?.lng)
    ]);

    // Calculate crop timeline progress
    const now = new Date().getTime();
    const start = new Date(farm.sowingDate).getTime();
    const end = new Date(farm.expectedHarvestDate).getTime();
    const totalDuration = Math.max(1, end - start);
    const elapsed = Math.max(0, now - start);
    const progressPercent = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    return res.json({
      success: true,
      farm,
      weather,
      cropProgress: {
        percent: progressPercent,
        sowingDate: farm.sowingDate,
        expectedHarvestDate: farm.expectedHarvestDate,
        daysToHarvest: Math.max(0, Math.round((end - now) / 86400000)),
        currentStage: farm.cropStage
      },
      tasks: tasks.slice(-10).reverse(),
      sensorHistory: recentSensors.slice(-20),
      decisions: decisions.slice(-15).reverse(),
      calls: calls.slice(-10).reverse()
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleMotor(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'on' | 'off'

    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const newStatus = status || (farm.motorDetails?.status === 'on' ? 'off' : 'on');
    const updated = await Farm.findByIdAndUpdate(
      id,
      {
        'motorDetails.status': newStatus,
        'motorDetails.lastToggled': new Date(),
        ...(newStatus === 'on' ? { lastIrrigatedAt: new Date() } : {})
      },
      { new: true }
    );

    emitToFarmer(farm.farmerId, 'farm:updated', updated);

    if (newStatus === 'on') {
      emitToFarmer(farm.farmerId, 'tubewell:started', {
        farmId: farm._id || farm.id,
        farmName: farm.name,
        cropName: farm.cropName,
        currentMoisture: farm.currentMoisture,
        motorHp: farm.motorDetails?.hp || 7.5,
        pumpType: farm.motorDetails?.pumpType || 'Submersible Tubewell',
        imageUrl: '/tubewell_irrigation.jpg',
        title: `💧 Tubewell Motor Started – ${farm.name}`,
        message: `High-flow tubewell pump activated (7.5 HP). Irrigating ${farm.name}. Fresh ground water discharging across concrete channels.`,
        timestamp: new Date().toISOString()
      });

      emitToFarmer(farm.farmerId, 'alert:received', {
        id: 'tubewell-' + Date.now(),
        type: 'tubewell_started',
        title: `💧 Tubewell Motor Started: ${farm.name}`,
        message: `7.5 HP pump activated. Fresh ground water discharging into channels. Target: 65% moisture.`,
        imageUrl: '/tubewell_irrigation.jpg',
        farmId: farm._id || farm.id,
        farmName: farm.name
      });
    }

    return res.json({
      success: true,
      message: `Motor ${newStatus.toUpperCase()}`,
      farm: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function getSensorHistory(req, res, next) {
  try {
    const { id } = req.params;
    const logs = await SensorLog.find({ farmId: id });
    return res.json({
      success: true,
      logs: logs.slice(-30)
    });
  } catch (err) {
    next(err);
  }
}

export async function getWorkers(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const workers = await Worker.find({ farmerId });
    return res.json({ success: true, workers });
  } catch (err) {
    next(err);
  }
}

export async function addWorker(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const { role, name, phone, preferredLanguage, availabilityDays, ratePerAcre, isBackup } = req.body;

    const worker = await Worker.create({
      farmerId,
      role: role || 'sprayer',
      name,
      phone,
      preferredLanguage: preferredLanguage || 'hi',
      availabilityDays: availabilityDays || ['Monday', 'Wednesday', 'Friday'],
      ratePerAcre: Number(ratePerAcre) || 350,
      isBackup: Boolean(isBackup)
    });

    return res.status(201).json({ success: true, worker });
  } catch (err) {
    next(err);
  }
}

export async function updateFarmDetails(req, res, next) {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const update = { ...req.body };
    delete update._id;
    delete update.id;
    delete update.farmerId;

    const updated = await Farm.findByIdAndUpdate(id, update, { new: true });
    emitToFarmer(farm.farmerId, 'farm:updated', updated);

    return res.json({
      success: true,
      message: 'Farm details updated successfully!',
      farm: updated
    });
  } catch (err) {
    next(err);
  }
}
