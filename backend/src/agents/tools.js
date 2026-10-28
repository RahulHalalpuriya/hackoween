import { Farm } from '../models/Farm.js';
import { Task } from '../models/Task.js';
import { DecisionLog } from '../models/DecisionLog.js';
import { Farmer } from '../models/Farmer.js';
import { placeWorkerCall } from './voiceCaller.js';
import { emitToFarmer } from '../services/socketService.js';

/**
 * Tool 1: start_irrigation
 */
export async function start_irrigation(farmId, durationMinutes = 45, reason = 'Soil moisture dropped below threshold') {
  const farm = await Farm.findById(farmId);
  if (!farm) throw new Error(`Farm ${farmId} not found`);

  const updatedFarm = await Farm.findByIdAndUpdate(
    farmId,
    {
      'motorDetails.status': 'on',
      'motorDetails.lastToggled': new Date(),
      lastIrrigatedAt: new Date()
    },
    { new: true }
  );

  // Auto-schedule an automatic stop irrigation task
  await Task.create({
    farmId,
    farmerId: farm.farmerId,
    taskType: 'irrigation',
    title: `Irrigate ${farm.name} (${durationMinutes} mins)`,
    description: `Automated tubewell pump irrigation cycle initiated by KisanAI. Reason: ${reason}`,
    scheduledDate: new Date(),
    status: 'in_progress',
    priority: 'high'
  });

  emitToFarmer(farm.farmerId, 'farm:updated', updatedFarm);
  emitToFarmer(farm.farmerId, 'tubewell:started', {
    farmId: farm._id || farm.id,
    farmName: farm.name,
    cropName: farm.cropName,
    currentMoisture: farm.currentMoisture,
    motorHp: farm.motorDetails?.hp || 7.5,
    pumpType: farm.motorDetails?.pumpType || 'Submersible Tubewell',
    imageUrl: '/tubewell_irrigation.jpg',
    durationMinutes,
    title: `💧 Autonomous Tubewell Started – ${farm.name}`,
    message: `KisanAI Agent triggered 7.5 HP tubewell motor for ${durationMinutes} mins. Reason: ${reason}. Fresh water discharging across irrigation channels.`,
    timestamp: new Date().toISOString()
  });
  emitToFarmer(farm.farmerId, 'alert:received', {
    id: 'tubewell-' + Date.now(),
    type: 'tubewell_started',
    title: `💧 Autonomous Tubewell Started: ${farm.name}`,
    message: `Irrigation initiated for ${durationMinutes} minutes. Fresh water flowing. Reason: ${reason}`,
    imageUrl: '/tubewell_irrigation.jpg',
    farmId: farm._id || farm.id,
    farmName: farm.name
  });

  return {
    success: true,
    action: 'start_irrigation',
    farmId,
    durationMinutes,
    status: 'Tubewell pump ON'
  };
}

/**
 * Tool 2: stop_irrigation
 */
export async function stop_irrigation(farmId, reason = 'Target soil moisture achieved') {
  const farm = await Farm.findById(farmId);
  if (!farm) throw new Error(`Farm ${farmId} not found`);

  const updatedFarm = await Farm.findByIdAndUpdate(
    farmId,
    {
      'motorDetails.status': 'off',
      'motorDetails.lastToggled': new Date()
    },
    { new: true }
  );

  emitToFarmer(farm.farmerId, 'farm:updated', updatedFarm);
  emitToFarmer(farm.farmerId, 'alert:received', {
    type: 'irrigation_stopped',
    title: `🛑 Tubewell Stopped on ${farm.name}`,
    message: `Motor turned off automatically. Reason: ${reason}`,
    farmId
  });

  return {
    success: true,
    action: 'stop_irrigation',
    farmId,
    status: 'Tubewell pump OFF'
  };
}

/**
 * Tool 3: skip_irrigation
 * Calculates liters of water saved based on farm acreage (approx 60,000 liters per acre irrigation)
 */
export async function skip_irrigation(farmId, reason = 'Rain expected within 24 hours, preserving groundwater') {
  const farm = await Farm.findById(farmId);
  if (!farm) throw new Error(`Farm ${farmId} not found`);

  // 1 acre irrigation typically consumes ~50,000 to 70,000 liters
  const waterSaved = Math.round((farm.area || 2) * 55000);

  const updatedFarm = await Farm.findByIdAndUpdate(
    farmId,
    {
      $inc: { waterSavedLitres: waterSaved }
    },
    { new: true }
  );

  emitToFarmer(farm.farmerId, 'farm:updated', updatedFarm);
  emitToFarmer(farm.farmerId, 'alert:received', {
    type: 'water_saved',
    title: `🌱 Irrigation Skipped – Water Saved!`,
    message: `${farm.name}: Skipped irrigation. ${reason}. Saved ${waterSaved.toLocaleString()} L of groundwater!`,
    farmId,
    waterSaved
  });

  return {
    success: true,
    action: 'skip_irrigation',
    farmId,
    waterSavedLitres: waterSaved,
    reason
  };
}

/**
 * Tool 4: call_worker
 */
export async function call_worker({ farmerId, farmId, workerId, workerRole, purpose, message }) {
  const farm = farmId ? await Farm.findById(farmId) : null;
  const farmer = await Farmer.findById(farmerId);

  const callResult = await placeWorkerCall({
    farmerId,
    farmId,
    farmName: farm ? farm.name : 'Main Field',
    farmerName: farmer ? farmer.name : 'Farmer',
    workerId,
    workerRole: workerRole || 'sprayer',
    purpose: purpose || message || 'Farm operations',
    language: farmer?.preferredLanguage || 'hi'
  });

  return {
    success: callResult.success,
    action: 'call_worker',
    workerName: callResult.worker?.name,
    script: callResult.script,
    status: callResult.callRecord?.callStatus
  };
}

/**
 * Tool 5: schedule_task
 */
export async function schedule_task({ farmId, farmerId, taskType, title, description, scheduledDate, priority = 'medium' }) {
  const farm = await Farm.findById(farmId);
  const task = await Task.create({
    farmId,
    farmerId: farmerId || farm?.farmerId,
    taskType,
    title,
    description,
    scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(Date.now() + 86400000),
    priority,
    status: 'pending'
  });

  emitToFarmer(farmerId || farm?.farmerId, 'task:created', task);

  return {
    success: true,
    action: 'schedule_task',
    task
  };
}

/**
 * Tool 6: send_farmer_alert
 */
export async function send_farmer_alert(farmerId, farmId, message, title = 'KisanAI Smart Alert', severity = 'info') {
  emitToFarmer(farmerId, 'alert:received', {
    type: 'agent_alert',
    title,
    message,
    severity,
    farmId,
    timestamp: new Date()
  });

  return {
    success: true,
    action: 'send_farmer_alert',
    message
  };
}

/**
 * Tool 7: reschedule_tasks
 * Used during dynamic replanning (e.g. sudden rain or disease outbreak)
 */
export async function reschedule_tasks({ farmId, farmerId, reason, delayDays = 2 }) {
  const pendingTasks = await Task.find({
    farmId,
    status: { $in: ['pending', 'in_progress'] }
  });

  const updatedTasks = [];
  for (const t of pendingTasks) {
    const oldDate = new Date(t.scheduledDate);
    const newDate = new Date(oldDate.getTime() + delayDays * 86400000);
    const beforeDesc = `${t.title} on ${oldDate.toLocaleDateString()}`;
    const afterDesc = `Shifted to ${newDate.toLocaleDateString()} due to weather/priority replan`;

    const updated = await Task.findByIdAndUpdate(
      t._id || t.id,
      {
        previousScheduledDate: oldDate,
        scheduledDate: newDate,
        status: 'rescheduled',
        reasonForChange: reason,
        replanDiff: {
          before: beforeDesc,
          after: afterDesc,
          reason
        }
      },
      { new: true }
    );
    updatedTasks.push(updated);
  }

  emitToFarmer(farmerId, 'task:rearranged', {
    farmId,
    reason,
    count: updatedTasks.length,
    updatedTasks
  });

  return {
    success: true,
    action: 'reschedule_tasks',
    count: updatedTasks.length,
    reason
  };
}
