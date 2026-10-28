import { v4 as uuidv4 } from 'uuid';
import { Farmer } from '../models/Farmer.js';
import { Farm } from '../models/Farm.js';
import { Worker } from '../models/Worker.js';
import { DecisionLog } from '../models/DecisionLog.js';
import { fetchFarmWeather, getFallbackWeather } from '../services/weatherService.js';
import { runAgentReasoning } from './llmEngine.js';
import * as tools from './tools.js';
import { emitToFarmer, emitToAll } from '../services/socketService.js';

let isLoopRunning = false;

/**
 * Runs the autonomous OBSERVE -> REASON -> PLAN -> ACT -> REPORT loop
 * for a specific farmer or across all farmers.
 */
export async function executeAgentCycle({ farmerId = null, simulatedTrigger = null, simulatedWeather = null } = {}) {
  if (isLoopRunning) {
    console.log('[AgentLoop] ⏳ Another cycle is currently active. Queuing or skipping...');
  }
  isLoopRunning = true;
  const cycleId = uuidv4();

  try {
    const filter = farmerId ? { _id: farmerId } : {};
    const farmers = await Farmer.find(filter);

    if (farmers.length === 0) {
      console.log('[AgentLoop] No farmers registered yet. Skipping cycle.');
      isLoopRunning = false;
      return { success: false, reason: 'No farmers registered' };
    }

    const results = [];

    for (const farmer of farmers) {
      const currentFarmerId = farmer._id || farmer.id;
      
      // Check emergency override
      if (farmer.emergencyOverride) {
        console.warn(`[AgentLoop] ⚠️ Emergency override active for farmer ${farmer.name}. Skipping actions.`);
        await DecisionLog.create({
          farmId: 'GLOBAL',
          farmerId: currentFarmerId,
          farmName: 'All Farms',
          cycleId,
          stage: 'REPORT',
          actionType: 'routine_check',
          reason: 'Emergency Override Active: All autonomous agent actions paused by farmer.',
          status: 'overridden'
        });
        continue;
      }

      emitToFarmer(currentFarmerId, 'agent:cycle_started', {
        cycleId,
        stage: 'OBSERVE',
        timestamp: new Date()
      });

      // ==========================================
      // 1. OBSERVE STAGE
      // ==========================================
      const farms = await Farm.find({ farmerId: currentFarmerId });
      const workers = await Worker.find({ farmerId: currentFarmerId });

      if (farms.length === 0) continue;

      // Observe weather
      let weatherData;
      if (simulatedWeather) {
        weatherData = simulatedWeather;
      } else {
        const primaryFarm = farms[0];
        const lat = primaryFarm.location?.lat || 30.7333;
        const lng = primaryFarm.location?.lng || 76.7794;
        weatherData = await fetchFarmWeather(lat, lng);
      }

      await DecisionLog.create({
        farmId: farms[0]._id || farms[0].id,
        farmerId: currentFarmerId,
        farmName: farms[0].name,
        cycleId,
        stage: 'OBSERVE',
        actionType: 'routine_check',
        reason: `Observed ${farms.length} fields. Weather: ${weatherData.current?.condition}, Temp: ${weatherData.current?.temp}°C, Max Rain 24h: ${weatherData.forecast?.maxRainProb24h}%.`,
        details: {
          farmsCount: farms.length,
          weather: weatherData.current
        },
        status: 'executed'
      });

      emitToFarmer(currentFarmerId, 'agent:stage_update', { stage: 'REASON', cycleId });

      // ==========================================
      // 2. REASON STAGE
      // ==========================================
      const reasoningResult = await runAgentReasoning({
        farmer,
        farms,
        workers,
        weatherData,
        simulatedTrigger
      });

      await DecisionLog.create({
        farmId: farms[0]._id || farms[0].id,
        farmerId: currentFarmerId,
        farmName: farms[0].name,
        cycleId,
        stage: 'REASON',
        actionType: 'routine_check',
        reason: reasoningResult.explanation,
        details: {
          toolCallsPlanned: reasoningResult.toolCalls.length,
          source: reasoningResult.source
        },
        status: 'executed'
      });

      emitToFarmer(currentFarmerId, 'agent:stage_update', { stage: 'PLAN', cycleId });

      // ==========================================
      // 3. PLAN & ACT STAGE
      // ==========================================
      const executedActions = [];
      const userPreferences = farmer.autoModePreferences || {
        irrigation: 'auto',
        spray: 'auto',
        harvest: 'ask'
      };

      for (const call of reasoningResult.toolCalls) {
        const toolName = call.tool;
        const params = call.params;
        const targetFarmId = params.farm_id;
        const targetFarm = farms.find(f => (f._id || f.id) === targetFarmId) || farms[0];

        // Check Human-in-the-Loop preference
        let actionCategory = 'irrigation';
        if (toolName.includes('spray')) actionCategory = 'spray';
        if (toolName.includes('harvest')) actionCategory = 'harvest';

        const mode = userPreferences[actionCategory] || 'auto';

        if (mode === 'ask' && (toolName === 'call_worker' || toolName === 'start_irrigation')) {
          // Requires manual approval from farmer
          const pendingDecision = await DecisionLog.create({
            farmId: targetFarmId || targetFarm._id || targetFarm.id,
            farmerId: currentFarmerId,
            farmName: targetFarm.name,
            cycleId,
            stage: 'PLAN',
            actionType: toolName,
            reason: params.reason || `Proposed ${toolName} - awaiting your confirmation ("Ask me first" mode active)`,
            details: params,
            status: 'waiting_approval'
          });

          emitToFarmer(currentFarmerId, 'approval:needed', {
            decisionId: pendingDecision._id || pendingDecision.id,
            actionType: toolName,
            farmName: targetFarm.name,
            reason: params.reason
          });
          continue;
        }

        // AUTO EXECUTION OF TOOL
        try {
          let toolResult = null;

          if (toolName === 'start_irrigation') {
            toolResult = await tools.start_irrigation(targetFarmId, params.duration_minutes, params.reason);
          } else if (toolName === 'stop_irrigation') {
            toolResult = await tools.stop_irrigation(targetFarmId, params.reason);
          } else if (toolName === 'skip_irrigation') {
            toolResult = await tools.skip_irrigation(targetFarmId, params.reason);
          } else if (toolName === 'call_worker') {
            toolResult = await tools.call_worker({
              farmerId: currentFarmerId,
              farmId: targetFarmId,
              workerId: params.worker_id,
              workerRole: params.worker_role,
              purpose: params.purpose,
              message: params.message
            });
          } else if (toolName === 'reschedule_tasks') {
            toolResult = await tools.reschedule_tasks({
              farmId: targetFarmId,
              farmerId: currentFarmerId,
              reason: params.reason,
              delayDays: params.delay_days || 2
            });
          } else if (toolName === 'send_farmer_alert') {
            toolResult = await tools.send_farmer_alert(
              currentFarmerId,
              targetFarmId,
              params.message,
              params.title,
              params.severity
            );
          }

          executedActions.push({ toolName, params, toolResult });

          // Log ACT
          await DecisionLog.create({
            farmId: targetFarmId || targetFarm._id || targetFarm.id,
            farmerId: currentFarmerId,
            farmName: targetFarm.name,
            cycleId,
            stage: 'ACT',
            actionType: toolName,
            reason: params.reason || `Executed ${toolName}`,
            details: { params, toolResult },
            status: 'executed',
            waterSavedLitres: toolResult?.waterSavedLitres || 0
          });

        } catch (actErr) {
          console.error(`[AgentLoop] Tool execution failed for ${toolName}:`, actErr);
          await DecisionLog.create({
            farmId: targetFarmId || targetFarm._id || targetFarm.id,
            farmerId: currentFarmerId,
            farmName: targetFarm.name,
            cycleId,
            stage: 'ACT',
            actionType: toolName,
            reason: `Action failed: ${actErr.message}`,
            details: { params, error: actErr.message },
            status: 'failed'
          });
        }
      }

      // ==========================================
      // 4. REPORT STAGE
      // ==========================================
      emitToFarmer(currentFarmerId, 'agent:stage_update', { stage: 'REPORT', cycleId });

      const reportMessage = executedActions.length > 0
        ? `Autonomous cycle completed. Executed ${executedActions.length} actions seamlessly across your fields.`
        : 'All farm operations evaluated. Fields are thriving in optimal equilibrium.';

      const reportLog = await DecisionLog.create({
        farmId: farms[0]._id || farms[0].id,
        farmerId: currentFarmerId,
        farmName: farms[0].name,
        cycleId,
        stage: 'REPORT',
        actionType: 'routine_check',
        reason: reportMessage,
        details: {
          actionsCount: executedActions.length,
          replanCards: reasoningResult.replanCards || []
        },
        status: 'executed'
      });

      emitToFarmer(currentFarmerId, 'agent:cycle_finished', {
        cycleId,
        farmerId: currentFarmerId,
        summary: reportMessage,
        replanCards: reasoningResult.replanCards || [],
        timestamp: new Date()
      });

      results.push({
        farmerId: currentFarmerId,
        cycleId,
        executedCount: executedActions.length,
        summary: reportMessage,
        replanCards: reasoningResult.replanCards || []
      });
    }

    isLoopRunning = false;
    return { success: true, cycleId, results };
  } catch (error) {
    console.error('[AgentLoop] Fatal error during cycle execution:', error);
    isLoopRunning = false;
    return { success: false, error: error.message };
  }
}
