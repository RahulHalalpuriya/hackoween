import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { soundFX } from '../utils/audioEffects';
import {
  Eye,
  Brain,
  Calendar,
  Zap,
  CheckCircle,
  PhoneCall,
  RefreshCw,
  Clock,
  Sparkles,
  Volume2,
  Bot,
  ShieldCheck
} from 'lucide-react';

export default function AgentFeed({ feed = [], onPlayCallAudio }) {
  const { t } = useTranslation();
  const [evaluating, setEvaluating] = useState(false);

  const handleTriggerCycle = async () => {
    soundFX.playAlert();
    try {
      setEvaluating(true);
      await axios.post('/api/agent/trigger');
    } catch (err) {
      console.warn('Manual cycle trigger error:', err.message);
    } finally {
      setTimeout(() => setEvaluating(false), 2000);
    }
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'OBSERVE':
        return {
          icon: <Eye className="w-3.5 h-3.5 text-blue-400" />,
          label: 'OBSERVE',
          color: 'bg-blue-950/80 border-blue-500/40 text-blue-300'
        };
      case 'REASON':
        return {
          icon: <Brain className="w-3.5 h-3.5 text-purple-400" />,
          label: 'REASON',
          color: 'bg-purple-950/80 border-purple-500/40 text-purple-300'
        };
      case 'PLAN':
        return {
          icon: <Calendar className="w-3.5 h-3.5 text-amber-400" />,
          label: 'PLAN',
          color: 'bg-amber-950/80 border-amber-500/40 text-amber-300'
        };
      case 'ACT':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'ACT (TOOL)',
          color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
        };
      default:
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-teal-400" />,
          label: 'REPORT',
          color: 'bg-teal-950/80 border-teal-500/40 text-teal-300'
        };
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-2xl flex flex-col h-full max-h-[640px] relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-white text-base">
                {t('agentFeed.title')}
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold">
              Live Autonomous Stream (Verified AI)
            </p>
          </div>
        </div>

        {/* Trigger Now Button */}
        <button
          onClick={handleTriggerCycle}
          disabled={evaluating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{evaluating ? 'Evaluating...' : t('agentFeed.triggerNow')}</span>
        </button>
      </div>

      {/* Typing Indicator if actively evaluating */}
      {evaluating && (
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 mb-3 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>KisanAI is reasoning through Doppler weather & soil telemetry...</span>
        </div>
      )}

      {/* Real AI Worker Calls Action Bar */}
      <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-3 flex items-center justify-between gap-2 shrink-0">
        <span className="text-[11px] font-extrabold text-slate-300 flex items-center gap-1.5 shrink-0">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          Real AI Call:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => onPlayCallAudio && onPlayCallAudio({
              workerRole: 'sprayer',
              workerName: 'Suresh Kumar (Sprayer)',
              workerPhone: '+91 98123 45678',
              language: 'hi'
            })}
            className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 shrink-0 transition-all active:scale-95 flex items-center gap-1"
          >
            <span>🌿 Spray Worker</span>
          </button>
          <button
            type="button"
            onClick={() => onPlayCallAudio && onPlayCallAudio({
              workerRole: 'harvester',
              workerName: 'Gurmeet Singh (Combine Harvester)',
              workerPhone: '+91 98234 56789',
              language: 'pa'
            })}
            className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 shrink-0 transition-all active:scale-95 flex items-center gap-1"
          >
            <span>🌾 Harvester</span>
          </button>
        </div>
      </div>

      {/* Feed Messages (WhatsApp-style Chat Timeline) */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1.5">
        {feed.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs text-center">
            <Brain className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
            <p>KisanAI is continuously observing your fields.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Decisions and phone calls will appear here in real-time.</p>
          </div>
        ) : (
          feed.map((item, idx) => {
            if (item.type === 'call') {
              // Worker Phone Call Bubble
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl text-xs hover:border-emerald-400/60 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                      <PhoneCall className="w-3 h-3 text-emerald-400" />
                      Autonomous Voice Call Placed
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-white font-extrabold text-sm mb-1.5">
                    AI Called {item.workerName} ({item.workerRole})
                  </p>
                  <p className="text-slate-300 text-xs italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    "{item.script || item.text}"
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Status: Confirmed by worker
                    </span>
                    {onPlayCallAudio && (
                      <button
                        onClick={() => {
                          soundFX.playAlert();
                          onPlayCallAudio(item);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] transition-all shadow-md active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Listen to AI Call
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            // Autonomous Decision Bubble
            const badge = getStageBadge(item.stage);
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/85 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${badge.color}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                    {item.farmName && (
                      <span className="text-[10px] font-extrabold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {item.farmName}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-slate-200 text-xs font-medium leading-relaxed">
                  {item.text}
                </p>

                {item.waterSavedLitres > 0 && (
                  <div className="text-[11px] font-black text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg inline-block border border-emerald-500/30">
                    💧 +{item.waterSavedLitres.toLocaleString()} L Groundwater Preserved
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
