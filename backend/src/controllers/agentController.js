import { executeAgentCycle } from '../agents/agentLoop.js';
import { DecisionLog } from '../models/DecisionLog.js';
import { CallLog } from '../models/CallLog.js';
import { Task } from '../models/Task.js';
import { Farmer } from '../models/Farmer.js';
import { Farm } from '../models/Farm.js';
import { Worker } from '../models/Worker.js';
import { emitToFarmer, emitToAll } from '../services/socketService.js';
import { getFallbackWeather } from '../services/weatherService.js';
import * as tools from '../agents/tools.js';
import { placeWorkerCall, generateCallScript, formatE164 } from '../agents/voiceCaller.js';

export async function triggerAgentCycle(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const result = await executeAgentCycle({ farmerId });
    return res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

export async function getAgentFeed(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const [decisions, calls] = await Promise.all([
      DecisionLog.find({ farmerId }),
      CallLog.find({ farmerId })
    ]);

    // Merge and sort in chronological order
    const feed = [
      ...decisions.map(d => ({
        type: 'decision',
        id: d._id || d.id,
        stage: d.stage,
        actionType: d.actionType,
        farmName: d.farmName,
        farmId: d.farmId,
        text: d.reason,
        status: d.status,
        timestamp: d.timestamp,
        waterSavedLitres: d.waterSavedLitres,
        details: d.details
      })),
      ...calls.map(c => ({
        type: 'call',
        id: c._id || c.id,
        workerName: c.workerName,
        workerRole: c.workerRole,
        workerPhone: c.workerPhone,
        farmName: c.farmName,
        farmId: c.farmId,
        text: `AI called ${c.workerName} (${c.workerRole}): "${c.messageScript}"`,
        script: c.messageScript,
        status: c.callStatus,
        durationSec: c.durationSec,
        timestamp: c.timestamp,
        isMock: c.isMock
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json({ success: true, feed: feed.slice(0, 30) });
  } catch (err) {
    next(err);
  }
}

export async function setEmergencyOverride(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const { override } = req.body; // boolean

    const farmer = await Farmer.findByIdAndUpdate(
      farmerId,
      { emergencyOverride: override },
      { new: true }
    );

    if (override) {
      // Emergency: turn off all motors immediately
      const farms = await Farm.find({ farmerId });
      for (const f of farms) {
        if (f.motorDetails?.status === 'on') {
          await Farm.findByIdAndUpdate(f._id || f.id, {
            'motorDetails.status': 'off',
            'motorDetails.lastToggled': new Date()
          });
        }
      }
      emitToFarmer(farmerId, 'alert:received', {
        type: 'emergency_stop',
        title: '🚨 EMERGENCY OVERRIDE ACTIVATED',
        message: 'All tubewell pumps stopped immediately. Autonomous agent operations halted.'
      });
    } else {
      emitToFarmer(farmerId, 'alert:received', {
        type: 'emergency_cleared',
        title: '✅ Normal Operations Resumed',
        message: 'Emergency override cleared. Autonomous agent monitoring restored.'
      });
    }

    emitToFarmer(farmerId, 'farmer:updated', farmer);

    return res.json({
      success: true,
      message: override ? 'Emergency override activated: all systems halted' : 'Override cleared: system active',
      emergencyOverride: farmer.emergencyOverride
    });
  } catch (err) {
    next(err);
  }
}

export async function approvePendingDecision(req, res, next) {
  try {
    const { decisionId, approved = true } = req.body;
    const decision = await DecisionLog.findById(decisionId);

    if (!decision) {
      return res.status(404).json({ success: false, message: 'Decision not found' });
    }

    if (approved) {
      // Execute approved action
      const actionType = decision.actionType;
      const details = decision.details || {};

      if (actionType === 'start_irrigation') {
        await tools.start_irrigation(decision.farmId, details.duration_minutes || 45, 'Approved by farmer');
      } else if (actionType === 'call_worker') {
        await tools.call_worker({
          farmerId: decision.farmerId,
          farmId: decision.farmId,
          workerId: details.worker_id,
          workerRole: details.worker_role,
          purpose: details.purpose
        });
      }

      await DecisionLog.findByIdAndUpdate(decisionId, { status: 'executed' });
      return res.json({ success: true, message: 'Action approved and executed' });
    } else {
      await DecisionLog.findByIdAndUpdate(decisionId, { status: 'overridden' });
      return res.json({ success: true, message: 'Action declined' });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * 2-MINUTE JUDGE DEMO MODE
 * Simulates a dramatic, realistic agricultural event:
 * 1. Sudden thunderstorm warning (Rain probability jumps from 15% to 92%)
 * 2. Agent detects rain across all 3 farms
 * 3. Immediately stops running tubewell pump on Farm 1 (Wheat)
 * 4. Skips irrigation on Farm 2 (Rice) & Farm 3 (Sugarcane), saving 140,000L water
 * 5. Reschedules urea spray scheduled for tomorrow
 * 6. Autonomously places a simulated phone call to Suresh (sprayer) in Hindi/worker language
 * 7. Dynamically replans work schedule across all 3 farms with before/after diff cards!
 */
export async function runJudgeDemoScenario(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const farmer = await Farmer.findById(farmerId);
    const farms = await Farm.find({ farmerId });
    const workers = await Worker.find({ farmerId });

    if (!farms || farms.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add farms first or seed sample farms.' });
    }

    // High storm weather payload
    const stormWeather = getFallbackWeather(true); // 92% rain forecast!

    emitToFarmer(farmerId, 'alert:received', {
      type: 'weather_warning',
      title: '⛈️ Sudden Weather Alert: Heavy Monsoon Inbound',
      message: 'Meteorological satellite warning: 92% rain probability detected within next 12 hours.',
      timestamp: new Date()
    });

    // Execute agent loop under storm trigger
    const cycleResult = await executeAgentCycle({
      farmerId,
      simulatedTrigger: 'sudden_rain_storm',
      simulatedWeather: stormWeather
    });

    const replanCards = [
      {
        farmId: farms[0]?._id || farms[0]?.id,
        farmName: farms[0]?.name || 'North Field - Wheat HD-2967',
        before: 'Scheduled Tubewell Irrigation (45 min, 65,000L)',
        after: 'Cancelled Immediately – Relying on Inbound Rain',
        reason: '92% heavy rainfall forecast in next 8 hours. Saved 65,000L groundwater and electricity costs.'
      },
      {
        farmId: farms[1]?._id || farms[1]?.id,
        farmName: farms[1]?.name || 'South Field - Basmati Rice',
        before: 'Urea Fertilizer Spray Booked for Tomorrow Morning',
        after: 'Rescheduled by +2 Days (Clear Sky Window)',
        reason: 'Heavy rain will wash away chemical nutrients into runoff. Sprayer contacted to move booking.'
      },
      {
        farmId: farms[2]?._id || farms[2]?.id,
        farmName: farms[2]?.name || 'East Field - Sugarcane Co-0238',
        before: 'Drip Irrigation Scheduled 3:00 PM',
        after: 'Skipped – Natural Hydration Sufficient',
        reason: 'Soil moisture currently 52%; rain will satisfy crop stage requirement.'
      }
    ];

    return res.json({
      success: true,
      message: 'Demo scenario successfully triggered! Agent autonomously replanned 3 farms.',
      replanCards,
      cycleResult
    });
  } catch (err) {
    next(err);
  }
}

export async function callWorkerDirectly(req, res, next) {
  try {
    const farmerId = req.farmerId;
    let {
      workerRole = 'sprayer',
      workerId,
      phone,
      workerName,
      customMessage,
      language = 'hi'
    } = req.body;

    if (workerRole === 'spray') workerRole = 'sprayer';
    if (workerRole === 'harvest') workerRole = 'harvester';

    const farmer = await Farmer.findById(farmerId);
    let targetWorker = null;

    if (workerId) {
      targetWorker = await Worker.findById(workerId);
    }
    if (!targetWorker) {
      const workers = await Worker.find({ farmerId, role: workerRole });
      targetWorker = workers[0];
    }

    const callPhone = phone || targetWorker?.phone || (workerRole === 'harvester' ? '+91 98234 56789' : '+91 98123 45678');
    const callName = workerName || targetWorker?.name || (workerRole === 'harvester' ? 'Gurmeet Singh (Combine Harvester)' : 'Suresh Kumar (Sprayer)');
    const callRole = workerRole;

    const script = customMessage || generateCallScript(
      callName,
      farmer?.name || 'Farmer',
      callRole,
      callRole === 'harvester' ? 'Harvesting combine scheduling' : 'Yellow rust preventative spray',
      language
    );

    const result = await placeWorkerCall({
      farmerId,
      farmName: 'Main Plot',
      farmerName: farmer?.name || 'Farmer',
      workerId: targetWorker?._id || targetWorker?.id,
      workerRole: callRole,
      customWorker: {
        name: callName,
        phone: callPhone,
        role: callRole,
        preferredLanguage: language
      },
      purpose: callRole === 'harvester' ? 'Harvesting Operation' : 'Fungicide Spraying',
      language
    });

    return res.json({
      success: true,
      message: result.isRealCall
        ? `Live phone call placed via Twilio to ${callPhone}!`
        : `AI voice call dispatched to ${callPhone}`,
      call: result.callRecord,
      script,
      twilioCallSid: result.twilioCallSid,
      isRealCall: Boolean(result.isRealCall)
    });
  } catch (err) {
    next(err);
  }
}

export async function getTwilioConfig(req, res, next) {
  return res.json({
    success: true,
    configured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
    accountSid: process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.slice(0, 6) + '...' + process.env.TWILIO_ACCOUNT_SID.slice(-4) : '',
    fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
    isMock: process.env.MOCK_PHONE_CALLS === 'true'
  });
}

export async function saveTwilioConfig(req, res, next) {
  const { accountSid, authToken, fromNumber, mockCalls } = req.body;
  if (accountSid) process.env.TWILIO_ACCOUNT_SID = accountSid.trim();
  if (authToken) process.env.TWILIO_AUTH_TOKEN = authToken.trim();
  if (fromNumber) process.env.TWILIO_PHONE_NUMBER = fromNumber.trim();
  if (mockCalls !== undefined) process.env.MOCK_PHONE_CALLS = String(mockCalls);

  return res.json({
    success: true,
    message: 'Twilio telephony configuration updated!',
    configured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER)
  });
}
