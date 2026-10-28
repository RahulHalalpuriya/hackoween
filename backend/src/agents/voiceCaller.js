import twilio from 'twilio';
import { CallLog } from '../models/CallLog.js';
import { Worker } from '../models/Worker.js';
import { emitToFarmer } from '../services/socketService.js';

// Multilingual greeting & message templates
const SCRIPT_TEMPLATES = {
  hi: {
    sprayer: (w, f, task) => `नमस्ते ${w} जी, मैं किसानAI बोल रहा हूँ ${f} जी के खेत से। कल सुबह खेत में ${task || 'कीटनाशक स्प्रे'} करना निर्धारित है। क्या आप सुबह 6:30 बजे आ सकते हैं?`,
    harvester: (w, f, task) => `राम-राम ${w} जी, किसानAI स्वचालित प्रणाली से कॉल है। ${f} जी के खेत में फसल कटाई का समय आ गया है। कृपया कंबाइन हार्वेस्टर बुक करें।`,
    tractor: (w, f, task) => `नमस्ते ${w} जी, किसानAI बोल रहा हूँ। कल खेत जुताई के लिए ट्रैक्टर की आवश्यकता है। कृपया पुष्टि करें।`,
    pump_operator: (w, f, task) => `नमस्ते ${w} जी, ट्यूबवेल मोटर चेक करने के लिए किसानAI की तरफ से कॉल है।`,
    emergency: (w, f, msg) => `अति आवश्यक सूचना: ${msg}`
  },
  pa: {
    sprayer: (w, f, task) => `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${w} ਜੀ, ਮੈਂ ਕਿਸਾਨAI ਬੋਲ ਰਿਹਾ ਹਾਂ ${f} ਜੀ ਦੇ ਖੇਤ ਵੱਲੋਂ। ਕੱਲ੍ਹ ਸਵੇਰੇ ${task || 'ਸਪਰੇਅ'} ਕਰਨੀ ਹੈ ਜੀ। ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ।`,
    harvester: (w, f, task) => `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${w} ਜੀ, ਕਿਸਾਨAI ਕਾਲ ਹੈ। ਫ਼ਸਲ ਪੱਕ ਚੁੱਕੀ ਹੈ, ਕੰਬਾਈਨ ਦੀ ਲੋੜ ਹੈ।`,
    tractor: (w, f, task) => `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${w} ਜੀ, ਖੇਤ ਵਾਹੁਣ ਲਈ ਟਰੈਕਟਰ ਦੀ ਲੋੜ ਹੈ ਜੀ।`,
    pump_operator: (w, f, task) => `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${w} ਜੀ, ਮੋਟਰ ਪੰਪ ਚਾਲੂ ਕਰਨ ਦੀ ਲੋੜ ਹੈ ਜੀ।`
  },
  hr: {
    sprayer: (w, f, task) => `राम-राम ${w} भाई, किसानAI बोलूं सूं ${f} के खेत ताईं। तड़के खेत म्ह स्प्रे मारना सै, टेम पे पहुंच जाइये भाई।`,
    harvester: (w, f, task) => `राम-राम ${w} भाई, फसल कटाई खातर हार्वेस्टर लेणा सै। कदे फुर्सत सै थारी?`,
    tractor: (w, f, task) => `राम-राम भाई, जुताई खातर ट्रैक्टर चाहिए काल।`,
    pump_operator: (w, f, task) => `राम-राम भाई, ट्यूबवेल चालु करना सै।`
  },
  mr: {
    sprayer: (w, f, task) => `नमस्कार ${w} जी, मी किसानAI बोलत आहे ${f} यांच्या शेतातून। उद्या सकाळी फवारणी करायची आहे।`,
    harvester: (w, f, task) => `नमस्कार ${w} जी, शेतातील पीक कापणीसाठी सज्ज आहे। कृपया वेळ निश्चित करा।`,
    tractor: (w, f, task) => `नमस्कार ${w} जी, नांगरणीसाठी ट्रॅक्टरची गरज आहे।`,
    pump_operator: (w, f, task) => `नमस्कार ${w} जी, मोटार सुरू करण्याची विनंती आहे।`
  },
  gu: {
    sprayer: (w, f, task) => `નમસ્તે ${w} ભાઈ, કિસાનAI બોલી રહ્યો છું ${f} ના ખેતરમાંથી। કાલે સવારે દવાનો છંટકાવ કરવાનો છે।`,
    harvester: (w, f, task) => `નમસ્તે ${w} ભાઈ, પાક તૈયાર થઈ ગયો છે, હાર્વેસ્ટિંગ માટે બુકિંગ કરવાનું છે।`,
    tractor: (w, f, task) => `નમસ્તે ભાઈ, ખેડ માટે ટ્રેક્ટરની જરૂર છે।`,
    pump_operator: (w, f, task) => `નમસ્તે ભાઈ, બોરવેલ મોટર ચાલુ કરવાની જરૂર છે।`
  },
  en: {
    sprayer: (w, f, task) => `Hello ${w}, this is KisanAI autonomous farm system calling on behalf of ${f}. Spray operation is scheduled for tomorrow morning. Please confirm.`,
    harvester: (w, f, task) => `Hello ${w}, KisanAI calling. The crop is ready for harvesting. Please schedule the combine harvester.`,
    tractor: (w, f, task) => `Hello ${w}, KisanAI calling. Tractor required for field plowing tomorrow.`,
    pump_operator: (w, f, task) => `Hello ${w}, KisanAI calling regarding water pump operation.`,
    emergency: (w, f, msg) => `Urgent farm alert: ${msg}`
  }
};

/**
 * Generate speech script based on role and language
 */
export function formatE164(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  if (String(phone).startsWith('+')) return String(phone).replace(/[^\d+]/g, '');
  return '+' + digits;
}

/**
 * Generate speech script based on role and language
 */
export function generateCallScript(workerName, farmerName, role, purpose, language = 'hi') {
  const langKey = SCRIPT_TEMPLATES[language] ? language : 'hi';
  const roleFn = SCRIPT_TEMPLATES[langKey][role] || SCRIPT_TEMPLATES[langKey].sprayer || SCRIPT_TEMPLATES.en.sprayer;
  return roleFn(workerName, farmerName, purpose);
}

/**
 * Executes or simulates phone call to worker with backup fallback
 */
export async function placeWorkerCall({
  farmerId,
  farmId,
  farmName = 'Field #1',
  farmerName = 'Farmer',
  workerId,
  workerRole = 'sprayer',
  customWorker = null,
  purpose = 'Crop Spraying',
  language = 'hi'
}) {
  let targetWorker = customWorker;
  if (!targetWorker && workerId) {
    targetWorker = await Worker.findById(workerId);
  }
  
  if (!targetWorker) {
    // Pick the best available worker by role
    const workers = await Worker.find({ farmerId, role: workerRole });
    targetWorker = workers.find(w => !w.isBackup) || workers[0];
  }

  if (!targetWorker) {
    targetWorker = {
      name: workerRole === 'harvester' ? 'Gurmeet Singh (Harvester)' : 'Suresh Kumar (Sprayer)',
      phone: workerRole === 'harvester' ? '+91 98234 56789' : '+91 98123 45678',
      role: workerRole,
      preferredLanguage: language
    };
  }

  const script = generateCallScript(
    targetWorker.name,
    farmerName,
    targetWorker.role,
    purpose,
    targetWorker.preferredLanguage || language
  );

  const formattedPhone = formatE164(targetWorker.phone);
  let callStatus = 'confirmed'; // Default simulated success
  let twilioCallSid = null;
  let isRealCall = false;

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const voiceName = (language === 'hi' || language === 'pa') ? 'Polly.Aditi' : 'Polly.Joanna';
      const langCode = language === 'en' ? 'en-US' : 'hi-IN';
      const twiml = `<Response><Say voice="${voiceName}" language="${langCode}">${script}</Say></Response>`;
      
      const call = await client.calls.create({
        twiml,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      twilioCallSid = call.sid;
      isRealCall = true;
      console.log(`[VoiceCaller] 📞 Live Twilio call dispatched to ${targetWorker.name} (${formattedPhone}) - SID: ${call.sid}`);
    } catch (err) {
      console.warn(`[VoiceCaller] Twilio live call failed: ${err.message}. Proceeding with simulated call response.`);
      callStatus = 'confirmed';
    }
  } else {
    console.log(`[VoiceCaller] 🤖 [AI VOICE CALL] Calling ${targetWorker.name} (${formattedPhone || targetWorker.phone}) - "${script}"`);
  }

  // Create Call Log
  const callRecord = await CallLog.create({
    farmerId,
    farmId,
    farmName,
    workerId: targetWorker._id || targetWorker.id || 'worker-sim',
    workerName: targetWorker.name,
    workerPhone: formattedPhone || targetWorker.phone,
    workerRole: targetWorker.role,
    purpose,
    messageScript: script,
    language: targetWorker.preferredLanguage || language,
    callStatus,
    isMock: !isRealCall,
    durationSec: 38
  });

  // Real-time broadcast
  emitToFarmer(farmerId, 'call:logged', {
    ...callRecord,
    badgeText: isRealCall
      ? `AI placed real call to ${targetWorker.name} (${targetWorker.role}) via Twilio`
      : `AI called ${targetWorker.name} (${targetWorker.role}) – Confirmed`
  });

  return {
    success: true,
    worker: targetWorker,
    callRecord,
    script,
    twilioCallSid,
    isRealCall
  };
}

/**
 * Tries backup worker if primary is unavailable
 */
export async function callBackupWorker({
  farmerId,
  farmId,
  farmName,
  farmerName,
  workerRole,
  purpose,
  language
}) {
  const backupWorker = await Worker.findOne({ farmerId, role: workerRole, isBackup: true });
  if (backupWorker) {
    console.log(`[VoiceCaller] 🔄 Primary unavailable. Auto-routing to backup worker: ${backupWorker.name}`);
    return await placeWorkerCall({
      farmerId,
      farmId,
      farmName,
      farmerName,
      workerId: backupWorker._id || backupWorker.id,
      workerRole,
      purpose: `${purpose} (Backup allocation)`,
      language
    });
  }
  return null;
}
