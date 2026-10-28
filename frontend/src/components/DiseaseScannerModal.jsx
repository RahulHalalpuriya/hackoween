import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  X,
  ScanLine,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Leaf
} from 'lucide-react';

const SAMPLES = [
  { key: 'wheat_rust', label: 'Wheat Leaf (Yellow Rust)', crop: 'wheat', icon: '🌾' },
  { key: 'rice_blast', label: 'Rice Leaf (Bacterial Blight)', crop: 'rice', icon: '🌱' },
  { key: 'sugarcane_redrot', label: 'Sugarcane Cane (Red Rot)', crop: 'sugarcane', icon: '🎋' },
  { key: 'mustard_blight', label: 'Mustard Leaf (Alternaria Blight)', crop: 'mustard', icon: '🌼' }
];

export default function DiseaseScannerModal({ onClose, farms = [] }) {
  const { t } = useTranslation();
  const [selectedSample, setSelectedSample] = useState(SAMPLES[0].key);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [targetFarmId, setTargetFarmId] = useState(farms[0]?._id || farms[0]?.id || '');

  const handleScan = async (sampleKey = selectedSample) => {
    try {
      setIsScanning(true);
      setResult(null);

      const res = await axios.post('/api/disease/scan', {
        farmId: targetFarmId,
        sampleKey
      });

      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.warn('Disease scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto animate-fade-in text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('disease.title')}</h2>
              <p className="text-xs text-slate-400">{t('disease.subtitle')}</p>
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
          {/* Target Farm Selector */}
          {farms.length > 0 && (
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Select Affected Farm/Plot:
              </label>
              <select
                value={targetFarmId}
                onChange={(e) => setTargetFarmId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {farms.map(f => (
                  <option key={f._id || f.id} value={f._id || f.id}>
                    {f.name} ({f.cropName} - {f.cropVariety})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preset Sample Leaf Picker */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
              Select Leaf Sample to Diagnose:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLES.map(sample => (
                <button
                  key={sample.key}
                  onClick={() => {
                    setSelectedSample(sample.key);
                    handleScan(sample.key);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                    selectedSample === sample.key
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{sample.icon}</span>
                  <div>
                    <span className="font-bold block text-white">{sample.label}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{sample.crop} Pathology</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleScan(selectedSample)}
            disabled={isScanning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? t('disease.analyzing') : 'Run Vision AI Pathology Diagnosis'}</span>
          </button>

          {/* Scan Results Display */}
          {result && result.diagnosis && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-extrabold text-white">{result.diagnosis.diseaseName}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {result.diagnosis.confidence}% Accuracy
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Identified Symptoms:</span>
                <p className="text-slate-200 mt-0.5">{result.diagnosis.symptoms}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <strong className="text-emerald-400 block mb-0.5">🌿 Organic / Bio Solution:</strong>
                  <p className="text-emerald-100 text-[11px]">{result.diagnosis.organicRemedy}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                  <strong className="text-blue-400 block mb-0.5">💊 Recommended Chemical Treatment:</strong>
                  <p className="text-blue-100 text-[11px]">{result.diagnosis.chemicalTreatment}</p>
                </div>
              </div>

              {/* Automated AI Task Confirmation */}
              <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-400/40 text-[11px] text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI has automatically booked treatment spray on your farm calendar.</span>
                </div>
                <span className="font-bold text-white uppercase text-[10px] bg-emerald-950 px-2 py-0.5 rounded">
                  Scheduled
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
