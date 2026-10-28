import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mic, MicOff, Volume2, Sparkles, MessageSquare } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  'Mere gehun mein kab pani dena hai?',
  'Mandi mein dhan ka kya bhav chal raha hai?',
  'Kya kal urea spray karna theek rahega?',
  'Suresh worker ko call lagao'
];

export default function VoiceAssistantModal({ onClose, farms = [] }) {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speech Recognition Setup
  useEffect(() => {
    let recognition = null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && isListening) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = i18n.language === 'en' ? 'en-IN' : 'hi-IN';

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        processVoiceQuery(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening, i18n.language]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceQuery = (queryText) => {
    const q = queryText.toLowerCase();
    let answer = '';

    if (q.includes('pani') || q.includes('water') || q.includes('irrigation') || q.includes('gehun')) {
      answer = 'रमेश जी, आपके गेहूं के खेत में मिट्टी की नमी वर्तमान में 38% है। मौसम पूर्वानुमान के अनुसार अगले 24 घंटे में बारिश नहीं है, इसलिए कल सुबह 40 मिनट ट्यूबवेल चलाना सबसे उपयुक्त रहेगा।';
    } else if (q.includes('bhav') || q.includes('price') || q.includes('mandi') || q.includes('dhan')) {
      answer = 'आज खन्ना मंडी में बासमती 1121 का भाव ₹3,850 प्रति क्विंटल है, जो एमएसपी से ₹1,647 अधिक है। हमारे AI के अनुसार अभी 50% फसल बेचना अत्यधिक लाभदायक है।';
    } else if (q.includes('spray') || q.includes('urea') || q.includes('khad')) {
      answer = 'हवा की गति 8 किमी प्रति घंटा है और मौसम साफ है। कल सुबह 6:30 बजे यूरिया का स्प्रे करना बिल्कुल सुरक्षित है। मैंने सुरेश स्प्रेयर से पुष्टि कर ली है।';
    } else if (q.includes('call') || q.includes('suresh') || q.includes('worker')) {
      answer = 'किसानAI ने सुरेश कुमार को कल सुबह के स्प्रे कार्य के लिए वॉयस कॉल कर दी है। सुरेश जी ने सुबह 6:30 बजे खेत पर आने की पुष्टि की है।';
    } else {
      answer = `किसानAI ने आपकी बात समझी: "${queryText}"। आपके सभी तीनों खेत (गेहूं, बासमती धान, गन्ना) स्वस्थ अवस्था में हैं। पानी और खाद का प्रबंधन स्वचालित रूप से चल रहा है।`;
    }

    setReply(answer);
    speakText(answer);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setTranscript('');
      setReply('');
      setIsListening(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto animate-fade-in text-white text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <h2 className="text-lg font-bold text-emerald-400">
              {t('navbar.voiceAI')} (KisanAI Speak)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Button with animated soundwaves */}
        <div className="my-6 flex flex-col items-center">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-4 rounded-full bg-emerald-500/30 animate-ping" />
            )}
            <button
              onClick={toggleMic}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-500/50 scale-110'
                  : 'bg-gradient-to-tr from-emerald-600 to-green-400 text-slate-950 shadow-emerald-500/40 hover:scale-105 active:scale-95'
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
            </button>
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-300">
            {isListening ? t('voice.listening') : t('voice.speakPrompt')}
          </p>
        </div>

        {/* Live Transcript */}
        {transcript && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-4 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">You asked:</span>
            <p className="text-white font-medium italic">"{transcript}"</p>
          </div>
        )}

        {/* AI Spoken Answer */}
        {reply && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-left mb-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('voice.aiSpeaking')}
              </span>
              <button
                onClick={() => speakText(reply)}
                className="p-1 text-emerald-400 hover:text-white"
                title="Replay Audio"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
              </button>
            </div>
            <p className="text-emerald-100 font-medium leading-relaxed">{reply}</p>
          </div>
        )}

        {/* Quick Sample Questions (1-Click for Demo) */}
        <div className="pt-3 border-t border-slate-800 text-left">
          <p className="text-[11px] font-bold text-slate-400 mb-2">
            {t('voice.sampleQueries')}
          </p>
          <div className="flex flex-col gap-1.5">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(q);
                  processVoiceQuery(q);
                }}
                className="text-left p-2 rounded-lg bg-slate-900/60 hover:bg-emerald-950/50 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
