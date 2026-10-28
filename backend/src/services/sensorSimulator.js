import { Farm } from '../models/Farm.js';
import { SensorLog } from '../models/SensorLog.js';
import { emitToFarmer, emitToAll } from './socketService.js';
import { executeAgentCycle } from '../agents/agentLoop.js';

let intervalId = null;

export function startSensorSimulator(intervalSec = 20) {
  if (intervalId) clearInterval(intervalId);

  console.log(`[SensorSimulator] 📡 IoT Simulator started (tick every ${intervalSec}s).`);

  intervalId = setInterval(async () => {
    try {
      const farms = await Farm.find({});
      if (!farms || farms.length === 0) return;

      for (const farm of farms) {
        const farmId = farm._id || farm.id;
        const motorOn = farm.motorDetails?.status === 'on';

        let moisture = farm.currentMoisture ?? 42;
        let temp = farm.currentTemp ?? 28;

        if (motorOn) {
          // Pump running: moisture climbs
          moisture = Math.min(85, moisture + Math.floor(Math.random() * 3) + 2);
        } else {
          // Gentle evaporation / dry out
          const drop = Math.random() > 0.4 ? 1 : 0;
          moisture = Math.max(18, moisture - drop);
        }

        // Slight temperature fluctuation
        const tempVariation = (Math.random() * 0.8 - 0.4);
        temp = Math.round((temp + tempVariation) * 10) / 10;

        // Health assessment based on moisture
        let health = 'green';
        if (moisture < 32 || moisture > 82) health = 'yellow';
        if (moisture < 22) health = 'red';

        // Update farm
        const updatedFarm = await Farm.findByIdAndUpdate(
          farmId,
          {
            currentMoisture: moisture,
            currentTemp: temp,
            currentHealth: health
          },
          { new: true }
        );

        // Record log
        const log = await SensorLog.create({
          farmId,
          sensorId: farm.soilSensorId || 'ESP32-SOIL-01',
          moisture,
          temperature: temp,
          humidity: Math.round(55 + Math.random() * 15),
          timestamp: new Date()
        });

        // Broadcast real-time sensor update
        emitToFarmer(farm.farmerId, 'sensor:updated', {
          farmId,
          moisture,
          temperature: temp,
          health,
          motorStatus: motorOn ? 'on' : 'off',
          timestamp: log.timestamp
        });

        // If moisture dropped into critical red zone and pump is off, trigger instant autonomous intervention
        if (moisture < 25 && !motorOn && farm.farmerId) {
          console.log(`[SensorSimulator] 🚨 Critical soil moisture alert on ${farm.name} (${moisture}%). Triggering agent cycle.`);
          executeAgentCycle({ farmerId: farm.farmerId });
        }
      }
    } catch (err) {
      console.error('[SensorSimulator] Error in simulation tick:', err.message);
    }
  }, intervalSec * 1000);
}

export function stopSensorSimulator() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[SensorSimulator] Stopped.');
  }
}
