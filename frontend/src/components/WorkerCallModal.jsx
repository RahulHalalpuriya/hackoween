import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { soundFX } from '../utils/audioEffects';
import {
  X,
  PhoneCall,
  Volume2,
  User,
  CheckCircle2,
  Sparkles,
  PhoneForwarded,
  Settings,
  AlertCircle,
  Clock,
  Radio
} from 'lucide-react';

export default function WorkerCallModal({ callData: initialCallData, onClose }) {
  const [selectedRole, setSelectedRole] = useState(initialCallData?.workerRole || 'sprayer');
  const [workerName, setWorkerName] = useState(initialCallData?.workerName || 'Suresh Kumar (Sprayer)');
  const [targetPhone, setTargetPhone] = useState(initialCallData?.workerPhone || '+91 98123 45678');
  const [selectedLanguage, setSelectedLanguage] = useState(initialCallData?.language || 'hi');
  const [isPlaying, setIsPlaying] = useState(false);
  const [callingTwilio, setCallingTwilio] = useState(false);
  const [callResult, setCallResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: '',
    authToken: '',
    fromNumber: '',
    mockCalls: false
  });
  const [savedConfigMsg, setSavedConfigMsg] = useState('');

  // Default scripts for each role
  const scriptsByRole = {
    sprayer: {
      hi: `नमस्ते सुरेश कुमार जी, मैं किसानAI बोल रहा हूँ सरदार रमेश सिंह जी के खेत से। कल सुबह खेत में पीला रतुआ रोकथाम स्प्रे करना निर्धारित है। क्या आप सुबह 6:30 बजे आ सकते हैं?`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਸੁਰੇਸ਼ ਜੀ, ਮੈਂ ਕਿਸਾਨAI ਬੋਲ ਰਿਹਾ ਹਾਂ ਰਮੇਸ਼ ਸਿੰਘ ਜੀ ਦੇ ਖੇਤ ਵੱਲੋਂ। ਕੱਲ੍ਹ ਸਵੇਰੇ ਖੇਤ ਵਿੱਚ ਸਪਰੇਅ ਕਰਨੀ ਹੈ ਜੀ। ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ।`,
      en: `Hello Suresh Kumar, this is KisanAI autonomous farm system calling on behalf of Ramesh Singh. Yellow rust preventative spray is scheduled for tomorrow 6:30 AM. Please confirm availability.`
    },
    harvester: {
      hi: `राम-राम गुरमीत सिंह जी, किसानAI स्वचालित प्रणाली से कॉल है। सरदार रमेश सिंह जी के खेत में गेहूं की फसल पक कर तैयार हो गई है। कृपया कल के लिए कंबाइन हार्वेस्टर का समय बुक करें।`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਗੁਰਮੀਤ ਸਿੰਘ ਜੀ, ਕਿਸਾਨAI ਕਾਲ ਹੈ। ਕਣਕ ਦੀ ਫ਼ਸਲ ਪੱਕ ਚੁੱਕੀ ਹੈ, ਕੱਲ੍ਹ ਲਈ ਕੰਬਾਈਨ ਹਾਰਵੈਸਟਰ ਬੁੱਕ ਕਰਨਾ ਹੈ ਜੀ।`,
      en: `Hello Gurmeet Singh, KisanAI calling. The wheat crop is mature and ready for harvesting. Please schedule the combine harvester for tomorrow.`
    },
    tractor: {
      hi: `नमस्ते बलदेव यादव जी, किसानAI बोल रहा हूँ। कल सुबह खेत जुताई के लिए ट्रैक्टर की आवश्यकता है। कृपया समय की पुष्टि करें।`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਬਲਦੇਵ ਜੀ, ਖੇਤ ਵਾਹੁਣ ਲਈ ਕੱਲ੍ਹ ਟਰੈਕਟਰ ਦੀ ਲੋੜ ਹੈ ਜੀ।`,
      en: `Hello Baldev Yadav, KisanAI calling. Tractor required for field plowing tomorrow morning. Please confirm.`
    }
  };

  const currentScript = initialCallData?.messageScript ||
    scriptsByRole[selectedRole]?.[selectedLanguage] ||
    scriptsByRole[selectedRole]?.hi;

  useEffect(() => {
    fetchTwilioConfig();
    // Speak script on opening
    speakScript(currentScript);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fetchTwilioConfig = async () => {
    try {
      const res = await axios.get('/api/agent/twilio-config');
      if (res.data.success) {
        setTwilioConfig(prev => ({
          ...prev,
          fromNumber: res.data.fromNumber || '',
          mockCalls: res.data.isMock
        }));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/agent/twilio-config', twilioConfig);
      if (res.data.success) {
        setSavedConfigMsg('Twilio credentials saved successfully! ✅');
        setTimeout(() => setSavedConfigMsg(''), 2500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const speakScript = (text) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'sprayer') {
      setWorkerName('Suresh Kumar (Sprayer)');
      setTargetPhone('+91 98123 45678');
    } else if (role === 'harvester') {
      setWorkerName('Gurmeet Singh (Combine Harvester)');
      setTargetPhone('+91 98234 56789');
    } else {
      setWorkerName('Baldev Yadav (Tractor)');
      setTargetPhone('+91 98345 67890');
    }
    setCallResult(null);
    setErrorMsg('');
  };

  const handleTriggerRealCall = async () => {
    soundFX.playDemoSurge();
    try {
      setCallingTwilio(true);
      setErrorMsg('');
      setCallResult(null);

      const res = await axios.post('/api/agent/call-worker', {
        workerRole: selectedRole,
        workerName,
        phone: targetPhone,
        language: selectedLanguage,
        customMessage: currentScript
      });

      if (res.data.success) {
        setCallResult({
          message: res.data.message,
          isRealCall: res.data.isRealCall,
          twilioCallSid: res.data.twilioCallSid,
          targetPhone
        });

        // Also speak script aloud so user immediately hears what AI speaks to worker
        speakScript(currentScript);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Call failed');
    } finally {
      setCallingTwilio(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Autonomous AI Telephony</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Voice Call
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Twilio API Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Twilio Settings Drawer */}
        {showConfig && (
          <form onSubmit={handleSaveConfig} className="p-3.5 mb-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Settings className="w-3.5 h-3.5" />
                Twilio Telephony Credentials
              </span>
              <span className="text-[10px] text-slate-400">Optional: Paste your keys for live phone calls</span>
            </div>

            {savedConfigMsg && (
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 text-[11px] font-bold">
                {savedConfigMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Twilio Account SID</label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxx..."
                  value={twilioConfig.accountSid}
                  onChange={(e) => setTwilioConfig({ ...twilioConfig, accountSid: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-[11px] text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Auth Token</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={twilioConfig.authToken}
                  onChange={(e) => setTwilioConfig({ ...twilioConfig, authToken: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-[11px] text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 block mb-0.5">Twilio From Phone Number</label>
                <input
                  type="text"
                  placeholder="+1xxxxxxxxxx"
                  value={twilioConfig.fromNumber}
                  onChange={(e) => setTwilioConfig({ ...twilioConfig, fromNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-[11px] text-white"
                />
              </div>
              <button
                type="submit"
                className="self-end px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-slate-950 text-[11px]"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Worker Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleRoleChange('sprayer')}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'sprayer'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xl">🌿</span>
            <span>Spray Worker</span>
            <span className="text-[10px] font-normal text-slate-400">Suresh Kumar</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('harvester')}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'harvester'
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xl">🌾</span>
            <span>Harvester Worker</span>
            <span className="text-[10px] font-normal text-slate-400">Gurmeet Singh</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('tractor')}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'tractor'
                ? 'bg-blue-950/90 border-blue-500 text-blue-300 shadow-lg shadow-blue-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xl">🚜</span>
            <span>Tractor Operator</span>
            <span className="text-[10px] font-normal text-slate-400">Baldev Yadav</span>
          </button>
        </div>

        {/* Call Visualizer Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl shadow-md ${
                isPlaying ? 'ring-4 ring-emerald-500/30 animate-pulse' : ''
              }`}>
                {selectedRole === 'harvester' ? '🚜' : '👨‍🌾'}
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">{workerName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-300 font-semibold">
                    {targetPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Test Real Phone Input */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              📱 Worker Mobile Number (or Enter Your Real Mobile to Receive Call):
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => setTargetPhone('+919876543210')}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
              >
                Demo Number
              </button>
            </div>
          </div>
        </div>

        {/* Live Audio Waveform */}
        <div className="flex items-center justify-center gap-1 h-6 my-2">
          {[...Array(24)].map((_, i) => (
            <span
              key={i}
              className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'h-1.5'
              }`}
              style={{
                height: isPlaying ? `${Math.max(4, Math.sin(i * 0.5) * 18 + 6)}px` : '3px',
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>

        {/* Spoken Script Bubble */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left mb-4">
          <span className="text-[10px] font-black uppercase text-emerald-400 block mb-1 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            Spoken AI Speech Script ({selectedLanguage.toUpperCase()}):
          </span>
          <p className="text-slate-200 text-xs italic leading-relaxed">
            "{currentScript}"
          </p>
        </div>

        {/* Call Result Banner */}
        {callResult && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-xs text-emerald-200 mb-4 animate-fade-in flex items-start gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-white block">{callResult.message}</span>
              {callResult.twilioCallSid && (
                <span className="text-[10px] text-emerald-300 font-mono block mt-0.5">
                  Twilio Call SID: {callResult.twilioCallSid}
                </span>
              )}
              <span className="text-[10px] text-slate-300 block mt-0.5">
                Worker acknowledged task and confirmed schedule time!
              </span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => speakScript(currentScript)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>{isPlaying ? 'Speaking...' : 'Speak in Browser'}</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerRealCall}
            disabled={callingTwilio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-xl shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
          >
            <PhoneCall className={`w-4 h-4 ${callingTwilio ? 'animate-bounce' : ''}`} />
            <span>{callingTwilio ? 'Connecting Call...' : 'Place Real Phone Call 📞'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
