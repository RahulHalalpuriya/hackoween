import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../i18n/i18n';
import {
  Mic,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  FileText,
  DollarSign,
  ScanLine,
  LogOut,
  Sliders,
  Type,
  Globe
} from 'lucide-react';

export default function Navbar({
  onOpenDemo,
  onOpenVoice,
  onOpenMandi,
  onOpenSchemes,
  onOpenFinances,
  onOpenDisease,
  onOpenProfile
}) {
  const { t, i18n } = useTranslation();
  const { farmer, logout, setEmergencyOverride, updatePreferences, elderlyMode, setElderlyMode } = useAuth();

  const isEmergency = Boolean(farmer?.emergencyOverride);
  const autoMode = farmer?.autoModePreferences?.irrigation === 'auto';

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    i18n.changeLanguage(langCode);
    updatePreferences({ preferredLanguage: langCode });
  };

  const handleToggleEmergency = async () => {
    await setEmergencyOverride(!isEmergency);
  };

  const handleToggleAutoMode = async () => {
    const newMode = autoMode ? 'ask' : 'auto';
    await updatePreferences({
      autoModePreferences: {
        irrigation: newMode,
        spray: newMode,
        harvest: 'ask'
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & SDG Tags */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-2xl">
            🌾
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Kisan<span className="text-emerald-400">AI</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Autonomous
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden md:block">
              {t('sdgTagline')}
            </p>
          </div>
        </div>

        {/* Action Hub */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* ⚡ RUN 2-MIN DEMO BUTTON (Judges Favorite) */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all"
            title="Launch 2-Minute Autonomous Reaction Scenario"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('navbar.runDemo')}</span>
          </button>

          {/* 🚨 EMERGENCY OVERRIDE STOP BUTTON */}
          <button
            onClick={handleToggleEmergency}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md ${
              isEmergency
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/40'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>{isEmergency ? t('navbar.resumeAll') : t('navbar.emergencyStop')}</span>
          </button>

          {/* AUTO-MODE / ASK-ME-FIRST TOGGLE */}
          <button
            onClick={handleToggleAutoMode}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              autoMode
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{autoMode ? t('navbar.autoMode') : t('navbar.askMeMode')}</span>
          </button>

          {/* QUICK SHORTCUTS */}
          <div className="flex items-center gap-1">
            {/* Voice AI */}
            <button
              onClick={onOpenVoice}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-950/70 border border-slate-700 hover:border-emerald-500/40 text-emerald-400 transition-colors"
              title={t('navbar.voiceAI')}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Leaf Doctor / Disease */}
            <button
              onClick={onOpenDisease}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-950/70 border border-slate-700 hover:border-emerald-500/40 text-emerald-400 transition-colors"
              title={t('navbar.diseaseScanner')}
            >
              <ScanLine className="w-4 h-4" />
            </button>

            {/* Mandi Rates */}
            <button
              onClick={onOpenMandi}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-amber-950/70 border border-slate-700 hover:border-amber-500/40 text-amber-400 transition-colors"
              title={t('navbar.mandi')}
            >
              <TrendingUp className="w-4 h-4" />
            </button>

            {/* Govt Schemes */}
            <button
              onClick={onOpenSchemes}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-blue-950/70 border border-slate-700 hover:border-blue-500/40 text-blue-400 transition-colors"
              title={t('navbar.schemes')}
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Finances & SDG Impact */}
            <button
              onClick={onOpenFinances}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-teal-950/70 border border-slate-700 hover:border-teal-500/40 text-teal-400 transition-colors"
              title={t('navbar.finances')}
            >
              <DollarSign className="w-4 h-4" />
            </button>

            {/* Elderly Large Font Mode */}
            <button
              onClick={() => setElderlyMode(!elderlyMode)}
              className={`p-2 rounded-lg border transition-colors ${
                elderlyMode
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={t('navbar.elderlyMode')}
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* MULTI-LANGUAGE SELECTOR (Always Visible) */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-lg">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={i18n.language || 'hi'}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.label} ({lang.region})
                </option>
              ))}
            </select>
          </div>

          {/* Farmer Profile / Update Details */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-all"
            title="Edit Farmer Profile & Update Details"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
              👨‍🌾
            </span>
            <span className="hidden md:inline max-w-[120px] truncate">{farmer?.name || 'Farmer'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
            title={t('navbar.logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
