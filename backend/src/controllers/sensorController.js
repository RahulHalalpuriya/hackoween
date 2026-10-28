import { Farm } from '../models/Farm.js';
import { SensorLog } from '../models/SensorLog.js';
import { emitToFarmer, emitToAll } from '../services/socketService.js';
import { executeAgentCycle } from '../agents/agentLoop.js';

export async function receiveSensorData(req, res, next) {
  try {
    const { fieldId } = req.params;
    const { moisture, temperature, soilPh = 6.8, humidity = 60, sensorId } = req.body;

    if (moisture === undefined || temperature === undefined) {
      return res.status(400).json({ success: false, message: 'Moisture and temperature are required' });
    }

    const farm = await Farm.findById(fieldId);
    if (!farm) {
      return res.status(404).json({ success: false, message: `Field ${fieldId} not found` });
    }

    const numMoisture = Number(moisture);
    const numTemp = Number(temperature);

    let health = 'green';
    if (numMoisture < 32 || numMoisture > 80) health = 'yellow';
    if (numMoisture < 20) health = 'red';

    // Update farm
    const updated = await Farm.findByIdAndUpdate(
      fieldId,
      {
        currentMoisture: numMoisture,
        currentTemp: numTemp,
        currentHealth: health,
        ...(sensorId ? { soilSensorId: sensorId } : {})
      },
      { new: true }
    );

    // Save log
    const log = await SensorLog.create({
      farmId: fieldId,
      sensorId: sensorId || farm.soilSensorId || 'ESP32-SOIL-01',
      moisture: numMoisture,
      temperature: numTemp,
      soilPh: Number(soilPh),
      humidity: Number(humidity),
      timestamp: new Date()
    });

    emitToFarmer(farm.farmerId, 'sensor:updated', {
      farmId: fieldId,
      moisture: numMoisture,
      temperature: numTemp,
      health,
      timestamp: log.timestamp
    });

    // Auto trigger agent if critical
    if (numMoisture < 25 && farm.motorDetails?.status === 'off') {
      executeAgentCycle({ farmerId: farm.farmerId });
    }

    return res.status(201).json({
      success: true,
      message: 'Sensor reading ingested successfully',
      data: log
    });
  } catch (err) {
    next(err);
  }
}

export async function getSensorLogs(req, res, next) {
  try {
    const { fieldId } = req.params;
    const logs = await SensorLog.find({ farmId: fieldId });
    return res.json({ success: true, logs: logs.slice(-50) });
  } catch (err) {
    next(err);
  }
}
