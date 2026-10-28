import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  CloudLightning,
  Power,
  Droplets,
  Calendar,
  PhoneCall,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export default function DemoRunnerModal({ onClose, onScenarioCompleted }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [completedDiffs, setCompletedDiffs] = useState(null);

  const steps = [
    {
      title: 'Satellite Weather Alert Injected',
      desc: 'Doppler Radar detects sudden severe monsoon front. Rain probability jumps from 15% to 92%.',
      icon: <CloudLightning className="w-5 h-5 text-amber-400" />
    },
    {
      title: 'Emergency Irrigation Halted on Wheat Field',
      desc: 'KisanAI immediately stops running tubewell pump to prevent waterlogging and electricity wastage.',
      icon: <Power className="w-5 h-5 text-rose-400" />
    },
    {
      title: 'Groundwater Saved on Basmati Rice & Cane',
      desc: 'Skipped planned irrigation cycles. Preserved 140,000 Litres of groundwater for regional aquifer.',
      icon: <Droplets className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'Fertilizer Spray Rescheduled by 2 Days',
      desc: 'Rain washes away foliar chemicals into streams. Task deferred until clear sky window opens.',
      icon: <Calendar className="w-5 h-5 text-yellow-400" />
    },
    {
      title: 'Autonomous Multilingual Voice Call to Worker',
      desc: 'KisanAI speaks to sprayer Suresh in Hindi: "नमस्ते सुरेश जी, बारिश के कारण कल का स्प्रे गुरुवार को होगा।"',
      icon: <PhoneCall className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Cross-Farm Synchronized Replan Published',
      desc: 'Before/After diff cards pushed live to farmer dashboard and worker task schedule.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />
    }
  ];

  const playSimulatedVoiceCall = () => {
    if ('speechSynthesis' in window) {
      setAudioPlaying(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'नमस्ते सुरेश जी, मैं किसानAI बोल रहा हूँ रमेश जी के खेत से। मौसम में भारी बारिश आने की संभावना है, इसलिए कल का स्प्रे गुरुवार सुबह छह बजे निर्धारित किया गया है। धन्यवाद।'
      );
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRunDemo = async () => {
    setIsRunning(true);
    setCurrentStep(1);

    try {
      // Step 1: Satellite alert
      await new Promise(r => setTimeout(r, 1200));
      setCurrentStep(2);

      // Step 2: Motor stopped
      await new Promise(r => setTimeout(r, 1400));
      setCurrentStep(3);

      // Step 3: Groundwater saved
      await new Promise(r => setTimeout(r, 1400));
      setCurrentStep(4);

      // Step 4: Rescheduled spray
      await new Promise(r => setTimeout(r, 1400));
      setCurrentStep(5);

      // Trigger actual backend scenario execution
      const res = await axios.post('/api/agent/demo-scenario');

      // Step 5: Phone call to worker
      playSimulatedVoiceCall();
      await new Promise(r => setTimeout(r, 2200));
      setCurrentStep(6);

      // Step 6: Multi-farm diffs
      if (res.data.replanCards) {
        setCompletedDiffs(res.data.replanCards);
        if (onScenarioCompleted) {
          onScenarioCompleted(res.data.replanCards);
        }
      }

      // Confetti celebratory burst for the judges!
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error('Demo simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto animate-fade-in text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-700/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 text-2xl">
              ⚡
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300">
                Hackathon Judge Demo Mode
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulates real-world dynamic event response across 3 farms in under 2 minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Intro */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5 text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 block mb-1">Scenario Description:</strong>
          Farmer Ramesh has 3 fields (Wheat, Basmati Rice, Sugarcane) and scheduled tasks. Suddenly, atmospheric pressure plummets and Doppler radar alerts of a <strong>92% probability monsoon cloudburst</strong>. Watch how KisanAI takes over without any human intervention!
        </div>

        {/* Step-by-Step Progress Timeline */}
        <div className="space-y-3 mb-6">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum || currentStep === 6;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/30'
                    : isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : 'bg-slate-900/40 border-slate-800 opacity-50'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-800 shrink-0 mt-0.5">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">
                      {stepNum}. {step.title}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Executed ✓
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-400 animate-pulse">
                        Processing...
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button & Voice Call simulation trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={playSimulatedVoiceCall}
            disabled={audioPlaying}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/40 text-emerald-300 transition-colors"
          >
            <Volume2 className={`w-4 h-4 ${audioPlaying ? 'animate-bounce text-emerald-400' : ''}`} />
            <span>{audioPlaying ? 'Speaking Hindi Call Script...' : 'Replay Worker Phone Call'}</span>
          </button>

          <button
            onClick={handleRunDemo}
            disabled={isRunning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Simulation...' : 'Trigger Monsoon Event Now ⚡'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
