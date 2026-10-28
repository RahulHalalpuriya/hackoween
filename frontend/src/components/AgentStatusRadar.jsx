import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { soundFX } from '../utils/audioEffects';
import {
  Sparkles,
  Radio,
  ShieldCheck,
  Droplets,
  Zap,
  Award,
  RefreshCw,
  Cpu
} from 'lucide-react';
import axios from 'axios';

export default function AgentStatusRadar({ farmsCount = 3, onScanComplete }) {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);

  const handleManualScan = async () => {
    soundFX.playAlert();
    setIsScanning(true);
    try {
      await axios.post('/api/agent/trigger');
      if (onScanComplete) onScanComplete();
    } catch (e) {
      console.warn(e);
    } finally {
      setTimeout(() => setIsScanning(false), 2200);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-emerald-950/40 to-slate-900/90">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Holographic Agent Core */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Spinning Radar Rings */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 relative z-10">
              <Cpu className={`w-7 h-7 ${isScanning ? 'animate-spin' : 'animate-pulse'}`} />
            </div>
            <div className="absolute -inset-1.5 rounded-2xl bg-emerald-400/30 blur-sm animate-ping" style={{ animationDuration: '3s' }} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Autonomous Farm Engine</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE 24/7
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-semibold">Self-Operating Farm:</span>
              <span>Monitors weather, runs pumps & calls workers without farmer effort.</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Autonomous Scan Trigger */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={handleManualScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Analyzing All Sensors...' : 'Force AI Field Scan'}</span>
          </button>
        </div>
      </div>

      {/* Verified SDG Impact Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60">
        {/* Water Saved */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-blue-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
            <Droplets className="w-5 h-5 animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Groundwater Saved</span>
            <span className="text-base sm:text-lg font-black text-white">812,500 L</span>
            <span className="text-[10px] text-blue-300 font-semibold block">SDG 13 Climate</span>
          </div>
        </div>

        {/* Chemicals Avoided */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-emerald-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chemicals Avoided</span>
            <span className="text-base sm:text-lg font-black text-white">150 kg</span>
            <span className="text-[10px] text-emerald-300 font-semibold block">SDG 12 Consumption</span>
          </div>
        </div>

        {/* Clean Energy */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-amber-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Electricity Saved</span>
            <span className="text-base sm:text-lg font-black text-white">666 kWh</span>
            <span className="text-[10px] text-amber-300 font-semibold block">-446 kg CO2</span>
          </div>
        </div>

        {/* Projected Yield */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-teal-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yield Optimization</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">+18.5%</span>
            <span className="text-[10px] text-teal-300 font-semibold block">SDG 2 Zero Hunger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
