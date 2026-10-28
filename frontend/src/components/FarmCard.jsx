import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { getCropTheme } from '../utils/cropThemes';
import { soundFX } from '../utils/audioEffects';
import {
  Droplets,
  Power,
  Activity,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Sparkles,
  Waves
} from 'lucide-react';

export default function FarmCard({ farm, isSelected, onSelect, onOpenDetail, onToggleMotor }) {
  const { t } = useTranslation();
  const { triggerTubewellAlert } = useSocket();
  const theme = getCropTheme(farm.cropName);

  const moisture = farm.currentMoisture ?? 42;
  const motorOn = farm.motorDetails?.status === 'on';
  const health = farm.currentHealth || 'green';

  // SVG circular moisture gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, moisture)) / 100) * circumference;

  let gaugeColor = '#22c55e'; // Green
  let gaugeText = 'Optimal Moisture';
  let gaugeGlow = 'rgba(34, 197, 94, 0.4)';

  if (moisture < 32) {
    gaugeColor = '#ef4444'; // Red
    gaugeText = 'Low (Dry Soil)';
    gaugeGlow = 'rgba(239, 68, 68, 0.5)';
  } else if (moisture < 42 || moisture > 80) {
    gaugeColor = '#f59e0b'; // Yellow
    gaugeText = moisture > 80 ? 'Water Saturated' : 'Approaching Dry';
    gaugeGlow = 'rgba(245, 158, 11, 0.4)';
  }

  const handlePumpClick = (e) => {
    e.stopPropagation();
    soundFX.playPumpToggle(!motorOn);
    const nextStatus = motorOn ? 'off' : 'on';
    onToggleMotor(farm._id || farm.id, nextStatus);
    if (nextStatus === 'on' && triggerTubewellAlert) {
      triggerTubewellAlert({
        farmId: farm._id || farm.id,
        farmName: farm.name,
        cropName: farm.cropName,
        currentMoisture: farm.currentMoisture,
        motorHp: farm.motorDetails?.hp || 7.5,
        imageUrl: '/tubewell_irrigation.jpg'
      });
    }
  };

  const getHealthBadge = () => {
    if (health === 'red') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50 flex items-center gap-1.5 shadow-lg shadow-rose-950/50 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Attention Needed
        </span>
      );
    }
    if (health === 'yellow') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 shadow-lg shadow-amber-950/50">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Moderate Stress
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-lg shadow-emerald-950/50">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        Optimal Health
      </span>
    );
  };

  return (
    <div
      onClick={onSelect}
      className={`glass-panel rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.015] hover:shadow-2xl ${
        isSelected
          ? 'border-2 border-emerald-400/90 shadow-2xl shadow-emerald-950/70 ring-4 ring-emerald-500/10'
          : 'border border-slate-700/60 hover:border-emerald-500/50'
      }`}
    >
      {/* Background ambient lighting per crop */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: theme.primaryColor }}
      />

      {/* Top Banner: Crop & Health */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="text-3xl p-3 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
            {theme.icon}
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
              <span>{farm.name}</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span className="font-bold text-emerald-400">{farm.cropVariety || farm.cropName}</span>
              <span>•</span>
              <span className="font-semibold">{farm.area} {farm.areaUnit || 'Acres'}</span>
              <span>•</span>
              <span className="capitalize">{farm.soilType} Soil</span>
            </div>
            {farm.location?.address && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[200px]">{farm.location.address}</span>
              </p>
            )}
          </div>
        </div>
        {getHealthBadge()}
      </div>

      {/* Central Metrics: Moisture Circular Gauge & Motor Pump State */}
      <div className="relative z-10 grid grid-cols-2 gap-4 my-4 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
        {/* Circular Gauge */}
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${gaugeGlow})` }}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-white">{moisture}%</span>
              <Droplets className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t('farmCard.soilMoisture')}
            </p>
            <p className="text-xs font-black" style={{ color: gaugeColor }}>
              {gaugeText}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Target: <strong className="text-white">{theme.optimalMoistureRange}</strong>
            </p>
          </div>
        </div>

        {/* Growth Stage Progress & Animated Tubewell Pump */}
        <div className="flex flex-col justify-between border-l border-slate-800 pl-4">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider">{t('farmCard.stage')}</span>
              <span className="font-extrabold text-emerald-400">{farm.growthProgressPercent || 45}%</span>
            </div>
            <p className="text-xs font-black text-white truncate">
              {farm.cropStage || 'Vegetative Growth'}
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${farm.growthProgressPercent || 45}%` }}
              />
            </div>
          </div>

          {/* Tubewell Pump Interactive Toggle with Water Flow animation */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`w-2.5 h-2.5 rounded-full ${motorOn ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              <span className={`font-bold ${motorOn ? 'text-emerald-300' : 'text-slate-400'}`}>
                {motorOn ? 'Pump Pumping 💧' : 'Pump Idle'}
              </span>
            </div>
            <button
              onClick={handlePumpClick}
              className={`px-2.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                motorOn
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
              title="Manual Tubewell Pump Switch"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{motorOn ? 'TURN OFF' : 'START'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Next AI Autonomous Action Card */}
      <div className="relative z-10 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs mb-3">
        <div className="flex items-center justify-between text-emerald-400 font-extrabold mb-1">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('farmCard.nextAction')}</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Autonomous
          </span>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed">
          {moisture < 35
            ? 'Moisture dropped below crop limit. Automated tubewell cycle ready to start if no rain.'
            : 'Soil moisture is optimal for current tillering stage; conserving water resources.'}
        </p>
      </div>

      {/* Bottom Footer: Water Saved + Open Detail Button */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-800">
        <span className="text-xs text-blue-300 font-bold flex items-center gap-1">
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          {(farm.waterSavedLitres || 65000).toLocaleString()} L {t('farmCard.waterSaved')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playAlert();
            onOpenDetail(farm);
          }}
          className="flex items-center gap-1 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-1 duration-200"
        >
          <span>{t('farmCard.viewDetails')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
