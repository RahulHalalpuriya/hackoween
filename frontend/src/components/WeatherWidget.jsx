import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function WeatherWidget({ weather }) {
  const { t } = useTranslation();

  if (!weather || !weather.current) {
    return (
      <div className="glass-panel rounded-2xl p-4 animate-pulse text-center text-slate-400">
        Fetching live farm meteorological data...
      </div>
    );
  }

  const { current, forecast } = weather;
  const isRainImminent = (forecast?.maxRainProb24h || 0) >= 60;
  const isWindy = (current.windSpeedKmH || 0) > 18;
  const isSafeToSpray = !isWindy && (forecast?.maxRainProb12h || 0) < 45;

  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'thunderstorm':
        return <CloudLightning className="w-9 h-9 text-amber-400 animate-bounce" />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain className="w-9 h-9 text-blue-400" />;
      case 'cloud':
      case 'clouds':
        return <Cloud className="w-9 h-9 text-slate-300" />;
      default:
        return <Sun className="w-9 h-9 text-amber-300 animate-spin" style={{ animationDuration: '30s' }} />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Current Climate */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
            {getWeatherIcon(current.icon)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {current.temp}°C
              </span>
              <span className="text-sm font-semibold text-emerald-400">
                {current.condition}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                {t('weather.humidity')}: <strong className="text-white">{current.humidity}%</strong>
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                {t('weather.wind')}: <strong className="text-white">{current.windSpeedKmH} km/h</strong>
              </span>
              <span className="flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                {t('weather.rainProb24h')}: <strong className={`${isRainImminent ? 'text-amber-400 font-bold' : 'text-white'}`}>{forecast?.maxRainProb24h || 0}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* AI Agronomy Spray & Irrigation Decision Advisory */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            isSafeToSpray
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
          }`}>
            {isSafeToSpray ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>
              {isSafeToSpray
                ? t('weather.safeToSpray')
                : t('weather.unsafeToSpray')}
            </span>
          </div>

          {isRainImminent && (
            <div className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-950/70 border border-blue-500/50 text-blue-200 flex items-center gap-1.5 animate-pulse">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span>Natural rain expected: Ground water pumping suspended</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-Day Forecast Cards */}
      {forecast?.daily && forecast.daily.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-700/50">
          {forecast.daily.slice(0, 4).map((day, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-2.5 flex items-center justify-between text-xs transition-all hover:bg-slate-800/80"
            >
              <div>
                <p className="font-semibold text-slate-300">
                  {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-[85px]">
                  {day.condition}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-sm">{day.maxTemp}°</span>
                <span className="text-slate-400 text-[11px] ml-1">/ {day.minTemp}°</span>
                <p className="text-[10px] text-blue-300 font-medium">🌧 {day.rainProb}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
