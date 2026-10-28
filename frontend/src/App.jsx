import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider, useFarms } from './context/FarmContext';
import { SocketProvider, useSocket } from './context/SocketContext';

// Components
import Navbar from './components/Navbar';
import DynamicBackground from './components/DynamicBackground';
import WeatherWidget from './components/WeatherWidget';
import FarmCard from './components/FarmCard';
import AgentFeed from './components/AgentFeed';
import ReplanCard from './components/ReplanCard';
import FarmDetailModal from './components/FarmDetailModal';
import DemoRunnerModal from './components/DemoRunnerModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import DiseaseScannerModal from './components/DiseaseScannerModal';
import MandiModal from './components/MandiModal';
import SchemesModal from './components/SchemesModal';
import FinancesModal from './components/FinancesModal';
import WorkerCallModal from './components/WorkerCallModal';
import RegistrationWizard from './components/RegistrationWizard';
import AgentStatusRadar from './components/AgentStatusRadar';
import FloatingActionBar from './components/FloatingActionBar';
import ProfileModal from './components/ProfileModal';
import TubewellAlertModal from './components/TubewellAlertModal';

import { Plus, Bell, X, ShieldAlert, Sparkles, Layers } from 'lucide-react';

function Dashboard() {
  const { t } = useTranslation();
  const { farmer } = useAuth();
  const {
    farms,
    selectedFarm,
    setSelectedFarm,
    weather,
    feed,
    replanCards,
    setReplanCards,
    toggleMotor,
    fetchFarms
  } = useFarms();
  const {
    alerts,
    clearAlert,
    lastCall,
    clearLastCall,
    tubewellEvent,
    clearTubewellAlert
  } = useSocket();

  // Modals state
  const [activeDetailFarm, setActiveDetailFarm] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [showMandiModal, setShowMandiModal] = useState(false);
  const [showSchemesModal, setShowSchemesModal] = useState(false);
  const [showFinancesModal, setShowFinancesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [audioCallModalData, setAudioCallModalData] = useState(null);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col">
      {/* Dynamic Background matching selected crop with soft dark overlay */}
      <DynamicBackground cropName={selectedFarm?.cropName || farms[0]?.cropName || 'wheat'} />

      {/* Top Navbar */}
      <Navbar
        onOpenDemo={() => setShowDemoModal(true)}
        onOpenVoice={() => setShowVoiceModal(true)}
        onOpenMandi={() => setShowMandiModal(true)}
        onOpenSchemes={() => setShowSchemesModal(true)}
        onOpenFinances={() => setShowFinancesModal(true)}
        onOpenDisease={() => setShowDiseaseModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Main Dashboard Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Real-Time Alert Banner / Notification Toasts */}
        {alerts.length > 0 && (
          <div className="space-y-2 animate-slide-up">
            {alerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/50 shadow-2xl flex items-center justify-between text-xs backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  {alert.imageUrl ? (
                    <div className="relative shrink-0">
                      <img
                        src={alert.imageUrl}
                        alt="Tubewell"
                        className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover border-2 border-emerald-400/60 shadow-lg shadow-emerald-950/50"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-400 text-slate-950 shadow">
                        💧 PUMP
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Bell className="w-4 h-4 animate-bounce" />
                    </div>
                  )}
                  <div>
                    <span className="font-extrabold text-white text-sm block">
                      {alert.title}
                    </span>
                    <p className="text-slate-300">{alert.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => clearAlert(alert.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Autonomous Engine Radar & Verified SDG Impact Banner */}
        <AgentStatusRadar farmsCount={farms.length} onScanComplete={fetchFarms} />

        {/* Dynamic Replanning Cards (shown when weather changes or demo triggers) */}
        <ReplanCard cards={replanCards} />

        {/* Farm Climate & 72h Weather Outlook */}
        <WeatherWidget weather={weather} />

        {/* Two-Column Operations Layout: Farms on Left, Live Agent Feed on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Autonomous Farm Cards (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>{t('dashboard.allFarmsOverview')}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {farms.length} Plots
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Click any field to switch ambient view or open detailed IoT telemetry.
                </p>
              </div>

              <button
                onClick={() => setShowAddFarmModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('dashboard.addFarm')}</span>
              </button>
            </div>

            {/* Farm Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              {farms.map((farm) => (
                <FarmCard
                  key={farm._id || farm.id}
                  farm={farm}
                  isSelected={(selectedFarm?._id || selectedFarm?.id) === (farm._id || farm.id)}
                  onSelect={() => setSelectedFarm(farm)}
                  onOpenDetail={(f) => setActiveDetailFarm(f)}
                  onToggleMotor={toggleMotor}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Agent Activity Live Stream (5 Columns) */}
          <div className="lg:col-span-5 sticky top-20">
            <AgentFeed
              feed={feed}
              onPlayCallAudio={(callItem) => setAudioCallModalData(callItem)}
            />
          </div>
        </div>
      </main>

      {/* MODALS */}
      {activeDetailFarm && (
        <FarmDetailModal
          farm={activeDetailFarm}
          onClose={() => setActiveDetailFarm(null)}
          onToggleMotor={toggleMotor}
        />
      )}

      {showDemoModal && (
        <DemoRunnerModal
          onClose={() => setShowDemoModal(false)}
          onScenarioCompleted={(diffs) => {
            setReplanCards(diffs);
          }}
        />
      )}

      {showVoiceModal && (
        <VoiceAssistantModal
          farms={farms}
          onClose={() => setShowVoiceModal(false)}
        />
      )}

      {showDiseaseModal && (
        <DiseaseScannerModal
          farms={farms}
          onClose={() => setShowDiseaseModal(false)}
        />
      )}

      {showMandiModal && (
        <MandiModal
          onClose={() => setShowMandiModal(false)}
        />
      )}

      {showSchemesModal && (
        <SchemesModal
          onClose={() => setShowSchemesModal(false)}
        />
      )}

      {showFinancesModal && (
        <FinancesModal
          onClose={() => setShowFinancesModal(false)}
        />
      )}

      {audioCallModalData && (
        <WorkerCallModal
          callData={audioCallModalData}
          onClose={() => setAudioCallModalData(null)}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {tubewellEvent && (
        <TubewellAlertModal
          event={tubewellEvent}
          onClose={clearTubewellAlert}
          onStopMotor={(farmId) => {
            toggleMotor(farmId, 'off');
            clearTubewellAlert();
          }}
        />
      )}

      {/* Floating Quick Action Dock */}
      <FloatingActionBar
        onOpenDemo={() => setShowDemoModal(true)}
        onOpenVoice={() => setShowVoiceModal(true)}
        onOpenDisease={() => setShowDiseaseModal(true)}
        onOpenMandi={() => setShowMandiModal(true)}
        onOpenSchemes={() => setShowSchemesModal(true)}
        onOpenFinances={() => setShowFinancesModal(true)}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 glass-panel py-4 px-6 text-center text-xs text-slate-400 mt-12">
        <p className="font-semibold text-slate-300">
          KisanAI – Autonomous Farm Operations System • Agentic AI × SDG Hackathon
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          SDG 2: Zero Hunger | SDG 12: Responsible Consumption | SDG 13: Climate Action • Open-Meteo & Node-Cron Powered
        </p>
      </footer>
    </div>
  );
}

function MainApp() {
  const { farmer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-3xl animate-bounce mb-3">
          🌾
        </div>
        <p className="text-sm font-bold text-emerald-400">Loading KisanAI Autonomous Environment...</p>
      </div>
    );
  }

  // If no farmer session, show the 4-step registration wizard
  if (!farmer) {
    return <RegistrationWizard />;
  }

  return (
    <FarmProvider>
      <Dashboard />
    </FarmProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
