import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { X, DollarSign, Award, Droplets, Zap, ShieldCheck, TrendingUp, PieChart } from 'lucide-react';

export default function FinancesModal({ onClose }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinances() {
      try {
        setLoading(true);
        const res = await axios.get('/api/finances');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Error loading finances:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFinances();
  }, []);

  if (!data) return null;

  const { summary, sdgImpact, farmBreakdown } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel border border-teal-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto animate-fade-in text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('navbar.finances')}</h2>
              <p className="text-xs text-slate-400">Profit/Loss ledger and UN Sustainable Development Goals verified impact</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* SDG Impact Badges (The Hackathon Focal Point) */}
          <div>
            <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              SDG Impact Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* SDG 2 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/50 to-slate-900 border border-amber-500/30 text-xs">
                <span className="font-extrabold text-amber-300 block mb-1 text-sm">
                  🌾 SDG 2: Zero Hunger
                </span>
                <p className="text-2xl font-black text-white">{sdgImpact.sdg2_zeroHunger?.yieldBoostPercent}</p>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {sdgImpact.sdg2_zeroHunger?.description}
                </p>
              </div>

              {/* SDG 12 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/30 text-xs">
                <span className="font-extrabold text-emerald-300 block mb-1 text-sm">
                  🧪 SDG 12: Consumption
                </span>
                <p className="text-2xl font-black text-white">{sdgImpact.sdg12_responsibleConsumption?.chemicalSavedKg} kg</p>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {sdgImpact.sdg12_responsibleConsumption?.description}
                </p>
              </div>

              {/* SDG 13 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/50 to-slate-900 border border-blue-500/30 text-xs">
                <span className="font-extrabold text-blue-300 block mb-1 text-sm">
                  💧 SDG 13: Climate Action
                </span>
                <p className="text-xl font-black text-white">
                  {(sdgImpact.sdg13_climateAction?.waterSavedLitres || 0).toLocaleString()} L
                </p>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Saved {sdgImpact.sdg13_climateAction?.electricitySavedKWh} kWh power & avoided {sdgImpact.sdg13_climateAction?.co2AvoidedKg} kg CO2.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Overview Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Combined Financial Balance (All Fields)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Acreage</span>
                <span className="text-base font-extrabold text-white">{summary?.totalAreaAcres} Acres</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Expenses</span>
                <span className="text-base font-extrabold text-rose-300">₹{(summary?.totalExpenses || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Gross Mandi Sale</span>
                <span className="text-base font-extrabold text-emerald-300">₹{(summary?.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Estimated Net Profit</span>
                <span className="text-base font-black text-emerald-400">₹{(summary?.netProfit || 0).toLocaleString()} ({summary?.overallRoiPercent}% ROI)</span>
              </div>
            </div>
          </div>

          {/* Per-Farm Ledger Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Per-Field Cost & Revenue Breakdown
            </h3>
            <div className="space-y-2.5">
              {farmBreakdown.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm">{f.farmName} ({f.area} Acres)</span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Net Profit: ₹{f.netProfit.toLocaleString()} ({f.roiPercent}% ROI)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 bg-slate-950/40 p-2.5 rounded-xl">
                    <p>Seeds: ₹{f.expenses.seeds}</p>
                    <p>Fertilizer: ₹{f.expenses.fertilizer}</p>
                    <p>Power & Water: ₹{f.expenses.powerWater}</p>
                    <p>Labour: ₹{f.expenses.labourMachinery}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
