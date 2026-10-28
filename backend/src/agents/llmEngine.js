import Anthropic from '@anthropic-ai/sdk';

// Crop-specific moisture thresholds and water requirements
export const CROP_AGRONOMY_RULES = {
  wheat: {
    minMoisture: 38,
    optimalMoisture: 55,
    criticalStages: ['Crown Root Initiation', 'Tillering', 'Late Jointing', 'Flowering', 'Milk/Dough'],
    sprayWindLimitKmH: 15,
    idealSprayStage: 'Tillering',
    commonPestAlerts: ['Yellow Rust', 'Aphids', 'Termites']
  },
  rice: {
    minMoisture: 60,
    optimalMoisture: 80,
    criticalStages: ['Transplanting', 'Active Tillering', 'Panicle Initiation', 'Flowering'],
    sprayWindLimitKmH: 18,
    idealSprayStage: 'Active Tillering',
    commonPestAlerts: ['Brown Plant Hopper', 'Stem Borer', 'Blast']
  },
  sugarcane: {
    minMoisture: 45,
    optimalMoisture: 65,
    criticalStages: ['Formative Stage', 'Grand Growth', 'Maturity'],
    sprayWindLimitKmH: 20,
    idealSprayStage: 'Grand Growth',
    commonPestAlerts: ['Early Shoot Borer', 'Red Rot', 'White Grub']
  },
  cotton: {
    minMoisture: 35,
    optimalMoisture: 55,
    criticalStages: ['Square Formation', 'Flowering', 'Boll Development'],
    sprayWindLimitKmH: 14,
    idealSprayStage: 'Square Formation',
    commonPestAlerts: ['Pink Bollworm', 'Whitefly', 'Jassids']
  },
  mustard: {
    minMoisture: 30,
    optimalMoisture: 48,
    criticalStages: ['Rosette', 'Flowering', 'Pod Development'],
    sprayWindLimitKmH: 16,
    idealSprayStage: 'Rosette',
    commonPestAlerts: ['Mustard Aphid', 'Alternaria Blight', 'White Rust']
  },
  potato: {
    minMoisture: 50,
    optimalMoisture: 70,
    criticalStages: ['Tuber Initiation', 'Tuber Bulking'],
    sprayWindLimitKmH: 15,
    idealSprayStage: 'Tuber Bulking',
    commonPestAlerts: ['Late Blight', 'Early Blight', 'Potato Tuber Moth']
  },
  maize: {
    minMoisture: 40,
    optimalMoisture: 60,
    criticalStages: ['Knee High', 'Tasseling', 'Silking'],
    sprayWindLimitKmH: 16,
    idealSprayStage: 'Knee High',
    commonPestAlerts: ['Fall Armyworm', 'Stem Borer']
  }
};

/**
 * Tool definitions for Claude function calling
 */
const CLAUDE_TOOLS = [
  {
    name: 'start_irrigation',
    description: 'Turn on tubewell or drip pump for a farm when moisture is low and no rain is predicted.',
    input_schema: {
      type: 'object',
      properties: {
        farm_id: { type: 'string', description: 'The unique ID of the farm' },
        duration_minutes: { type: 'number', description: 'Irrigation duration in minutes (e.g. 45)' },
        reason: { type: 'string', description: 'Explanation for farmer' }
      },
      required: ['farm_id', 'duration_minutes', 'reason']
    }
  },
  {
    name: 'stop_irrigation',
    description: 'Turn off irrigation pump when moisture target reached.',
    input_schema: {
      type: 'object',
      properties: {
        farm_id: { type: 'string' },
        reason: { type: 'string' }
      },
      required: ['farm_id', 'reason']
    }
  },
  {
    name: 'skip_irrigation',
    description: 'Skip planned irrigation because rain is forecast (>60% in 24h) or soil is already saturated, logging water saved.',
    input_schema: {
      type: 'object',
      properties: {
        farm_id: { type: 'string' },
        reason: { type: 'string', description: 'Why irrigation was skipped (e.g. 80% rain expected in 6 hours)' }
      },
      required: ['farm_id', 'reason']
    }
  },
  {
    name: 'call_worker',
    description: 'AI places an autonomous voice call or SMS in worker language to schedule spray, harvest, or tractor plowing.',
    input_schema: {
      type: 'object',
      properties: {
        worker_id: { type: 'string' },
        worker_role: { type: 'string', enum: ['sprayer', 'harvester', 'tractor', 'pump_operator'] },
        purpose: { type: 'string' },
        message: { type: 'string' }
      },
      required: ['worker_role', 'purpose']
    }
  },
  {
    name: 'reschedule_tasks',
    description: 'Dynamically rearrange tasks across farms due to incoming rain, strong wind, or disease outbreak.',
    input_schema: {
      type: 'object',
      properties: {
        farm_id: { type: 'string' },
        reason: { type: 'string' },
        delay_days: { type: 'number' }
      },
      required: ['farm_id', 'reason']
    }
  },
  {
    name: 'send_farmer_alert',
    description: 'Send important advisory or notification to farmer dashboard and SMS.',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        severity: { type: 'string', enum: ['info', 'warning', 'urgent'] }
      },
      required: ['message']
    }
  }
];

/**
 * Executes reasoning cycle for all farms of a farmer
 */
export async function runAgentReasoning({
  farmer,
  farms,
  workers,
  weatherData,
  diseaseAlert = null,
  simulatedTrigger = null
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey.startsWith('sk-ant-')) {
    try {
      return await callClaudeAgent({
        apiKey,
        farmer,
        farms,
        workers,
        weatherData,
        diseaseAlert,
        simulatedTrigger
      });
    } catch (err) {
      console.warn(`[LLMEngine] Anthropic Claude API call error: ${err.message}. Falling back to Rule-Based Agronomy Engine.`);
    }
  }

  // Built-in Autonomous Agronomy Engine (Deterministic & Heuristic Agent)
  return runAgronomyRuleEngine({
    farmer,
    farms,
    workers,
    weatherData,
    diseaseAlert,
    simulatedTrigger
  });
}

/**
 * Claude 3.5 Sonnet Tool Calling execution
 */
async function callClaudeAgent({ apiKey, farmer, farms, workers, weatherData, diseaseAlert, simulatedTrigger }) {
  const anthropic = new Anthropic({ apiKey });

  const prompt = `You are KisanAI, an autonomous farm operations artificial intelligence designed for Indian farmers.
Current Farmer: ${farmer.name}, Language: ${farmer.preferredLanguage || 'hi'}.
Available Farms:
${JSON.stringify(farms.map(f => ({
  id: f._id || f.id,
  name: f.name,
  crop: f.cropName,
  variety: f.cropVariety,
  currentMoisture: f.currentMoisture,
  currentTemp: f.currentTemp,
  motorStatus: f.motorDetails?.status,
  cropStage: f.cropStage
})), null, 2)}

Available Workers:
${JSON.stringify(workers.map(w => ({
  id: w._id || w.id,
  name: w.name,
  role: w.role,
  phone: w.phone,
  ratePerAcre: w.ratePerAcre,
  isBackup: w.isBackup
})), null, 2)}

Weather (Next 24-72h):
${JSON.stringify(weatherData, null, 2)}

Special Trigger / Event: ${simulatedTrigger || 'Regular 30-minute autonomous cycle'}
Crop Disease Alert: ${JSON.stringify(diseaseAlert)}

RULES:
1. If soil moisture < crop threshold and rain probability < 50%, call start_irrigation.
2. If rain probability > 60% in 24h, call skip_irrigation to save water and money.
3. If rain expected in 12h or wind > 18 km/h, do NOT spray; call reschedule_tasks.
4. If harvest window is near and weather is sunny, call call_worker for harvester.
5. If one worker is needed on multiple farms, prioritize by urgency.

Decide what tool calls to make and formulate a concise reasoning explanation in simple words.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    tools: CLAUDE_TOOLS,
    messages: [{ role: 'user', content: prompt }]
  });

  const toolCalls = [];
  let explanation = '';

  for (const block of response.content) {
    if (block.type === 'text') {
      explanation += block.text;
    } else if (block.type === 'tool_use') {
      toolCalls.push({
        tool: block.name,
        params: block.input
      });
    }
  }

  return {
    source: 'claude-3-5-sonnet',
    explanation: explanation || 'AI assessed all fields and aligned operations with forecasted weather.',
    toolCalls
  };
}

/**
 * Built-in Rule-Based Agronomy Engine
 */
function runAgronomyRuleEngine({ farmer, farms, workers, weatherData, diseaseAlert, simulatedTrigger }) {
  const toolCalls = [];
  const replanCards = [];
  const reasons = [];

  const rainProb24h = weatherData?.forecast?.maxRainProb24h || 0;
  const rainProb12h = weatherData?.forecast?.maxRainProb12h || 0;
  const maxWindSpeed = weatherData?.forecast?.maxWindSpeed24h || 10;
  const isSuddenRainStorm = simulatedTrigger === 'sudden_rain_storm' || rainProb24h >= 65;

  for (const farm of farms) {
    const cropKey = (farm.cropName || 'wheat').toLowerCase();
    const rules = CROP_AGRONOMY_RULES[cropKey] || CROP_AGRONOMY_RULES.wheat;
    const farmId = farm._id || farm.id;
    const currentMoisture = farm.currentMoisture ?? 40;
    const motorIsOn = farm.motorDetails?.status === 'on';

    // 1. IRRIGATION LOGIC
    if (isSuddenRainStorm) {
      if (motorIsOn) {
        toolCalls.push({
          tool: 'stop_irrigation',
          params: {
            farm_id: farmId,
            reason: `Cancelled irrigation immediately: Heavy rainfall forecasted (${rainProb24h}% chance).`
          }
        });
      }
      toolCalls.push({
        tool: 'skip_irrigation',
        params: {
          farm_id: farmId,
          reason: `Rain probability is ${rainProb24h}%. Natural rainfall will hydrate the soil, saving valuable groundwater.`
        }
      });
      replanCards.push({
        farmId,
        farmName: farm.name,
        before: 'Scheduled Tubewell Irrigation (45 min)',
        after: 'Skipped – Relying on Natural Rainfall',
        reason: `Rainfall probability jumped to ${rainProb24h}%. Water and electricity saved!`
      });
      reasons.push(`${farm.name}: Irrigation skipped due to incoming rain (${rainProb24h}%).`);
    } else if (currentMoisture < rules.minMoisture && rainProb24h < 40) {
      // Need irrigation
      if (!motorIsOn) {
        toolCalls.push({
          tool: 'start_irrigation',
          params: {
            farm_id: farmId,
            duration_minutes: 40,
            reason: `Soil moisture (${currentMoisture}%) is below optimal threshold (${rules.minMoisture}%) for ${farm.cropName} (${farm.cropStage}). Weather is dry.`
          }
        });
        reasons.push(`${farm.name}: Moisture is ${currentMoisture}% (< ${rules.minMoisture}%). Started tubewell for 40 minutes.`);
      }
    } else if (currentMoisture >= rules.optimalMoisture && motorIsOn) {
      // Stop motor
      toolCalls.push({
        tool: 'stop_irrigation',
        params: {
          farm_id: farmId,
          reason: `Optimal moisture level (${currentMoisture}%) reached.`
        }
      });
      reasons.push(`${farm.name}: Optimal moisture achieved. Tubewell turned off.`);
    }

    // 2. FERTILIZER / SPRAY LOGIC & REPLANNING
    if (isSuddenRainStorm || rainProb12h > 50 || maxWindSpeed > rules.sprayWindLimitKmH) {
      // Rain or high wind: postpone spraying!
      toolCalls.push({
        tool: 'reschedule_tasks',
        params: {
          farm_id: farmId,
          reason: isSuddenRainStorm
            ? 'Incoming rain washes off pesticide/fertilizer. Rescheduled to clear weather.'
            : `High wind speed (${maxWindSpeed} km/h) causes spray drift. Rescheduled for safety.`,
          delay_days: 2
        }
      });

      // Call worker to notify delay
      const sprayerWorker = workers.find(w => w.role === 'sprayer' && !w.isBackup) || workers.find(w => w.role === 'sprayer');
      if (sprayerWorker) {
        toolCalls.push({
          tool: 'call_worker',
          params: {
            worker_id: sprayerWorker._id || sprayerWorker.id,
            worker_role: 'sprayer',
            purpose: `Postponing spray on ${farm.name} due to weather`,
            message: `Hello ${sprayerWorker.name}, weather forecast shows rain. Tomorrow's spray on ${farm.name} is moved to Thursday.`
          }
        });
      }

      replanCards.push({
        farmId,
        farmName: farm.name,
        before: 'Spray Urea / Pesticide Tomorrow 6:00 AM',
        after: 'Rescheduled + Sprayer Notified via Voice Call',
        reason: 'Adverse weather (rain/high wind) would waste expensive chemicals.'
      });
      reasons.push(`${farm.name}: Spray rescheduled by 2 days; contacted sprayer worker.`);
    }

    // 3. HARVEST LOGIC
    if (farm.growthProgressPercent >= 90 || farm.cropStage?.toLowerCase().includes('harvest')) {
      const harvesterWorker = workers.find(w => w.role === 'harvester');
      if (harvesterWorker) {
        toolCalls.push({
          tool: 'call_worker',
          params: {
            worker_id: harvesterWorker._id || harvesterWorker.id,
            worker_role: 'harvester',
            purpose: `Booking combine harvester for ${farm.name}`,
            message: `Crop maturity reached on ${farm.name}. Please reserve combine harvester.`
          }
        });
        reasons.push(`${farm.name}: Harvest window open. Booking combine harvester with ${harvesterWorker.name}.`);
      }
    }
  }

  // 4. DISEASE ALERT AD HOC ACTION
  if (diseaseAlert) {
    toolCalls.push({
      tool: 'send_farmer_alert',
      params: {
        message: `Disease detected on ${diseaseAlert.farmName || 'Field'}: ${diseaseAlert.diseaseName}. Treatment scheduled.`,
        severity: 'warning'
      }
    });
    reasons.push(`Disease treatment activated for ${diseaseAlert.diseaseName}.`);
  }

  if (toolCalls.length === 0) {
    reasons.push('All soil, crop, and weather parameters are within optimal targets. No intervention required.');
  }

  return {
    source: 'agronomy-expert-rule-engine',
    explanation: reasons.join(' | '),
    toolCalls,
    replanCards
  };
}
