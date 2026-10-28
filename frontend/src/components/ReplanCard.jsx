import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, AlertTriangle, Sparkles, RefreshCcw } from 'lucide-react';

export default function ReplanCard({ cards = [] }) {
  const { t } = useTranslation();

  if (!cards || cards.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-900 shadow-2xl mb-6 relative overflow-hidden">
      {/* Alert Ribbon */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <RefreshCcw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-300 text-sm sm:text-base flex items-center gap-2">
              <span>{t('agentFeed.planChanged')}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                Synchronized Multi-Farm Replan
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Agent reassessed priorities across all fields and optimized work orders.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Before vs After cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between text-xs space-y-2.5 hover:border-amber-500/30 transition-all"
          >
            <div>
              <span className="font-extrabold text-white text-xs block mb-1.5 text-emerald-400">
                {card.farmName || `Field #${idx + 1}`}
              </span>

              {/* Before */}
              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300 text-[11px] mb-2">
                <span className="font-bold block text-rose-400 uppercase text-[9px] tracking-wider mb-0.5">
                  Previous Plan (Before):
                </span>
                <span className="line-through opacity-80">{card.before}</span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center -my-1">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 rotate-90 md:rotate-0" />
              </div>

              {/* After */}
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-[11px]">
                <span className="font-bold block text-emerald-400 uppercase text-[9px] tracking-wider mb-0.5">
                  AI Revised Plan (After):
                </span>
                <span>{card.after}</span>
              </div>
            </div>

            {/* Why plan changed */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
              <strong className="text-amber-400 block mb-0.5">{t('agentFeed.reason')}</strong>
              <p className="italic">{card.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
