import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useFarms } from '../context/FarmContext';
import { soundFX } from '../utils/audioEffects';
import { X, User, CheckCircle2, MapPin, Globe, Save, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export default function ProfileModal({ onClose }) {
  const { t, i18n } = useTranslation();
  const { farmer, updateProfile, refreshFarmer } = useAuth();
  const { fetchFarms } = useFarms();

  const [formData, setFormData] = useState({
    name: farmer?.name || '',
    phone: farmer?.phone || '',
    village: farmer?.village || '',
    district: farmer?.district || '',
    state: farmer?.state || '',
    preferredLanguage: farmer?.preferredLanguage || i18n.language || 'hi',
    autoModePreferences: {
      irrigation: farmer?.autoModePreferences?.irrigation || 'auto',
      spray: farmer?.autoModePreferences?.spray || 'auto',
      harvest: farmer?.autoModePreferences?.harvest || 'ask'
    }
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    soundFX.playAlert();
    try {
      setSaving(true);
      setSuccessMsg('');
      setErrMsg('');

      const res = await updateProfile(formData);
      if (res.success) {
        soundFX.playDemoSurge();
        setSuccessMsg('Farmer details updated successfully! ✅');
        if (formData.preferredLanguage) {
          i18n.changeLanguage(formData.preferredLanguage);
        }
        await refreshFarmer();
        await fetchFarms();
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrMsg(err.message || 'Failed to update details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto animate-fade-in text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Farmer Profile & Details</h2>
              <p className="text-xs text-slate-400">Update personal, village, and AI autonomy settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs mb-4 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {errMsg && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs mb-4">
            {errMsg}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Farmer Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Mobile Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Village / Town</label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-300 block mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Preferred Language for Voice Calls & UI</label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English (Global)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="hr">हरियाणवी (Haryanvi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ur">اردو (Urdu)</option>
            </select>
          </div>

          {/* Autonomy Level Settings */}
          <div className="pt-2">
            <label className="font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              Autonomous Decision Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">💧 Irrigation</span>
                <select
                  value={formData.autoModePreferences.irrigation}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoModePreferences: { ...formData.autoModePreferences, irrigation: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-[11px] text-emerald-400 font-bold"
                >
                  <option value="auto">Auto (Full)</option>
                  <option value="ask">Ask First</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">🌿 Spraying</span>
                <select
                  value={formData.autoModePreferences.spray}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoModePreferences: { ...formData.autoModePreferences, spray: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-[11px] text-emerald-400 font-bold"
                >
                  <option value="auto">Auto (Full)</option>
                  <option value="ask">Ask First</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">🌾 Harvesting</span>
                <select
                  value={formData.autoModePreferences.harvest}
                  onChange={(e) => setFormData({
                    ...formData,
                    autoModePreferences: { ...formData.autoModePreferences, harvest: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-[11px] text-amber-400 font-bold"
                >
                  <option value="ask">Ask First</option>
                  <option value="auto">Auto (Full)</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save & Update Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
