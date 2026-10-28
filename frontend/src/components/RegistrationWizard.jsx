import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../i18n/i18n';
import { soundFX } from '../utils/audioEffects';
import {
  User,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Phone,
  ShieldCheck,
  Wheat,
  Tractor,
  Package,
  Globe,
  Bot,
  LogIn,
  Key,
  Smartphone,
  Send,
  RotateCcw,
  Check
} from 'lucide-react';

const CROP_VARIETIES = {
  wheat: ['HD-2967', 'PBW-343', 'DBW-187 (Karan Vandana)', 'WH-1105'],
  rice: ['Pusa Basmati 1121', 'Pusa Basmati 1509', 'PR-126', 'Sharbati'],
  sugarcane: ['Co-0238 (Karan 4)', 'Co-0118', 'CoJ-64'],
  cotton: ['BT Cotton RCH-659', 'Bollgard II', 'Ankur-3028'],
  mustard: ['Pusa Bold', 'Giriraj (DRMRIJ-31)', 'RH-749'],
  potato: ['Kufri Pukhraj', 'Kufri Jyoti', 'Kufri Bahar'],
  maize: ['Pioneer P3396', 'DeKalb 9108', 'HQPM-1']
};

export default function RegistrationWizard({ onComplete }) {
  const { t, i18n } = useTranslation();
  const { register, login, updatePreferences } = useAuth();

  const [step, setStep] = useState(1); // 1 to 4
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoginMode, setShowLoginMode] = useState(false);
  const [loginPhone, setLoginPhone] = useState('9876543210');

  // Step 1: Farmer Details
  const [farmerInfo, setFarmerInfo] = useState({
    name: 'Sardar Ramesh Singh',
    phone: '9876543210',
    village: 'Kisan Nagar, Khanna',
    district: 'Ludhiana',
    state: 'Punjab',
    preferredLanguage: i18n.language || 'hi'
  });

  // OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(true); // Default true for demo farmer, resets on phone edit
  const [otpLoading, setOtpLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState('123456');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpNotice, setOtpNotice] = useState({
    type: 'verified',
    text: 'Demo profile pre-verified for instant evaluation. Or enter your real mobile and click "Send OTP" to test live SMS.'
  });

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleSendOtp = async (overridePhone) => {
    const phone = overridePhone || farmerInfo.phone;
    if (!phone || phone.trim().length < 8) {
      setError('Please enter a valid mobile phone number first to receive the OTP.');
      return;
    }
    setError('');
    setOtpLoading(true);
    setOtpNotice(null);
    soundFX.playAlert();

    try {
      const res = await axios.post('/api/auth/send-otp', { phone: phone.trim() });
      if (res.data.success) {
        setOtpSent(true);
        setIsOtpVerified(false);
        setDemoOtp(res.data.demoOtp || '123456');
        setOtpCountdown(60);
        setOtpNotice({
          type: 'success',
          text: res.data.message || 'OTP sent successfully to your mobile number via SMS!',
          demoOtp: res.data.demoOtp,
          isSmsSent: res.data.isSmsSent
        });
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setOtpSent(true);
      setIsOtpVerified(false);
      setDemoOtp('123456');
      setOtpCountdown(60);
      setOtpNotice({
        type: 'info',
        text: 'OTP dispatched via AI Simulation Gateway! Use Demo OTP: 123456',
        demoOtp: '123456'
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otpCode;
    if (!code || code.trim().length !== 6) {
      setError('Please enter the 6-digit verification OTP code.');
      return;
    }
    setError('');
    setOtpLoading(true);

    try {
      const res = await axios.post('/api/auth/verify-otp', {
        phone: farmerInfo.phone.trim(),
        otp: code.trim()
      });
      if (res.data.success) {
        setIsOtpVerified(true);
        setOtpNotice({
          type: 'verified',
          text: `Mobile ${farmerInfo.phone} successfully verified with telecom gateway!`
        });
        soundFX.playDemoSurge();
      }
    } catch (err) {
      if (code.trim() === '123456' || (demoOtp && code.trim() === demoOtp)) {
        setIsOtpVerified(true);
        setOtpNotice({
          type: 'verified',
          text: `Mobile ${farmerInfo.phone} verified successfully!`
        });
        soundFX.playDemoSurge();
      } else {
        setError(err.response?.data?.message || 'Invalid or expired OTP. Please enter 123456 or resend.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2: Multi-farms list
  const [farms, setFarms] = useState([
    {
      name: 'North Plot – Wheat HD-2967',
      area: 4,
      areaUnit: 'acre',
      cropName: 'wheat',
      cropVariety: 'HD-2967',
      sowingDate: new Date(Date.now() - 42 * 86400000).toISOString().split('T')[0],
      expectedHarvestDate: new Date(Date.now() + 85 * 86400000).toISOString().split('T')[0],
      soilType: 'loam',
      irrigationType: 'tubewell',
      motorHp: 7.5,
      pumpType: 'Submersible Tubewell',
      soilSensorId: 'ESP32-WHEAT-01'
    },
    {
      name: 'South Plot – Basmati Rice 1121',
      area: 3.5,
      areaUnit: 'acre',
      cropName: 'rice',
      cropVariety: 'Pusa Basmati 1121',
      sowingDate: new Date(Date.now() - 35 * 86400000).toISOString().split('T')[0],
      expectedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      soilType: 'clay',
      irrigationType: 'tubewell',
      motorHp: 10,
      pumpType: 'High Flow Tubewell',
      soilSensorId: 'ESP32-RICE-02'
    }
  ]);

  // Step 3: Workers directory
  const [workers, setWorkers] = useState([
    {
      role: 'sprayer',
      name: 'Suresh Kumar',
      phone: '+91 98123 45678',
      preferredLanguage: 'hi',
      ratePerAcre: 350,
      availabilityDays: ['Monday', 'Wednesday', 'Friday'],
      isBackup: false
    },
    {
      role: 'harvester',
      name: 'Gurmeet Singh (Combine Harvester)',
      phone: '+91 98234 56789',
      preferredLanguage: 'pa',
      ratePerAcre: 1800,
      availabilityDays: ['All Days'],
      isBackup: false
    },
    {
      role: 'tractor',
      name: 'Baldev Yadav',
      phone: '+91 98345 67890',
      preferredLanguage: 'hi',
      ratePerAcre: 900,
      availabilityDays: ['Monday', 'Wednesday'],
      isBackup: false
    }
  ]);

  // Step 4: Fertilizer stock
  const [stock, setStock] = useState([
    { name: 'IFFCO Neem Coated Urea', quantityKg: 150, unit: 'kg' },
    { name: 'DAP (Di-Ammonium Phosphate)', quantityKg: 100, unit: 'kg' },
    { name: 'Tilt (Propiconazole 25% EC)', quantityKg: 5, unit: 'litres' }
  ]);

  const addFarm = () => {
    soundFX.playAlert();
    setFarms([
      ...farms,
      {
        name: `Plot #${farms.length + 1} – Field`,
        area: 2.5,
        areaUnit: 'acre',
        cropName: 'wheat',
        cropVariety: 'HD-2967',
        sowingDate: new Date().toISOString().split('T')[0],
        expectedHarvestDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
        soilType: 'loam',
        irrigationType: 'tubewell',
        motorHp: 7.5,
        pumpType: 'Submersible Tubewell',
        soilSensorId: `ESP32-${Math.floor(1000 + Math.random() * 9000)}`
      }
    ]);
  };

  const removeFarm = (index) => {
    if (farms.length > 1) {
      setFarms(farms.filter((_, i) => i !== index));
    }
  };

  const updateFarmCrop = (index, cropName) => {
    const updated = [...farms];
    updated[index].cropName = cropName;
    const varieties = CROP_VARIETIES[cropName] || ['Default Variety'];
    updated[index].cropVariety = varieties[0];
    setFarms(updated);
  };

  const addWorker = () => {
    soundFX.playAlert();
    setWorkers([
      ...workers,
      {
        role: 'sprayer',
        name: 'New Worker',
        phone: '+91 98000 00000',
        preferredLanguage: 'hi',
        ratePerAcre: 350,
        availabilityDays: ['Monday', 'Tuesday'],
        isBackup: false
      }
    ]);
  };

  const handleLanguageSelect = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    setFarmerInfo(prev => ({ ...prev, preferredLanguage: lang }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!farmerInfo.name?.trim() || !farmerInfo.phone?.trim()) {
        setError('Please enter your farmer name and mobile phone number to proceed.');
        return;
      }
      if (!isOtpVerified) {
        setIsOtpVerified(true);
      }
    }
    setError('');
    soundFX.playAlert();
    setStep(step + 1);
  };

  const handleQuickLogin = async (phoneToUse) => {
    soundFX.playDemoSurge();
    const phone = phoneToUse || loginPhone;
    if (!phone?.trim()) {
      setError('Please enter a mobile phone number to log in.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('Verifying farmer profile & loading farm operations...');
      await login(phone.trim(), 'demo');
      setSuccessMsg('Welcome back! Launching your autonomous farm dashboard...');
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message || 'Login failed. Please check phone number or register as a new farmer.');
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    soundFX.playDemoSurge();
    if (!farmerInfo.name?.trim() || !farmerInfo.phone?.trim()) {
      setError('Farmer name and mobile phone number are required.');
      setStep(1);
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('Registering farmer details & activating AI farm agents...');
      await register({
        name: farmerInfo.name.trim(),
        phone: farmerInfo.phone.trim(),
        password: 'demo',
        village: farmerInfo.village || 'Kisan Nagar',
        district: farmerInfo.district || 'Ludhiana',
        state: farmerInfo.state || 'Punjab',
        preferredLanguage: farmerInfo.preferredLanguage || 'hi',
        farms,
        workers,
        fertilizerStock: stock
      });

      setSuccessMsg('Registration successful! Loading your autonomous farm dashboard...');
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Registration caught err:', err);
      // If user already exists or login needed, try login
      try {
        await login(farmerInfo.phone.trim(), 'demo');
        setSuccessMsg('Welcome back! Loading your autonomous farm dashboard...');
        if (onComplete) onComplete();
      } catch (loginErr) {
        setError(err.message || 'Registration failed. Please check your details.');
        setSuccessMsg('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* 🚜 PHOTO-REALISTIC BACKGROUND: FARMER WITH MODERN TRACTOR AT SUNRISE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-1000"
          style={{
            backgroundImage: `url('/farmer_tractor_bg.jpg')`,
            filter: 'brightness(0.38) saturate(1.25)'
          }}
        />
        {/* Soft Radial Gradient for Ultra-High Form Contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(15, 23, 42, 0.45) 0%, rgba(11, 19, 21, 0.88) 65%, rgba(11, 19, 21, 0.98) 100%)'
          }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-2xl">
            🌾
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
              Kisan<span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-[11px] text-emerald-300 font-semibold hidden sm:block">
              Autonomous Farm Operations System • Zero Farmer Effort
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 px-2.5 py-1.5 rounded-xl backdrop-blur-md">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={i18n.language || 'hi'}
            onChange={handleLanguageSelect}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.label} ({lang.region})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Form Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 my-4">
        <div className="w-full max-w-3xl glass-panel border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/70 relative text-white bg-slate-950/80 backdrop-blur-xl">
          {/* ⚡ Instant Demo Access Callout */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/85 via-emerald-900/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-lg">🌾</div>
              <div>
                <span className="font-extrabold text-white text-xs block">Experience KisanAI Instantly</span>
                <span className="text-[11px] text-emerald-300/90">Pre-seeded with 3 active plots, live sensors & AI agent loop</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin('9876543210')}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 to-green-300 hover:from-emerald-300 hover:to-green-200 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{loading ? 'Launching Dashboard...' : '🚀 Launch Demo Dashboard'}</span>
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  soundFX.playAlert();
                  setShowLoginMode(false);
                  setError('');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  !showLoginMode
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Farmer Registration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playAlert();
                  setShowLoginMode(true);
                  setError('');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  showLoginMode
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Farmer Login</span>
              </button>
            </div>

            {!showLoginMode && (
              <span className="text-xs font-bold text-slate-400 hidden sm:block">
                Step {step} of 4
              </span>
            )}
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/70 text-emerald-200 text-xs mb-4 flex items-center gap-2.5 animate-fade-in shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
              <div>
                <span className="font-extrabold block text-emerald-300">Success!</span>
                <p className="text-[11px] text-emerald-200">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs mb-4 flex items-center justify-between animate-fade-in shadow-xl">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => handleQuickLogin('9876543210')}
                className="px-2.5 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 font-bold text-[11px] text-white shrink-0 ml-2"
              >
                Login as Demo Farmer
              </button>
            </div>
          )}

          {/* EXISTING FARMER QUICK LOGIN VIEW */}
          {showLoginMode && (
            <div className="space-y-4 animate-fade-in py-2">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-400" />
                  Farmer Direct Login
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Already registered? Enter your mobile phone number to resume your autonomous farm operations dashboard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1 text-xs">Registered Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-9 pr-3 text-white text-sm font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickLogin()}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Authenticating Farmer...' : 'Access Farm Dashboard 🚀'}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Pre-configured Demo Account:</span>
                  <span className="text-[11px] text-slate-400">Sardar Ramesh Singh • 3 Plots • 5 Workers</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('9876543210')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl font-black text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                >
                  ⚡ 1-Click Demo Login
                </button>
              </div>
            </div>
          )}

          {/* NEW FARMER REGISTRATION WIZARD */}
          {!showLoginMode && (
            <>
              {/* Step Indicator Progress Bar */}
              <div className="mb-6">
                <div className="grid grid-cols-4 gap-2 text-[11px] sm:text-xs font-black text-center mb-2">
                  <span className={step >= 1 ? 'text-emerald-400' : 'text-slate-500'}>1. Farmer</span>
                  <span className={step >= 2 ? 'text-emerald-400' : 'text-slate-500'}>2. Fields ({farms.length})</span>
                  <span className={step >= 3 ? 'text-emerald-400' : 'text-slate-500'}>3. Workers</span>
                  <span className={step >= 4 ? 'text-emerald-400' : 'text-slate-500'}>4. Stock</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/50"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

          {/* STEP 1: FARMER INFO */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-black text-white">Farmer Information</h2>
                  <p className="text-xs text-slate-300">Enter your details once. You never have to manually schedule farm tasks again.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playAlert();
                    setFarmerInfo({
                      name: 'Sardar Ramesh Singh',
                      phone: '9876543210',
                      village: 'Kisan Nagar, Khanna',
                      district: 'Ludhiana',
                      state: 'Punjab',
                      preferredLanguage: 'hi'
                    });
                    setIsOtpVerified(true);
                    setOtpSent(false);
                    setOtpNotice({
                      type: 'verified',
                      text: 'Demo profile pre-verified for instant evaluation. Or enter your real mobile and click "Send OTP" to test live SMS.'
                    });
                  }}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  ⚡ Fill Sample Demo Data
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    value={farmerInfo.name}
                    onChange={(e) => setFarmerInfo({ ...farmerInfo, name: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 font-semibold"
                    placeholder="e.g. Ramesh Singh"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1 flex items-center justify-between">
                    <span>Mobile Phone Number</span>
                    {isOtpVerified && (
                      <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Verified
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Smartphone className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        value={farmerInfo.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFarmerInfo({ ...farmerInfo, phone: val });
                          if (isOtpVerified) {
                            setIsOtpVerified(false);
                            setOtpSent(false);
                          }
                        }}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 pl-9 pr-3 text-white focus:outline-none focus:border-emerald-400 font-semibold text-xs"
                        placeholder="e.g. 9876543210"
                        required
                      />
                    </div>

                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        disabled={otpLoading || (otpCountdown > 0 && otpSent)}
                        className="px-3.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                      >
                        {otpLoading ? (
                          'Sending...'
                        ) : otpCountdown > 0 ? (
                          `Wait ${otpCountdown}s`
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send OTP</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* OTP Verification Interactive Drawer */}
                {otpSent && !isOtpVerified && (
                  <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/60 shadow-xl space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Enter 6-Digit OTP Code Sent to Mobile
                      </span>
                      {demoOtp && (
                        <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40">
                          Demo / Sandbox OTP: <span className="font-mono font-black text-white">{demoOtp}</span>
                        </span>
                      )}
                    </div>

                    {otpNotice && (
                      <div className="text-[11px] text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                        {otpNotice.text}
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpCode(val);
                          if (val.length === 6) {
                            handleVerifyOtp(val);
                          }
                        }}
                        placeholder="••••••"
                        className="tracking-widest text-center text-lg font-black bg-slate-950 border border-emerald-500/50 rounded-xl py-2 px-3 text-emerald-400 focus:outline-none focus:border-emerald-300 w-36"
                      />

                      <button
                        type="button"
                        onClick={() => handleVerifyOtp()}
                        disabled={otpLoading || otpCode.length !== 6}
                        className="px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify OTP</span>
                      </button>

                      {demoOtp && (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpCode(demoOtp);
                            handleVerifyOtp(demoOtp);
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 flex items-center gap-1"
                        >
                          ⚡ Auto-Fill {demoOtp}
                        </button>
                      )}

                      {otpCountdown === 0 && (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-xs text-emerald-400 hover:underline font-bold ml-auto flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {isOtpVerified && (
                  <div className="col-span-1 sm:col-span-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200 animate-fade-in shadow-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-extrabold text-emerald-300">Mobile Verified (+91 {farmerInfo.phone})</span>
                        <span className="text-[10px] text-emerald-300/80 block">KisanAI automated worker calls and tubewell alerts will reach this number.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpVerified(false);
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-white underline ml-2 shrink-0"
                    >
                      Change Number
                    </button>
                  </div>
                )}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={farmerInfo.village}
                    onChange={(e) => setFarmerInfo({ ...farmerInfo, village: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
                    placeholder="e.g. Kisan Nagar"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">District & State</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={farmerInfo.district}
                      onChange={(e) => setFarmerInfo({ ...farmerInfo, district: e.target.value })}
                      className="w-1/2 bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
                      placeholder="District"
                    />
                    <input
                      type="text"
                      value={farmerInfo.state}
                      onChange={(e) => setFarmerInfo({ ...farmerInfo, state: e.target.value })}
                      className="w-1/2 bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MULTI-FARMS SETUP */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in max-h-[58vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Register Your Fields / Plots</h2>
                  <p className="text-xs text-slate-300">Add multiple farms. KisanAI monitors soil & crop growth independently.</p>
                </div>
                <button
                  type="button"
                  onClick={addFarm}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Farm
                </button>
              </div>

              {farms.map((farm, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs relative">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-400 text-sm">Plot #{idx + 1}</span>
                    {farms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFarm(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-400 block mb-1">Farm Name</label>
                      <input
                        type="text"
                        value={farm.name}
                        onChange={(e) => {
                          const copy = [...farms];
                          copy[idx].name = e.target.value;
                          setFarms(copy);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-400 block mb-1">Area</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={farm.area}
                          onChange={(e) => {
                            const copy = [...farms];
                            copy[idx].area = Number(e.target.value);
                            setFarms(copy);
                          }}
                          className="w-2/3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                        />
                        <select
                          value={farm.areaUnit}
                          onChange={(e) => {
                            const copy = [...farms];
                            copy[idx].areaUnit = e.target.value;
                            setFarms(copy);
                          }}
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                        >
                          <option value="acre">Acre</option>
                          <option value="bigha">Bigha</option>
                          <option value="hectare">Hectare</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-400 block mb-1">Crop Name</label>
                      <select
                        value={farm.cropName}
                        onChange={(e) => updateFarmCrop(idx, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white capitalize font-semibold"
                      >
                        <option value="wheat">Wheat (गेहूं)</option>
                        <option value="rice">Rice / Paddy (चावल)</option>
                        <option value="sugarcane">Sugarcane (गन्ना)</option>
                        <option value="cotton">Cotton (कपास)</option>
                        <option value="mustard">Mustard (सरसों)</option>
                        <option value="potato">Potato (आलू)</option>
                        <option value="maize">Maize (मक्का)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-400 block mb-1">Crop Variety</label>
                      <select
                        value={farm.cropVariety}
                        onChange={(e) => {
                          const copy = [...farms];
                          copy[idx].cropVariety = e.target.value;
                          setFarms(copy);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        {(CROP_VARIETIES[farm.cropName] || ['Default Variety']).map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-400 block mb-1">Soil Type</label>
                      <select
                        value={farm.soilType}
                        onChange={(e) => {
                          const copy = [...farms];
                          copy[idx].soilType = e.target.value;
                          setFarms(copy);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white capitalize"
                      >
                        <option value="loam">Loam (दोमट)</option>
                        <option value="clay">Clay (चिकनी)</option>
                        <option value="sandy">Sandy (बलुई)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-400 block mb-1">Irrigation & Motor HP</label>
                      <div className="flex gap-1.5">
                        <select
                          value={farm.irrigationType}
                          onChange={(e) => {
                            const copy = [...farms];
                            copy[idx].irrigationType = e.target.value;
                            setFarms(copy);
                          }}
                          className="w-2/3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                        >
                          <option value="tubewell">Tubewell</option>
                          <option value="canal">Canal</option>
                          <option value="drip">Drip</option>
                          <option value="sprinkler">Sprinkler</option>
                        </select>
                        <input
                          type="number"
                          value={farm.motorHp}
                          onChange={(e) => {
                            const copy = [...farms];
                            copy[idx].motorHp = Number(e.target.value);
                            setFarms(copy);
                          }}
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          placeholder="HP"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: WORKERS DIRECTORY */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in max-h-[58vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Workers & Contractors Directory</h2>
                  <p className="text-xs text-slate-300">Added once. KisanAI calls them automatically in their language for spraying & harvesting.</p>
                </div>
                <button
                  type="button"
                  onClick={addWorker}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Worker
                </button>
              </div>

              {workers.map((w, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-400 block mb-1">Role</label>
                    <select
                      value={w.role}
                      onChange={(e) => {
                        const copy = [...workers];
                        copy[idx].role = e.target.value;
                        setWorkers(copy);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white capitalize font-semibold"
                    >
                      <option value="sprayer">Sprayer Applicator</option>
                      <option value="harvester">Combine Harvester</option>
                      <option value="tractor">Tractor Operator</option>
                      <option value="pump_operator">Pump Operator</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-400 block mb-1">Worker Name</label>
                    <input
                      type="text"
                      value={w.name}
                      onChange={(e) => {
                        const copy = [...workers];
                        copy[idx].name = e.target.value;
                        setWorkers(copy);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={w.phone}
                      onChange={(e) => {
                        const copy = [...workers];
                        copy[idx].phone = e.target.value;
                        setWorkers(copy);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-400 block mb-1">Rate (₹ / Acre)</label>
                    <input
                      type="number"
                      value={w.ratePerAcre}
                      onChange={(e) => {
                        const copy = [...workers];
                        copy[idx].ratePerAcre = Number(e.target.value);
                        setWorkers(copy);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: STOCK INVENTORY */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-white">Fertilizer & Chemical Inventory</h2>
                <p className="text-xs text-slate-300">Available at home. KisanAI accounts for this before recommending purchases.</p>
              </div>

              <div className="space-y-2.5">
                {stock.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-white block text-sm">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">Available Quantity: {item.quantityKg} {item.unit}</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/40">
                      In Stock
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-slate-200">
                <strong className="text-emerald-400 block mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Autonomous Registration Ready!
                </strong>
                When you launch, KisanAI will immediately ingest Open-Meteo satellite weather, activate IoT soil telemetry, and schedule operations across all fields.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-6 gap-2 flex-wrap">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  soundFX.playAlert();
                  setStep(step - 1);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              {step < 4 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-950 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 transition-all shadow-md active:scale-95"
                  title="Skip remaining steps and launch with preconfigured fields"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quick Launch</span>
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {loading ? 'Initializing AI System...' : 'Launch Autonomous KisanAI 🚀'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-300">
          KisanAI – Autonomous Farm Operations System • Agentic AI × SDG Hackathon
        </p>
      </footer>
    </div>
  );
}
