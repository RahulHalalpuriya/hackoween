import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'हिन्दी', region: 'Hindi' },
  { code: 'en', label: 'English', region: 'Global' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', region: 'Punjabi' },
  { code: 'hr', label: 'हरियाणवी', region: 'Haryanvi Hindi' },
  { code: 'mr', label: 'मराठी', region: 'Marathi' },
  { code: 'gu', label: 'ગુજરાતી', region: 'Gujarati' },
  { code: 'bn', label: 'বাংলা', region: 'Bengali' },
  { code: 'ta', label: 'தமிழ்', region: 'Tamil' },
  { code: 'te', label: 'తెలుగు', region: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', region: 'Kannada' },
  { code: 'ur', label: 'اردو', region: 'Urdu' }
];

const resources = {
  en: {
    translation: {
      appName: 'KisanAI',
      appSubtitle: 'Autonomous Farm Operations System',
      sdgTagline: 'SDG 2: Zero Hunger • SDG 12: Responsible Consumption • SDG 13: Climate Action',
      navbar: {
        runDemo: 'Run 2-Min Demo',
        emergencyStop: 'EMERGENCY STOP',
        resumeAll: 'RESUME OPERATIONS',
        voiceAI: 'Voice Assistant',
        schemes: 'Govt Schemes',
        mandi: 'Mandi Rates',
        finances: 'Finances & SDG',
        diseaseScanner: 'Leaf Doctor',
        logout: 'Logout',
        autoMode: 'Autonomous Mode',
        askMeMode: 'Ask Me First Mode',
        elderlyMode: 'Large Font'
      },
      dashboard: {
        welcome: 'Welcome, {{name}}',
        village: 'Location: {{village}}, {{district}}',
        allFarmsOverview: 'Your Autonomous Farms',
        addFarm: '+ Add Another Farm',
        agentStatus: 'Agent Status: Actively Monitoring 24/7',
        liveSensorData: 'Real-Time Soil & Climate Telemetry'
      },
      weather: {
        title: 'Farm Climate & 72h Forecast',
        currentTemp: 'Current Temperature',
        humidity: 'Air Humidity',
        wind: 'Wind Velocity',
        rainProb24h: '24h Rain Probability',
        forecast3d: '3-Day Agricultural Outlook',
        safeToSpray: 'Wind is calm: Safe for foliar spray',
        unsafeToSpray: 'High wind or rain: Spray postponed automatically'
      },
      farmCard: {
        soilMoisture: 'Soil Moisture',
        health: 'Crop Health',
        stage: 'Growth Stage',
        motor: 'Tubewell Pump',
        motorOn: 'Motor Running (ON)',
        motorOff: 'Motor Idle (OFF)',
        nextAction: 'Next AI Action',
        waterSaved: 'Water Saved',
        viewDetails: 'Open Field Operations →'
      },
      agentFeed: {
        title: 'Agent Activity Live Stream',
        subtitle: 'Autonomous OBSERVE → REASON → PLAN → ACT → REPORT cycle',
        triggerNow: 'Evaluate All Fields Now',
        planChanged: 'Autonomous Plan Modified',
        reason: 'Why AI changed this:',
        callRecord: 'Voice Call Placed to Worker'
      },
      disease: {
        title: 'AI Crop Leaf Pathology Doctor',
        subtitle: 'Upload a leaf photo or pick infected sample for instant diagnosis and automated spray booking',
        analyzing: 'Vision AI Analyzing Leaf Pathogens...',
        diagnosis: 'Diagnosis Result',
        confidence: 'Confidence Score',
        treatment: 'Prescribed Treatment Plan',
        bookSpray: 'Auto-Schedule Treatment Spray'
      },
      voice: {
        listening: 'Listening to your voice...',
        speakPrompt: 'Tap microphone and ask: "Mere gehun mein kab pani dena hai?"',
        aiSpeaking: 'KisanAI Speaking...',
        sampleQueries: 'Sample Questions to Ask:'
      },
      demoModal: {
        title: '⚡ Hackathon Demo Scenario (2-Minute Autonomous Reaction)',
        desc: 'Simulates a sudden monsoon weather storm event (92% rain forecast). Watch KisanAI immediately cancel tubewell irrigation, reschedule chemical spray, place an autonomous phone call to the sprayer worker, and optimize resources across all 3 fields!',
        launch: 'Trigger Monsoon Storm Event Now',
        running: 'Autonomous AI Agent Reacting in Real-Time...'
      }
    }
  },
  hi: {
    translation: {
      appName: 'किसानAI',
      appSubtitle: 'स्वायत्त कृषि संचालन प्रणाली',
      sdgTagline: 'एसडीजी 2: भुखमरी मुक्ति • एसडीजी 12: संधारणीय उपभोग • एसडीजी 13: जलवायु कार्रवाई',
      navbar: {
        runDemo: '2-मिनट डेमो चलाएं',
        emergencyStop: 'आपातकालीन रोक (STOP)',
        resumeAll: 'पुनः चालू करें',
        voiceAI: 'आवाज़ सहायक (बोलें)',
        schemes: 'सरकारी योजनाएं',
        mandi: 'मंडी भाव',
        finances: 'खर्च व एसडीजी प्रभाव',
        diseaseScanner: 'फसल रोग जांच',
        logout: 'लॉगआउट',
        autoMode: 'ऑटो पायलट (स्वयं निर्णय)',
        askMeMode: 'मुझसे पूछकर करें',
        elderlyMode: 'बड़ा फ़ॉन्ट'
      },
      dashboard: {
        welcome: 'राम-राम, {{name}} जी',
        village: 'स्थान: {{village}}, {{district}}',
        allFarmsOverview: 'आपके पंजीकृत खेत',
        addFarm: '+ नया खेत जोड़ें',
        agentStatus: 'एजेंट स्थिति: 24 घंटे लगातार निगरानी चालू',
        liveSensorData: 'सजीव मिट्टी नमी एवं मौसम सेंसर'
      },
      weather: {
        title: 'खेत का मौसम एवं 72 घंटे का पूर्वानुमान',
        currentTemp: 'तापमान',
        humidity: 'हवा में नमी',
        wind: 'हवा की गति',
        rainProb24h: 'अगले 24 घंटे में वर्षा संभावना',
        forecast3d: '3-दिवसीय कृषि पूर्वानुमान',
        safeToSpray: 'हवा शांत है: कीटनाशक स्प्रे के लिए सुरक्षित',
        unsafeToSpray: 'तेज हवा या बारिश की संभावना: स्प्रे स्वतः स्थगित'
      },
      farmCard: {
        soilMoisture: 'मिट्टी की नमी',
        health: 'फसल स्वास्थ्य',
        stage: 'विकास चरण',
        motor: 'ट्यूबवेल मोटर',
        motorOn: 'मोटर चालू है (ON)',
        motorOff: 'मोटर बंद है (OFF)',
        nextAction: 'AI का अगला कदम',
        waterSaved: 'भूजल बचत',
        viewDetails: 'खेत का पूरा विवरण देखें →'
      },
      agentFeed: {
        title: 'AI एजेंट गतिविधि लाइव स्ट्रीम',
        subtitle: 'निरीक्षण → कारण → योजना → क्रियान्वयन → रिपोर्ट चक्र',
        triggerNow: 'अभी खेत का जायजा लें',
        planChanged: 'AI द्वारा योजना में बदलाव',
        reason: 'बदलाव का कारण:',
        callRecord: 'श्रमिक/ठेकेदार को कॉल किया गया'
      },
      disease: {
        title: 'AI पत्ता रोग चिकित्सक (लीफ डॉक्टर)',
        subtitle: 'पत्ते की फोटो खींचें या चुनें, AI तुरंत रोग पहचानकर इलाज तय करेगा',
        analyzing: 'AI पत्ते के रोग की जांच कर रहा है...',
        diagnosis: 'रोग निदान परिणाम',
        confidence: 'सटीकता प्रतिशत',
        treatment: 'अनुशंसित उपचार योजना',
        bookSpray: 'उपचार स्प्रे स्वतः बुक करें'
      },
      voice: {
        listening: 'आपकी आवाज़ सुनी जा रही है...',
        speakPrompt: 'माइक दबाकर बोलें: "मेरे गेहूं में कब पानी देना है?"',
        aiSpeaking: 'किसानAI बोल रहा है...',
        sampleQueries: 'आप ये पूछ सकते हैं:'
      },
      demoModal: {
        title: '⚡ हैकाथॉन डेमो परिदृश्य (2-मिनट त्वरित AI प्रतिक्रिया)',
        desc: 'अचानक मौसम में 92% भारी बारिश की चेतावनी आती है। देखें किसानAI कैसे तुरंत चल रही मोटर बंद करता है, कल का स्प्रे रद्द करता है, स्प्रेयर को फ़ोन कॉल करके सूचना देता है और तीनों खेतों का नया टाइमटेबल बनाता है!',
        launch: 'भारी बारिश का परिदृश्य शुरू करें',
        running: 'AI एजेंट वास्तविक समय में निर्णय ले रहा है...'
      }
    }
  },
  pa: {
    translation: {
      appName: 'ਕਿਸਾਨAI',
      appSubtitle: 'ਆਟੋਨੋਮਸ ਖੇਤੀਬਾੜੀ ਸਿਸਟਮ',
      sdgTagline: 'SDG 2: ਭੁੱਖਮਰੀ ਖ਼ਾਤਮਾ • SDG 12: ਜ਼ਿੰਮੇਵਾਰ ਖਪਤ • SDG 13: ਜਲਵਾਯੂ ਕਾਰਵਾਈ',
      navbar: {
        runDemo: '2-ਮਿੰਟ ਡੈਮੋ ਚਲਾਓ',
        emergencyStop: 'ਐਮਰਜੈਂਸੀ ਰੋਕ',
        resumeAll: 'ਮੁੜ ਚਾਲੂ ਕਰੋ',
        voiceAI: 'ਆਵਾਜ਼ ਸਹਾਇਕ',
        schemes: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
        mandi: 'ਮੰਡੀ ਭਾਅ',
        finances: 'ਖ਼ਰਚਾ ਤੇ ਬੱਚਤ',
        diseaseScanner: 'ਫ਼ਸਲ ਬਿਮਾਰੀ ਜਾਂਚ',
        logout: 'ਲਾਗਆਉਟ',
        autoMode: 'ਆਟੋ ਮੋਡ',
        askMeMode: 'ਪਹਿਲਾਂ ਪੁੱਛੋ',
        elderlyMode: 'ਵੱਡਾ ਫ਼ੌਂਟ'
      },
      dashboard: {
        welcome: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, {{name}} ਜੀ',
        village: 'ਪਿੰਡ: {{village}}, {{district}}',
        allFarmsOverview: 'ਤੁਹਾਡੇ ਖੇਤ',
        addFarm: '+ ਨਵਾਂ ਖੇਤ ਜੋੜੋ',
        agentStatus: 'ਏਜੰਟ: 24 ਘੰਟੇ ਨਿਗਰਾਨੀ ਚਾਲੂ',
        liveSensorData: 'ਜ਼ਮੀਨ ਦੀ ਨਮੀ ਤੇ ਮੌਸਮ'
      },
      weather: {
        title: 'ਖੇਤ ਦਾ ਮੌਸਮ ਤੇ 72 ਘੰਟੇ ਦੀ ਭਵਿੱਖਬਾਣੀ',
        currentTemp: 'ਤਾਪਮਾਨ',
        humidity: 'ਨਮੀ',
        wind: 'ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ',
        rainProb24h: '24 ਘੰਟਿਆਂ ਵਿੱਚ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ',
        forecast3d: '3-ਦਿਨਾਂ ਮੌਸਮ ਰਿਪੋਰਟ',
        safeToSpray: 'ਹਵਾ ਸ਼ਾਂਤ ਹੈ: ਸਪਰੇਅ ਲਈ ਸੁਰੱਖਿਅਤ',
        unsafeToSpray: 'ਮੀਂਹ ਜਾਂ ਤੇਜ਼ ਹਵਾ: ਸਪਰੇਅ ਰੱਦ'
      },
      farmCard: {
        soilMoisture: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
        health: 'ਫ਼ਸਲ ਦੀ ਹਾਲਤ',
        stage: 'ਵਾਧੇ ਦਾ ਪੜਾਅ',
        motor: 'ਟਿਊਬਵੈੱਲ ਮੋਟਰ',
        motorOn: 'ਮੋਟਰ ਚੱਲ ਰਹੀ ਹੈ',
        motorOff: 'ਮੋਟਰ ਬੰਦ ਹੈ',
        nextAction: 'AI ਦਾ ਅਗਲਾ ਕਦਮ',
        waterSaved: 'ਪਾਣੀ ਦੀ ਬੱਚਤ',
        viewDetails: 'ਖੇਤ ਦਾ ਪੂਰਾ ਵੇਰਵਾ →'
      },
      agentFeed: {
        title: 'AI ਏਜੰਟ ਲਾਈਵ ਫੀਡ',
        subtitle: 'ਨਿਗਰਾਨੀ → ਸੋਚ-ਵਿਚਾਰ → ਯੋਜਨਾ → ਕਾਰਵਾਈ',
        triggerNow: 'ਹੁਣੇ ਜਾਇਜ਼ਾ ਲਵੋ',
        planChanged: 'ਯੋਜਨਾ ਬਦਲੀ ਗਈ',
        reason: 'ਕਾਰਨ:',
        callRecord: 'ਵਰਕਰ ਨੂੰ ਕਾਲ ਕੀਤੀ ਗਈ'
      },
      disease: {
        title: 'ਪੱਤਾ ਰੋਗ ਜਾਂਚ (ਲੀਫ ਡਾਕਟਰ)',
        subtitle: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਵੋ, AI ਤੁਰੰਤ ਇਲਾਜ ਦੱਸੇਗਾ',
        analyzing: 'ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
        diagnosis: 'ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ',
        confidence: 'ਸਹੀ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ',
        treatment: 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤਾ ਇਲਾਜ',
        bookSpray: 'ਸਪਰੇਅ ਬੁੱਕ ਕਰੋ'
      },
      voice: {
        listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...',
        speakPrompt: 'ਮਾਈਕ ਦਬਾਓ: "ਮੇਰੇ ਝੋਨੇ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਹੈ?"',
        aiSpeaking: 'ਕਿਸਾਨAI ਬੋਲ ਰਿਹਾ ਹੈ...',
        sampleQueries: 'ਪੁੱਛਣ ਲਈ ਸੁਝਾਅ:'
      },
      demoModal: {
        title: '⚡ 2-ਮਿੰਟ ਡੈਮੋ (ਅਚਾਨਕ ਮੀਂਹ ਦੀ ਚਿਤਾਵਨੀ)',
        desc: 'ਵੇਖੋ ਕਿਵੇਂ ਕਿਸਾਨAI ਭਾਰੀ ਮੀਂਹ ਵੇਖਦਿਆਂ ਹੀ ਮੋਟਰ ਬੰਦ ਕਰਦਾ ਹੈ, ਸਪਰੇਅ ਟਾਲਦਾ ਹੈ ਅਤੇ ਵਰਕਰ ਨੂੰ ਆਪ ਫ਼ੋਨ ਲਗਾਉਂਦਾ ਹੈ!',
        launch: 'ਡੈਮੋ ਸ਼ੁਰੂ ਕਰੋ',
        running: 'ਏਜੰਟ ਫ਼ੈਸਲੇ ਲੈ ਰਿਹਾ ਹੈ...'
      }
    }
  },
  hr: {
    translation: {
      appName: 'किसानAI',
      appSubtitle: 'हरियाणवी किसान खातर स्मार्ट सिस्टम',
      sdgTagline: 'SDG 2: जीरो भूख • SDG 12: सही इस्तेमाल • SDG 13: पर्यावरण बचाओ',
      navbar: {
        runDemo: '2-मिनट डेमो चलाओ',
        emergencyStop: 'आपातकालीन रोक',
        resumeAll: 'फेरा चालू करो',
        voiceAI: 'बोल के पूछो',
        schemes: 'सरकारी स्कीम',
        mandi: 'मंडी के भाव',
        finances: 'खर्चा अर बचत',
        diseaseScanner: 'रोग डॉक्टर',
        logout: 'लॉगआउट',
        autoMode: 'ऑटो पायलट मोड',
        askMeMode: 'पहल्यां पूछो',
        elderlyMode: 'बड़ा अक्षर'
      },
      dashboard: {
        welcome: 'राम-राम, {{name}} भाई',
        village: 'गाम: {{village}}, {{district}}',
        allFarmsOverview: 'थारे खेत',
        addFarm: '+ और खेत जोड़ो',
        agentStatus: 'सिस्टम: 24 घंटे खेत सम्भालण लाग रह्या सै',
        liveSensorData: 'जमीन की नमी अर मौसम'
      },
      weather: {
        title: 'खेत का मौसम अर 72 घंटे का हाल',
        currentTemp: 'तापमान',
        humidity: 'नमी',
        wind: 'हवा की रफ़्तार',
        rainProb24h: '24 घंटे म्ह मींह की आस',
        forecast3d: '3 दिन का मौसम',
        safeToSpray: 'हवा मंदी सै: स्प्रे करण का सही टेम सै',
        unsafeToSpray: 'मींह आवण आला सै: स्प्रे रोक दिया'
      },
      farmCard: {
        soilMoisture: 'जमीन की नमी',
        health: 'फसल का हाल',
        stage: 'बढ़वार का टेम',
        motor: 'ट्यूबवेल मोटर',
        motorOn: 'मोटर चालू सै (ON)',
        motorOff: 'मोटर बंद सै (OFF)',
        nextAction: 'AI का अगला काम',
        waterSaved: 'बचाय्या पाणी',
        viewDetails: 'खेत का ब्यौरा देखो →'
      },
      agentFeed: {
        title: 'किसानAI की सीधी गतिविधि',
        subtitle: 'देखणा → सोचना → तैय करना → काम निपटाणा',
        triggerNow: 'इब्बै खेत जांचो',
        planChanged: 'प्लान बदल दिया',
        reason: 'क्यूंकर बदला:',
        callRecord: 'मजदूर ताईं कॉल कर दी'
      },
      disease: {
        title: 'पत्ता रोग डॉक्टर',
        subtitle: 'पत्ते की फोटो खींचो, सिस्टम तुरन्त दवाई बतावेगा',
        analyzing: 'पत्ते की जांच चाल्लै सै...',
        diagnosis: 'रोग का नाम',
        confidence: 'सटीक परिणाम',
        treatment: 'दवाई अर इलाज',
        bookSpray: 'स्प्रे खातर बन्दा बुलाओ'
      },
      voice: {
        listening: 'सुणूं सूं भाई...',
        speakPrompt: 'माइक दबा के पूछो: "गेहूं म्ह पाणी कद देणा सै भाई?"',
        aiSpeaking: 'किसानAI बोलै सै...',
        sampleQueries: 'यूं पूछ सको सो:'
      },
      demoModal: {
        title: '⚡ हैकाथॉन डेमो (तेज मींह का परिदृश्य)',
        desc: 'अचानक 92% मींह की चेतावनी आवै सै। देखो किसानAI ट्यूबवेल मोटर बंद करै सै, स्प्रे रोकै सै अर स्प्रे आले न काल लगावै सै!',
        launch: 'डेमो चालू करो',
        running: 'सिस्टम काम करण लाग रह्या सै...'
      }
    }
  },
  mr: {
    translation: {
      appName: 'किसानAI',
      appSubtitle: 'स्वायत्त शेती व्यवस्थापन प्रणाली',
      sdgTagline: 'SDG 2: भूकमोक्ष • SDG 12: शाश्वत उपभोग • SDG 13: हवामान कृती',
      navbar: {
        runDemo: '२-मिनिट डेमो सुरू करा',
        emergencyStop: 'तातडीची थांबवा (STOP)',
        resumeAll: 'पुन्हा सुरू करा',
        voiceAI: 'आवाज सहाय्यक',
        schemes: 'शासकीय योजना',
        mandi: 'बाजार भाव',
        finances: 'खर्च व नफा',
        diseaseScanner: 'पीक रोग तपासणी',
        logout: 'लॉगआउट',
        autoMode: 'ऑटो पायलट',
        askMeMode: 'मला आधी विचारा',
        elderlyMode: 'मोठा फॉन्ट'
      },
      dashboard: {
        welcome: 'नमस्कार, {{name}} जी',
        village: 'गाव: {{village}}, {{district}}',
        allFarmsOverview: 'तुमची शेतं',
        addFarm: '+ नवीन शेत जोडा',
        agentStatus: 'एजंट २४ तास देखरेख करत आहे',
        liveSensorData: 'मातीची ओलावा व हवामान सेन्सर्स'
      },
      weather: {
        title: 'शेतातील हवामान व अंदाज',
        currentTemp: 'तापमान',
        humidity: 'आर्द्रता',
        wind: 'वाऱ्याचा वेग',
        rainProb24h: '२४ तासांत पावसाची शक्यता',
        forecast3d: '३ दिवसांचा अंदाज',
        safeToSpray: 'वारा शांत: फवारणीसाठी योग्य वेळ',
        unsafeToSpray: 'पावसाची शक्यता: फवारणी पुढे ढकलली'
      },
      farmCard: {
        soilMoisture: 'मातीतील ओलावा',
        health: 'पिकाचे आरोग्य',
        stage: 'वाढीचा टप्पा',
        motor: 'पाण्याची मोटर',
        motorOn: 'मोटर चालू आहे',
        motorOff: 'मोटर बंद आहे',
        nextAction: 'पुढील AI कृती',
        waterSaved: 'पाण्याची बचत',
        viewDetails: 'तपशील पहा →'
      },
      agentFeed: {
        title: 'AI एजंट थेट प्रवाह',
        subtitle: 'निरीक्षण → विचार → नियोजन → कृती',
        triggerNow: 'आता तपासणी करा',
        planChanged: 'नियोजनातील बदल',
        reason: 'बदलाचे कारण:',
        callRecord: 'कामगाराला कॉल केला'
      },
      disease: {
        title: 'पीक रोग डॉक्टर',
        subtitle: 'पानाचा फोटो अपलोड करा, त्वरित औषध योजना मिळवा',
        analyzing: 'तपासणी सुरू आहे...',
        diagnosis: 'रोगाचे नाव',
        confidence: 'अचूकता',
        treatment: 'उपाययोजना',
        bookSpray: 'फवारणी नियोजित करा'
      },
      voice: {
        listening: 'ऐकत आहे...',
        speakPrompt: 'माइक दाबा: "माझ्या गव्हाला कधी पाणी द्यायचे?"',
        aiSpeaking: 'किसानAI बोलत आहे...',
        sampleQueries: 'उदाहरणे:'
      },
      demoModal: {
        title: '⚡ २-मिनिट डेमो (अचानक पाऊस)',
        desc: 'अचानक पाऊस आल्यावर सिंचन थांबवणे व फवारणी पुढे ढकलणे!',
        launch: 'डेमो सुरू करा',
        running: 'एजंट कार्यरत आहे...'
      }
    }
  },
  gu: {
    translation: {
      appName: 'કિસાનAI',
      appSubtitle: 'સ્વાયત્ત કૃષિ સંચાલન પ્રણાલી',
      sdgTagline: 'SDG 2: ભૂખમુક્તિ • SDG 12: જવાબદાર વપરાશ • SDG 13: આબોહવા સુરક્ષા',
      navbar: {
        runDemo: '૨-મિનિટ ડેમો ચલાવો',
        emergencyStop: 'ઇમરજન્સી રોક (STOP)',
        resumeAll: 'ફરી શરૂ કરો',
        voiceAI: 'અવાજ સહાયક',
        schemes: 'સરકારી યોજનાઓ',
        mandi: 'બજાર ભાવ',
        finances: 'ખર્ચ અને નફો',
        diseaseScanner: 'રોગ તપાસ',
        logout: 'લૉગઆઉટ',
        autoMode: 'ઓટો મોડ',
        askMeMode: 'મને પૂછીને કરો',
        elderlyMode: 'મોટા અક્ષરો'
      },
      dashboard: {
        welcome: 'નમસ્તે, {{name}} ભાઈ',
        village: 'ગામ: {{village}}, {{district}}',
        allFarmsOverview: 'તમારા ખેતરો',
        addFarm: '+ નવું ખેતર ઉમેરો',
        agentStatus: 'એજન્ટ ૨૪ કલાક નિરીક્ષણ કરી રહ્યું છે',
        liveSensorData: 'માટીનો ભેજ અને હવામાન'
      },
      weather: {
        title: 'ખેતરનું હવામાન અને ૭૨ કલાકની આગાહી',
        currentTemp: 'તાપમાન',
        humidity: 'ભેજ',
        wind: 'પવનની ઝડપ',
        rainProb24h: '૨૪ કલાકમાં વરસાદની શક્યતા',
        forecast3d: '૩ દિવસની આગાહી',
        safeToSpray: 'પવન શાંત છે: દવાનો છંટકાવ કરી શકાય',
        unsafeToSpray: 'વરસાદની શક્યતા: છંટકાવ મોકૂફ રાખ્યો'
      },
      farmCard: {
        soilMoisture: 'જમીનનો ભેજ',
        health: 'પાકની તંદુરસ્તી',
        stage: 'વિકાસનો તબક્કો',
        motor: 'મોટર પંપ',
        motorOn: 'મોટર ચાલુ છે',
        motorOff: 'મોટર બંધ છે',
        nextAction: 'AI નું આગલું પગલું',
        waterSaved: 'બચાવેલું પાણી',
        viewDetails: 'વિગતવાર જુઓ →'
      },
      agentFeed: {
        title: 'AI એજન્ટ લાઈવ પ્રવૃત્તિ',
        subtitle: 'અવલોકન → વિચાર → આયોજન → અમલ',
        triggerNow: 'હમણાં જ તપાસ કરો',
        planChanged: 'આયોજનમાં ફેરફાર',
        reason: 'ફેરફારનું કારણ:',
        callRecord: 'મજૂરને કૉલ કર્યો'
      },
      disease: {
        title: 'પાંદડા રોગ ડૉક્ટર',
        subtitle: 'પાંદડાનો ફોટો પાડો, AI તરત જ દવા જણાવશે',
        analyzing: 'તપાસ ચાલુ છે...',
        diagnosis: 'રોગનું નામ',
        confidence: 'ચોકસાઈ',
        treatment: 'ઉપચાર યોજના',
        bookSpray: 'છંટકાવ બુક કરો'
      },
      voice: {
        listening: 'સાંભળી રહ્યો છું...',
        speakPrompt: 'માઇક દબાવો: "મારા ઘઉંમાં ક્યારે પાણી આપવું?"',
        aiSpeaking: 'કિસાનAI બોલી રહ્યું છે...',
        sampleQueries: 'તમે પૂછી શકો છો:'
      },
      demoModal: {
        title: '⚡ ૨-મિનિટ ડેમો (અચાનક વરસાદ)',
        desc: 'વરસાદની આગાહી મળતાં જ પંપ બંધ કરવો અને છંટકાવ મોકૂફ કરવો!',
        launch: 'ડેમો શરૂ કરો',
        running: 'એજન્ટ કામ કરી રહ્યો છે...'
      }
    }
  },
  bn: {
    translation: {
      appName: 'কিষাণAI',
      appSubtitle: 'স্বয়ংক্রিয় কৃষি পরিচালনা ব্যবস্থা',
      sdgTagline: 'SDG 2: শূন্য ক্ষুধা • SDG 12: দায়িত্বশীল ব্যবহার • SDG 13: জলবায়ু পদক্ষেপ',
      navbar: {
        runDemo: '২-মিনিট ডেমো চালান',
        emergencyStop: 'জরুরী বিরতি',
        resumeAll: 'পুনরায় চালু করুন',
        voiceAI: 'ভয়েস সহকারী',
        schemes: 'সরকারি প্রকল্প',
        mandi: 'বাজার দর',
        finances: 'খরচ ও লাভ',
        diseaseScanner: 'রোগ নির্ণয়',
        logout: 'লগআউট',
        autoMode: 'অটো মোড',
        askMeMode: 'আমাকে জিজ্ঞেস করুন',
        elderlyMode: 'বড় ফন্ট'
      },
      dashboard: {
        welcome: 'নমস্কার, {{name}} বাবু',
        village: 'গ্রাম: {{village}}, {{district}}',
        allFarmsOverview: 'আপনার খামার',
        addFarm: '+ নতুন জমি যুক্ত করুন',
        agentStatus: 'এআই ২৪ ঘণ্টা নজরদারি করছে',
        liveSensorData: 'মাটির আর্দ্রতা ও আবহাওয়া'
      },
      weather: {
        title: 'খামারের আবহাওয়া ও পূর্বাভাস',
        currentTemp: 'তাপমাত্রা',
        humidity: 'আর্দ্রতা',
        wind: 'বাতাসের গতিবেগ',
        rainProb24h: '২৪ ঘণ্টায় বৃষ্টির সম্ভাবনা',
        forecast3d: '৩ দিনের পূর্বাভাস',
        safeToSpray: 'বাতাস শান্ত: স্প্রে করার উপযুক্ত সময়',
        unsafeToSpray: 'বৃষ্টির সম্ভাবনা: স্প্রে স্থগিত'
      },
      farmCard: {
        soilMoisture: 'মাটির আর্দ্রতা',
        health: 'ফসলের স্বাস্থ্য',
        stage: 'বৃদ্ধির পর্যায়',
        motor: 'পাম্প মোটর',
        motorOn: 'মোটর চালু আছে',
        motorOff: 'মোটর বন্ধ আছে',
        nextAction: 'AI-এর পরবর্তী পদক্ষেপ',
        waterSaved: 'জল সাশ্রয়',
        viewDetails: 'বিস্তারিত দেখুন →'
      },
      agentFeed: {
        title: 'AI এজেন্ট লাইভ ফিড',
        subtitle: 'পর্যবেক্ষণ → যুক্তি → পরিকল্পনা → পদক্ষেপ',
        triggerNow: 'এখনই মূল্যায়ন করুন',
        planChanged: 'পরিকল্পনা পরিবর্তন',
        reason: 'পরিবর্তনের কারণ:',
        callRecord: 'কর্মীকে ফোন করা হয়েছে'
      },
      disease: {
        title: 'ফসলের রোগ চিকিৎসক',
        subtitle: 'পাতার ছবি আপলোড করুন, এআই সমাধান দেবে',
        analyzing: 'বিশ্লেষণ চলছে...',
        diagnosis: 'রোগের নাম',
        confidence: 'নির্ভুলতা',
        treatment: 'চিকিৎসা পরিকল্পনা',
        bookSpray: 'স্প্রে নির্ধারণ করুন'
      },
      voice: {
        listening: 'শুনছি...',
        speakPrompt: 'মাইক টিপুন: "আমার গমে কবে জল দিতে হবে?"',
        aiSpeaking: 'কিষাণAI বলছে...',
        sampleQueries: 'প্রশ্ন করতে পারেন:'
      },
      demoModal: {
        title: '⚡ ২-মিনিটের ডেমো (বৃষ্টির পরিস্থিতি)',
        desc: 'হঠাৎ বৃষ্টির পূর্বাভাসের সাথে সাথে এআই কীভাবে সিদ্ধান্ত নেয় তা দেখুন!',
        launch: 'ডেমো শুরু করুন',
        running: 'এজেন্ট কাজ করছে...'
      }
    }
  },
  ta: {
    translation: {
      appName: 'கிசான்AI',
      appSubtitle: 'தன்னாட்சி பண்ணை செயல்பாட்டு அமைப்பு',
      sdgTagline: 'SDG 2: பசியின்மை • SDG 12: பொறுப்பான பயன்பாடு • SDG 13: காலநிலை நடவடிக்கை',
      navbar: {
        runDemo: '2-நிமிட டெமோவை இயக்கவும்',
        emergencyStop: 'அவசர நிறுத்தம்',
        resumeAll: 'மீண்டும் தொடங்குக',
        voiceAI: 'குரல் உதவியாளர்',
        schemes: 'அரசு திட்டங்கள்',
        mandi: 'சந்தை விலை',
        finances: 'செலவு மற்றும் சேமிப்பு',
        diseaseScanner: 'பயிர் நோய் கண்டறிதல்',
        logout: 'வெளியேறு',
        autoMode: 'தானியங்கி முறை',
        askMeMode: 'என்னிடம் கேளுங்கள்',
        elderlyMode: 'பெரிய எழுத்து'
      },
      dashboard: {
        welcome: 'வணக்கம், {{name}} அவர்களே',
        village: 'இடம்: {{village}}, {{district}}',
        allFarmsOverview: 'உங்கள் பண்ணைகள்',
        addFarm: '+ புதிய பண்ணை சேர்க்க',
        agentStatus: 'AI 24 மணி நேரமும் கண்காணிக்கிறது',
        liveSensorData: 'மண் ஈரப்பதம் மற்றும் காலநிலை'
      },
      weather: {
        title: 'பண்ணை வானிலை & 72 மணி நேர முன்னறிவிப்பு',
        currentTemp: 'வெப்பநிலை',
        humidity: 'ஈரப்பதம்',
        wind: 'காற்றின் வேகம்',
        rainProb24h: '24 மணி நேர மழை வாய்ப்பு',
        forecast3d: '3-நாள் வானிலை அறிக்கை',
        safeToSpray: 'காற்று மிதமானது: தெளிக்க உகந்தது',
        unsafeToSpray: 'மழை எச்சரிக்கை: தெளிப்பு ஒத்திவைக்கப்பட்டது'
      },
      farmCard: {
        soilMoisture: 'மண் ஈரப்பதம்',
        health: 'பயிர் நலம்',
        stage: 'வளர்ச்சி நிலை',
        motor: 'மோட்டார் பம்ப்',
        motorOn: 'மோட்டார் இயங்குகிறது',
        motorOff: 'மோட்டார் நிறுத்தப்பட்டது',
        nextAction: 'அடுத்த AI நடவடிக்கை',
        waterSaved: 'சேமிக்கப்பட்ட நீர்',
        viewDetails: 'முழு விவரங்கள் →'
      },
      agentFeed: {
        title: 'AI நேரலை நடவடிக்கைகள்',
        subtitle: 'கவனிப்பு → பகுப்பாய்வு → திட்டமிடல் → செயல்பாடு',
        triggerNow: 'இப்போதே மதிப்பிடுக',
        planChanged: 'திட்டம் மாற்றப்பட்டது',
        reason: 'காரணம்:',
        callRecord: 'பணியாளருக்கு அழைப்பு விடுக்கப்பட்டது'
      },
      disease: {
        title: 'பயிர் இலை மருத்துவர்',
        subtitle: 'இலை படத்தை பதிவேற்றுங்கள், AI தீர்வு வழங்கும்',
        analyzing: 'ஆராய்ச்சி நடைபெறுகிறது...',
        diagnosis: 'நோயின் பெயர்',
        confidence: 'துல்லியம்',
        treatment: 'சிகிச்சை திட்டம்',
        bookSpray: 'தெளிப்பு முன்பதிவு செய்க'
      },
      voice: {
        listening: 'கேட்கிறது...',
        speakPrompt: 'மைக் அழுத்தவும்: "எனது பயிருக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?"',
        aiSpeaking: 'கிசான்AI பேசுகிறது...',
        sampleQueries: 'மாதிரி கேள்விகள்:'
      },
      demoModal: {
        title: '⚡ 2-நிமிட டெமோ (திடீர் மழை காட்சி)',
        desc: 'மழை எச்சரிக்கை வந்தவுடன் பம்ப் நிறுத்தப்பட்டு தொழிலாளிக்கு தானாகவே அழைப்பு செல்லும்!',
        launch: 'டெமோவைத் தொடங்கு',
        running: 'AI செயல்படுகிறது...'
      }
    }
  },
  te: {
    translation: {
      appName: 'కిసాన్AI',
      appSubtitle: 'స్వయంప్రతిపత్తి వ్యవసాయ నిర్వహణ వ్యవస్థ',
      sdgTagline: 'SDG 2: ఆకలి నిర్మూలన • SDG 12: బాధ్యతాయుత వినియోగం • SDG 13: వాతావరణ చర్య',
      navbar: {
        runDemo: '2-నిమిషాల డెమో నడపండి',
        emergencyStop: 'అత్యవసర నిలుపుదల',
        resumeAll: 'మళ్లీ ప్రారంభించు',
        voiceAI: 'వాయిస్ అసిస్టెంట్',
        schemes: 'ప్రభుత్వ పథకాలు',
        mandi: 'మార్కెట్ ధరలు',
        finances: 'ఖర్చులు & పొదుపు',
        diseaseScanner: 'తెగుళ్ల నిర్ధారణ',
        logout: 'లాగౌట్',
        autoMode: 'ఆటో మోడ్',
        askMeMode: 'నన్ను అడగండి',
        elderlyMode: 'పెద్ద అక్షరాలు'
      },
      dashboard: {
        welcome: 'నమస్కారం, {{name}} గారు',
        village: 'గ్రామం: {{village}}, {{district}}',
        allFarmsOverview: 'మీ పొలాలు',
        addFarm: '+ మరో పొలం జోడించండి',
        agentStatus: 'AI 24 గంటల పర్యవేక్షణలో ఉంది',
        liveSensorData: 'నేల తేమ మరియు వాతావరణం'
      },
      weather: {
        title: 'వ్యవసాయ వాతావరణం & 72 గంటల అంచనా',
        currentTemp: 'ఉష్ణోగ్రత',
        humidity: 'తేమ',
        wind: 'గాలి వేగం',
        rainProb24h: '24 గంటల్లో వర్షం పడే అవకాశం',
        forecast3d: '3-రోజుల వాతావరణ సమాచారం',
        safeToSpray: 'గాలి నెమ్మదిగా ఉంది: మందు పిచికారీకి అనుకూలం',
        unsafeToSpray: 'వర్షం వచ్చే అవకాశం: పిచికారీ వాయిదా'
      },
      farmCard: {
        soilMoisture: 'నేలలో తేమ',
        health: 'పంట ఆరోగ్యం',
        stage: 'ఎదుగుదల దశ',
        motor: 'బోరుబావి మోటార్',
        motorOn: 'మోటార్ నడుస్తోంది',
        motorOff: 'మోటార్ ఆపబడింది',
        nextAction: 'తదుపరి AI చర్య',
        waterSaved: 'ఆదా చేసిన నీరు',
        viewDetails: 'పూర్తి వివరాలు చూడండి →'
      },
      agentFeed: {
        title: 'AI ప్రత్యక్ష కార్యకలాపాలు',
        subtitle: 'పరిశీలన → ఆలోచన → ప్రణాళిక → అమలు',
        triggerNow: 'ఇప్పుడే పరిశీలించు',
        planChanged: 'ప్రణాళిక మార్చబడింది',
        reason: 'కారణం:',
        callRecord: 'కూలీకి ఫోన్ కాల్ చేయబడింది'
      },
      disease: {
        title: 'పంట ఆకు డాక్టర్',
        subtitle: 'ఆకు ఫోటో తీయండి, AI తక్షణ చికిత్స సూచిస్తుంది',
        analyzing: 'పరిశీలిస్తోంది...',
        diagnosis: 'తెగులు పేరు',
        confidence: 'ఖచ్చితత్వం',
        treatment: 'చికిత్స ప్రణాళిక',
        bookSpray: 'పిచికారీ ఖరారు చేయండి'
      },
      voice: {
        listening: 'వింటోంది...',
        speakPrompt: 'మైక్ నొక్కండి: "నా పంటకు ఎప్పుడు నీరు పెట్టాలి?"',
        aiSpeaking: 'కిసాన్AI మాట్లాడుతోంది...',
        sampleQueries: 'అడగగలిగే ప్రశ్నలు:'
      },
      demoModal: {
        title: '⚡ 2-నిమిషాల డెమో (వర్షం హెచ్చరిక)',
        desc: 'వర్షం హెచ్చరిక రాగానే మోటార్ ఆపి, పిచికారీ వాయిదా వేసి కూలీకి ఫోన్ చేస్తుంది!',
        launch: 'డెమో ప్రారంభించు',
        running: 'AI పనిచేస్తోంది...'
      }
    }
  },
  kn: {
    translation: {
      appName: 'ಕಿಸಾನ್AI',
      appSubtitle: 'ಸ್ವಾಯತ್ತ ಕೃಷಿ ಕಾರ್ಯಾಚರಣೆ ವ್ಯವಸ್ಥೆ',
      sdgTagline: 'SDG 2: ಹಸಿವು ಮುಕ್ತ • SDG 12: ಜವಾಬ್ದಾರಿಯುತ ಬಳಕೆ • SDG 13: ಹವಾಮಾನ ಕ್ರಮ',
      navbar: {
        runDemo: '2-ನಿಮಿಷದ ಡೆಮೊ ಚಾಲನೆ',
        emergencyStop: 'ತುರ್ತು ನಿಲುಗಡೆ',
        resumeAll: 'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ',
        voiceAI: 'ಧ್ವನಿ ಸಹಾಯಕ',
        schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
        mandi: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
        finances: 'ಖರ್ಚು ಮತ್ತು ಉಳಿತಾಯ',
        diseaseScanner: 'ರೋಗ ಪತ್ತೆ',
        logout: 'ನಿರ್ಗಮಿಸಿ',
        autoMode: 'ಸ್ವಯಂಚಾಲಿತ ಕ್ರಮ',
        askMeMode: 'ನನ್ನನ್ನು ಕೇಳಿ',
        elderlyMode: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು'
      },
      dashboard: {
        welcome: 'ನಮಸ್ಕಾರ, {{name}} ಅವರೇ',
        village: 'ಊರು: {{village}}, {{district}}',
        allFarmsOverview: 'ನಿಮ್ಮ ಜಮೀನುಗಳು',
        addFarm: '+ ಇನ್ನೊಂದು ಜಮೀನು ಸೇರಿಸಿ',
        agentStatus: 'AI ಸದಾ ನಿಗಾ ಇರಿಸಿದೆ',
        liveSensorData: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಹವಾಮಾನ'
      },
      weather: {
        title: 'ಜಮೀನಿನ ಹವಾಮಾನ ಮತ್ತು ಮುನ್ಸೂಚನೆ',
        currentTemp: 'ತಾಪಮಾನ',
        humidity: 'ತೇವಾಂಶ',
        wind: 'ಗಾಳಿಯ ವೇಗ',
        rainProb24h: '24 ಗಂಟೆಯಲ್ಲಿ ಮಳೆ ಸಂಭವ',
        forecast3d: '3-ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
        safeToSpray: 'ಗಾಳಿ ಶಾಂತವಾಗಿದೆ: ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ',
        unsafeToSpray: 'ಮಳೆ ಸಂಭವ: ಸಿಂಪಡಣೆ ಮುಂದೂಡಲಾಗಿದೆ'
      },
      farmCard: {
        soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
        health: 'ಬೆಳೆಯ ಆರೋಗ್ಯ',
        stage: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
        motor: 'ಪಂಪ್ ಮೋಟರ್',
        motorOn: 'ಮೋಟರ್ ಆನ್ ಆಗಿದೆ',
        motorOff: 'ಮೋಟರ್ ಆಫ್ ಆಗಿದೆ',
        nextAction: 'ಮುಂದಿನ AI ಕ್ರಮ',
        waterSaved: 'ಉಳಿಸಿದ ನೀರು',
        viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ →'
      },
      agentFeed: {
        title: 'AI ಚಟುವಟಿಕೆ ಲೈವ್',
        subtitle: 'ವೀಕ್ಷಣೆ → ಆಲೋಚನೆ → ಯೋಜನೆ → ಕ್ರಮ',
        triggerNow: 'ಈಗಲೇ ಪರೀಕ್ಷಿಸಿ',
        planChanged: 'ಯೋಜನೆ ಬದಲಾಗಿದೆ',
        reason: 'ಕಾರಣ:',
        callRecord: 'ಕೆಲಸಗಾರರಿಗೆ ಕರೆ ಮಾಡಲಾಗಿದೆ'
      },
      disease: {
        title: 'ಬೆಳೆ ಎಲೆ ವೈದ್ಯ',
        subtitle: 'ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ, AI ಚಿಕಿತ್ಸೆ ಸೂಚಿಸುತ್ತದೆ',
        analyzing: 'ಪರೀಕ್ಷೆ ನಡೆಯುತ್ತಿದೆ...',
        diagnosis: 'ರೋಗದ ಹೆಸರು',
        confidence: 'ನಿಖರತೆ',
        treatment: 'ಔಷಧ ಯೋಜನೆ',
        bookSpray: 'ಸಿಂಪಡಣೆ ನಿಗದಿಪಡಿಸಿ'
      },
      voice: {
        listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...',
        speakPrompt: 'ಮೈಕ್ ಒತ್ತಿ: "ನನ್ನ ಬೆಳೆಗೆ ಯಾವಾಗ ನೀರು ಹಾಯಿಸಬೇಕು?"',
        aiSpeaking: 'ಕಿಸಾನ್AI ಮಾತನಾಡುತ್ತಿದೆ...',
        sampleQueries: 'ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು:'
      },
      demoModal: {
        title: '⚡ 2-ನಿಮಿಷದ ಡೆಮೊ (ಮಳೆಯ ಸನ್ನಿವೇಶ)',
        desc: 'ಮಳೆ ಬರುತ್ತಿದ್ದಂತೆ ಮೋಟರ್ ಆಫ್ ಮಾಡಿ ಕೆಲಸಗಾರರಿಗೆ ಕರೆ ಮಾಡುವ ಸ್ವಯಂಚಾಲಿತ AI!',
        launch: 'ಡೆಮೊ ಆರಂಭಿಸಿ',
        running: 'AI ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ...'
      }
    }
  },
  ur: {
    translation: {
      appName: 'کسانAI',
      appSubtitle: 'خود مختار زرعی نظام',
      sdgTagline: 'SDG 2: بھوک کا خاتمہ • SDG 12: پائیدار استعمال • SDG 13: ماحولیاتی تحفظ',
      navbar: {
        runDemo: '2 منٹ کا ڈیمو چلائیں',
        emergencyStop: 'ہنگامی روک تھام',
        resumeAll: 'دوبارہ شروع کریں',
        voiceAI: 'صوتی معاون',
        schemes: 'سرکاری اسکیمیں',
        mandi: 'منڈی کے نرخ',
        finances: 'اخراجات اور بچت',
        diseaseScanner: 'فصل کی بیماری کی تشخیص',
        logout: 'لاگ آؤٹ',
        autoMode: 'آٹو موڈ',
        askMeMode: 'مجھ سے پوچھیں',
        elderlyMode: 'بڑے حروف'
      },
      dashboard: {
        welcome: 'خوش آمدید، {{name}} صاحب',
        village: 'گاؤں: {{village}}, {{district}}',
        allFarmsOverview: 'آپ کے کھیت',
        addFarm: '+ نیا کھیت شامل کریں',
        agentStatus: 'اے آئی 24 گھنٹے نگرانی کر رہا ہے',
        liveSensorData: 'مٹی کی نمی اور موسم'
      },
      weather: {
        title: 'کھیت کا موسم اور 72 گھنٹے کی پیش گوئی',
        currentTemp: 'درجہ حرارت',
        humidity: 'نمی',
        wind: 'ہوا کی رفتار',
        rainProb24h: '24 گھنٹوں میں بارش کا امکان',
        forecast3d: '3 دن کی پیش گوئی',
        safeToSpray: 'ہوا پرسکون ہے: اسپرے کے لیے محفوظ',
        unsafeToSpray: 'بارش کا امکان: اسپرے ملتوی'
      },
      farmCard: {
        soilMoisture: 'مٹی کی نمی',
        health: 'فصل کی صحت',
        stage: 'نشوونما کا مرحلہ',
        motor: 'ٹیوب ویل موٹر',
        motorOn: 'موٹر چل رہی ہے',
        motorOff: 'موٹر بند ہے',
        nextAction: 'اگلا اے آئی اقدام',
        waterSaved: 'بچایا گیا پانی',
        viewDetails: 'مکمل تفصیلات دیکھیں →'
      },
      agentFeed: {
        title: 'اے آئی لائیو فیڈ',
        subtitle: 'مشاہدہ → غور و خوض → منصوبہ بندی → عمل',
        triggerNow: 'ابھی جائزہ لیں',
        planChanged: 'منصوبہ تبدیل کیا گیا',
        reason: 'وجہ:',
        callRecord: 'ورکر کو کال کی گئی'
      },
      disease: {
        title: 'فصل پتے کا معالج',
        subtitle: 'پتے کی تصویر اپ لوڈ کریں، اے آئی علاج بتائے گا',
        analyzing: 'تجزیہ ہو رہا ہے...',
        diagnosis: 'بیماری کا نام',
        confidence: 'درستگی',
        treatment: 'علاج کی تجویز',
        bookSpray: 'اسپرے بک کریں'
      },
      voice: {
        listening: 'سن رہا ہوں...',
        speakPrompt: 'مائیک دبائیں: "میری گندم کو کب پانی دینا ہے؟"',
        aiSpeaking: 'کسانAI بول رہا ہے...',
        sampleQueries: 'پوچھنے کے لیے سوالات:'
      },
      demoModal: {
        title: '⚡ 2 منٹ کا ڈیمو (بارش کی صورتحال)',
        desc: 'بارش کی اطلاع ملتے ہی ٹیوب ویل بند اور اسپرے کی تاریخ تبدیل کرنا!',
        launch: 'ڈیمو شروع کریں',
        running: 'اے آئی فیصلے کر رہا ہے...'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hi', // Default to Hindi, with instant switcher
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
