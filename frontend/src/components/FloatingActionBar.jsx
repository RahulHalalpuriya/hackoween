import React from 'react';
import { useTranslation } from 'react-i18next';
import { soundFX } from '../utils/audioEffects';
import {
  Sparkles,
  Mic,
  ScanLine,
  TrendingUp,
  FileText,
  DollarSign
} from 'lucide-react';

export default function FloatingActionBar({
  onOpenDemo,
  onOpenVoice,
  onOpenDisease,
  onOpenMandi,
  onOpenSchemes,
  onOpenFinances
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-2 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl shadow-emerald-950/70 flex items-center gap-1.5 sm:gap-3 bg-slate-950/85 backdrop-blur-xl">
      {/* 2-Min Demo */}
      <button
        onClick={() => {
          soundFX.playDemoSurge();
          onOpenDemo();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
        title="Launch 2-Minute Autonomous Demo"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">2-Min Demo</span>
      </button>

      {/* Voice Assistant */}
      <button
        onClick={() => {
          soundFX.playAlert();
          onOpenVoice();
        }}
        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
        title="Voice Assistant (Speak)"
      >
        <Mic className="w-4 h-4" />
        <span className="hidden sm:inline">Voice AI</span>
      </button>

      {/* Leaf Doctor */}
      <button
        onClick={() => {
          soundFX.playAlert();
          onOpenDisease();
        }}
        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
        title="AI Leaf Doctor"
      >
        <ScanLine className="w-4 h-4" />
        <span className="hidden sm:inline">Leaf Doctor</span>
      </button>

      {/* Mandi Rates */}
      <button
        onClick={() => {
          soundFX.playAlert();
          onOpenMandi();
        }}
        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-amber-950 text-amber-400 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
        title="Mandi Rates & Sell Signals"
      >
        <TrendingUp className="w-4 h-4" />
        <span className="hidden sm:inline">Mandi Rates</span>
      </button>

      {/* Govt Schemes */}
      <button
        onClick={() => {
          soundFX.playAlert();
          onOpenSchemes();
        }}
        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-blue-950 text-blue-400 hover:text-blue-300 border border-slate-700 hover:border-blue-500/40 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
        title="Govt Farming Subsidies"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Schemes</span>
      </button>

      {/* SDG Impact */}
      <button
        onClick={() => {
          soundFX.playAlert();
          onOpenFinances();
        }}
        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-teal-950 text-teal-400 hover:text-teal-300 border border-slate-700 hover:border-teal-500/40 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
        title="SDG Impact Ledger"
      >
        <DollarSign className="w-4 h-4" />
        <span className="hidden sm:inline">SDG Impact</span>
      </button>
    </div>
  );
}
