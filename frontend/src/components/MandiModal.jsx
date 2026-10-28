import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { X, TrendingUp, DollarSign, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function MandiModal({ onClose }) {
  const { t } = useTranslation();
  const [rates, setRates] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMandi() {
      try {
        setLoading(true);
        const res = await axios.get('/api/mandi');
        if (res.data.success) {
          setRates(res.data.rates);
          if (res.data.rates.length > 0) {
            setSelectedCrop(res.data.rates[0]);
          }
        }
      } catch (err) {
        console.warn('Error loading mandi rates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMandi();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto animate-fade-in text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('navbar.mandi')} (Live Agmarknet)</h2>
              <p className="text-xs text-slate-400">Commodity prices, 7-day trend, and AI Buy/Hold/Sell signals</p>
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
          {/* Crop Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {rates.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCrop(item)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
                  selectedCrop?.crop === item.crop
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {item.crop}
              </button>
            ))}
          </div>

          {selectedCrop && (
            <div className="space-y-4">
              {/* Rate Card & AI Signal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Current Modal Price</span>
                  <p className="text-2xl font-black text-white mt-1">₹{selectedCrop.modalPrice} <span className="text-xs font-normal text-slate-400">/ quintal</span></p>
                  <span className="text-[11px] text-emerald-400 font-semibold">{selectedCrop.priceChange} this week</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Government MSP</span>
                  <p className="text-2xl font-black text-amber-300 mt-1">₹{selectedCrop.msp} <span className="text-xs font-normal text-slate-400">/ quintal</span></p>
                  <span className="text-[11px] text-slate-400 font-medium">Market is +₹{selectedCrop.modalPrice - selectedCrop.msp} above MSP</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">AI Best Time To Sell</span>
                  <div className="mt-1">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedCrop.aiRecommendation?.action}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{selectedCrop.aiRecommendation?.confidence}% AI confidence</span>
                </div>
              </div>

              {/* AI Trading Reason Advisory */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs">
                <strong className="text-amber-300 block mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  KisanAI Market Advisory:
                </strong>
                <p className="text-slate-200 leading-relaxed">{selectedCrop.aiRecommendation?.reason}</p>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Mandi: {selectedCrop.market}</span>
                  <span>•</span>
                  <span>Daily Arrivals: {selectedCrop.arrivals}</span>
                </div>
              </div>

              {/* 7-Day Price History Chart */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    7-Day Mandi Price Trend (₹ / Quintal)
                  </span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCrop.sevenDayHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="Rate (₹)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
