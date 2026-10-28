import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getCropTheme } from '../utils/cropThemes';
import { jsPDF } from 'jspdf';
import {
  X,
  Droplets,
  Thermometer,
  Calendar,
  PhoneCall,
  CheckCircle2,
  Clock,
  Download,
  Activity,
  Layers,
  Power
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function FarmDetailModal({ farm, onClose, onToggleMotor }) {
  const { t } = useTranslation();
  const theme = getCropTheme(farm?.cropName);

  const [activeTab, setActiveTab] = useState('sensors'); // 'sensors' | 'timeline' | 'tasks' | 'calls' | 'decisions'
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farm) return;
    async function loadData() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/farms/${farm._id || farm.id}`);
        if (res.data.success) {
          setDetails(res.data);
        }
      } catch (err) {
        console.warn('Error loading farm details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [farm]);

  if (!farm) return null;

  // Format sensor chart data
  const sensorHistory = details?.sensorHistory || [];
  const chartData = sensorHistory.map((s, idx) => ({
    time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    moisture: s.moisture,
    temperature: s.temperature
  }));

  // PDF Season Report Generator
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74);
    doc.text('KisanAI – Autonomous Farm Season Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()} | SDG 2, 12, 13 Verified`, 14, 30);

    doc.setDrawColor(200);
    doc.line(14, 34, 196, 34);

    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text(`Field Name: ${farm.name}`, 14, 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Crop: ${farm.cropName} (${farm.cropVariety}) | Area: ${farm.area} ${farm.areaUnit || 'Acres'}`, 14, 52);
    doc.text(`Soil Type: ${farm.soilType} | Irrigation: ${farm.irrigationType} (${farm.motorDetails?.hp || 7.5} HP Motor)`, 14, 60);
    doc.text(`Current Moisture: ${farm.currentMoisture}% | Health Status: ${farm.currentHealth?.toUpperCase()}`, 14, 68);
    doc.text(`Groundwater Preserved: ${(farm.waterSavedLitres || 65000).toLocaleString()} Litres`, 14, 76);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Recent AI Autonomous Decisions & Actions:', 14, 90);

    const decisions = details?.decisions || [];
    let y = 100;
    decisions.slice(0, 7).forEach((d, i) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(22, 163, 74);
      doc.text(`[${new Date(d.timestamp).toLocaleDateString()}] ${d.actionType?.toUpperCase()}`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      doc.text(`${d.reason}`, 14, y + 5);
      y += 14;
    });

    doc.save(`${farm.name.replace(/\s+/g, '_')}_Season_Report.pdf`);
  };

  const motorOn = farm.motorDetails?.status === 'on';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
              {theme.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{farm.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {farm.cropVariety}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {farm.area} {farm.areaUnit || 'Acres'} • {farm.soilType} Soil • {farm.irrigationType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-colors"
              title="Download Season PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Ribbon: Moisture, Motor Switch, Water Saved */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shrink-0">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Soil Moisture</p>
            <p className="text-lg font-black text-emerald-400 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-emerald-400" />
              {farm.currentMoisture}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Groundwater Saved</p>
            <p className="text-lg font-black text-blue-400">
              {(farm.waterSavedLitres || 65000).toLocaleString()} L
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Motor Pump</p>
            <button
              onClick={() => onToggleMotor(farm._id || farm.id, motorOn ? 'off' : 'on')}
              className={`mt-1 px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                motorOn
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Power className="w-3 h-3" />
              {motorOn ? 'PUMP RUNNING (ON)' : 'PUMP IDLE (OFF)'}
            </button>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Crop Health</p>
            <p className="text-base font-bold text-emerald-400 capitalize flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              {farm.currentHealth || 'Optimal'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-4 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'sensors' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live Sensors
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Growth Timeline
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'tasks' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Calendar Tasks
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'calls' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Worker Calls
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'decisions' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            AI Decision Log
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: SENSOR GRAPHS */}
          {activeTab === 'sensors' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-emerald-400" />
                    Soil Moisture Telemetry (Last 24 Hours)
                  </span>
                  <span className="text-slate-400">Sensor ID: {farm.soilSensorId || 'ESP32-SOIL-01'}</span>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.length > 0 ? chartData : [{ time: 'Now', moisture: farm.currentMoisture, temperature: 28 }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[10, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="moisture" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} name="Moisture %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    Root Zone Soil Temperature (°C)
                  </span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.length > 0 ? chartData : [{ time: 'Now', moisture: 40, temperature: farm.currentTemp || 28 }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[15, 45]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} name="Temp °C" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROP GROWTH TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Sowing Date: {new Date(farm.sowingDate).toLocaleDateString()}</span>
                <span className="font-bold text-emerald-400">Expected Harvest: {new Date(farm.expectedHarvestDate).toLocaleDateString()}</span>
              </div>
              <div className="relative pt-2">
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-700" style={{ width: `${details?.cropProgress?.percent || 45}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <span>Germination (0%)</span>
                  <span>Tillering (30%)</span>
                  <span>Flowering (60%)</span>
                  <span>Harvest Ready (100%)</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs">
                <strong className="text-emerald-300 block mb-1">Current Agronomy Phase: {farm.cropStage}</strong>
                <p className="text-slate-300">
                  Estimated {details?.cropProgress?.daysToHarvest || 75} days remaining to optimal maturity. Water requirements are moderate; foliar spray of micronutrients recommended during this window.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TASKS CALENDAR */}
          {activeTab === 'tasks' && (
            <div className="space-y-2.5">
              {(details?.tasks || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No scheduled tasks yet.</p>
              ) : (
                details.tasks.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white text-sm">{t.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{t.description}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
                        📅 {new Date(t.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'rescheduled' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: CALL LOGS */}
          {activeTab === 'calls' && (
            <div className="space-y-2.5">
              {(details?.calls || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No worker phone calls recorded yet.</p>
              ) : (
                details.calls.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">AI called {c.workerName} ({c.workerRole})</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {c.callStatus?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 italic bg-slate-950/50 p-2 rounded border border-slate-800 my-1 text-[11px]">
                      "{c.messageScript}"
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.timestamp).toLocaleString()} • Duration: {c.durationSec || 35}s
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: AI DECISION LOG */}
          {activeTab === 'decisions' && (
            <div className="space-y-2.5">
              {(details?.decisions || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No decision records found.</p>
              ) : (
                details.decisions.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-400 uppercase text-[11px]">{d.stage}: {d.actionType}</span>
                      <span className="text-[10px] text-slate-400">{new Date(d.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-200">{d.reason}</p>
                    {d.waterSavedLitres > 0 && (
                      <span className="text-[10px] font-bold text-emerald-300 mt-1 inline-block">
                        💧 Water Saved: {d.waterSavedLitres.toLocaleString()} L
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
