import React, { useEffect } from 'react';
import { soundFX } from '../utils/audioEffects';
import {
  X,
  Zap,
  Droplets,
  Activity,
  CheckCircle2,
  Power,
  Gauge,
  Sparkles,
  Waves
} from 'lucide-react';

export default function TubewellAlertModal({ event, onClose, onStopMotor }) {
  useEffect(() => {
    if (event) {
      soundFX.playDemoSurge();
    }
  }, [event]);

  if (!event) return null;

  const farmName = event.farmName || 'Field Plot';
  const motorHp = event.motorHp || 7.5;
  const currentMoisture = event.currentMoisture || 35;
  const imageUrl = event.imageUrl || '/tubewell_irrigation.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel border-2 border-emerald-500/50 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/80 my-auto text-white">
        {/* Top Image Banner with Photo-Realistic Tubewell Picture */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt="Tubewell in Action"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-slate-950/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Status Ribbon */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500/90 text-slate-950 px-3 py-1.5 rounded-full font-black text-xs shadow-xl backdrop-blur-md animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            <span>TUBEWELL ACTIVE • {motorHp} HP MOTOR</span>
          </div>

          {/* Image Caption overlay at bottom */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
            <span className="font-semibold flex items-center gap-1.5 drop-shadow-md">
              <Waves className="w-4 h-4 text-cyan-400 animate-bounce" />
              High-Flow Ground Water Discharge Channel
            </span>
            <span className="text-[11px] text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 backdrop-blur-md">
              ⚡ Live Irrigation Alert
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Droplets className="w-6 h-6 text-cyan-400" />
                <span>Tubewell Pump Started!</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                KisanAI autonomous operations or manual override initiated irrigation on <strong className="text-emerald-400">{farmName}</strong>.
              </p>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">MOTOR PUMP</span>
              <span className="text-base sm:text-lg font-black text-emerald-400 block">{motorHp} HP</span>
              <span className="text-[10px] text-slate-400">Submersible</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">SOIL MOISTURE</span>
              <span className="text-base sm:text-lg font-black text-cyan-400 block">{currentMoisture}% ➔ 65%</span>
              <span className="text-[10px] text-slate-400">Target Range</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">WATER FLOW</span>
              <span className="text-base sm:text-lg font-black text-amber-400 block">1,200 L/m</span>
              <span className="text-[10px] text-slate-400">Fresh Discharge</span>
            </div>
          </div>

          {/* Autonomous Status Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Autonomous Sensor Tracking Active</strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                KisanAI IoT soil telemetry will continuously monitor root-zone saturation and automatically shut down the tubewell motor once ideal moisture is achieved.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            {onStopMotor && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playAlert();
                  onStopMotor(event.farmId);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition-colors"
              >
                <Power className="w-4 h-4" />
                <span>Turn Off Tubewell</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Keep Running (Monitor)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
