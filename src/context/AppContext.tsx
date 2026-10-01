import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Language,
  VoiceOrbState,
  ActiveScreenData,
  ConversationalContext,
  ConversationTurn,
  FarmerCropState,
  FarmerLocation,
  DemoScenario
} from '../types';
import { CROPS_DATA } from '../data/crops';
import { TRANSLATIONS, Translations } from '../utils/translations';
import { speakText, stopSpeaking, TapToTalkController } from '../utils/speech';
import { processConversationTurn } from '../utils/conversationEngine';
import { VERIFIED_MARKET_DATABASE } from '../data/liveMarketDatabase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: 'home' | 'markets' | 'ask' | 'schemes' | 'profile';
  setActiveTab: (tab: 'home' | 'markets' | 'ask' | 'schemes' | 'profile') => void;
  
  // Real-Time Voice Assistant State
  orbState: VoiceOrbState;
  isConversationLive: boolean;
  isMuted: boolean;
  liveTranscript: string;
  isPermissionError: boolean;
  activeScreenData: ActiveScreenData;
  conversationalContext: ConversationalContext;
  turnsHistory: ConversationTurn[];
  
  startLiveConversation: () => void;
  startTapToTalk: () => void;
  endLiveConversation: () => void;
  toggleMute: () => void;
  submitUtterance: (text: string) => Promise<void>;
  interruptSpeaking: () => void;
  playAudio: (text: string, id?: string) => void;
  stopAudio: () => void;
  isAudioPlaying: boolean;
  activeAudioId: string | null;
  
  // Legacy / Form Modals (secondary)
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isEntryModalOpen: boolean;
  setIsEntryModalOpen: (open: boolean) => void;
  
  // Farmer state & location
  cropState: FarmerCropState;
  setCropState: React.Dispatch<React.SetStateAction<FarmerCropState>>;
  detectLocation: () => Promise<void>;
  isDetectingLocation: boolean;
  loadDemoScenario: (scenario: DemoScenario) => void;
  
  t: Translations;
}

const defaultLocation: FarmerLocation = {
  village: 'Ashta Village Farm',
  mandal: 'Ashta Tehsil',
  district: 'Sehore',
  state: 'Madhya Pradesh',
  lat: 23.0208,
  lng: 76.7214,
  isDetected: false
};

const initialContext: ConversationalContext = {
  crop: 'Wheat',
  cropEmoji: '🌾',
  variety: 'Sharbati Lokwan',
  quantityKg: 5000,
  farmerLocation: defaultLocation,
  location: 'Ashta, Sehore, Madhya Pradesh',
  state: 'Madhya Pradesh',
  targetMarket: 'Sehore APMC Principal Market Yard',
  targetMarketPricePerKg: 25.5,
  transportVehicle: 'tractor_trolley',
  distanceKm: 43.2,
  distanceStatus: 'VERIFIED_ROAD',
  distanceLabel: 'Road distance',
  lastIntent: 'WELCOME',
  lastQuestion: '',
  activeScreenType: 'price_card'
};

const defaultInitialScreenData: ActiveScreenData = {
  type: 'price_card',
  cropName: 'Wheat',
  cropEmoji: '🌾',
  quantityKg: 5000,
  quantityQuintals: 50,
  farmerLocation: defaultLocation,
  location: 'Ashta, Sehore, Madhya Pradesh',
  targetMarketName: 'Sehore APMC Principal Market Yard',
  highlightTitle: 'CURRENT WHEAT PRICE',
  headlineMetric: '₹25.5/kg',
  headlineSubtext: 'Highest listed price at Sehore Principal Yard (Range: ₹23.5 - ₹25.5/kg)',
  markets: [
    {
      id: 'mkt-sehore',
      name: 'Sehore APMC Principal Market Yard',
      location: 'Main Mandi Road, Sehore, Madhya Pradesh',
      lat: 23.2032,
      lng: 77.0844,
      pricePerKg: 25.5,
      pricePerQuintal: 2550,
      distanceKm: 43.2,
      distanceStatus: 'VERIFIED_ROAD',
      distanceLabel: 'Road distance',
      distanceSource: 'OSRM / OpenStreetMap Road Routing API',
      isHighest: true,
      paymentTerms: 'Immediate RTGS / Bank Transfer',
      transportCost: 1120,
      transportFormula: '1 trip × (₹350 base + 43.2 km × ₹18/km) = ₹1,120',
      netInHandPerKg: 24.9,
      netTotalEarnings: 124480
    },
    {
      id: 'mkt-ashta',
      name: 'Ashta Sub-Market Haat Yard',
      location: 'Ashta Town Yard, Sehore, Madhya Pradesh',
      lat: 23.0210,
      lng: 76.7220,
      pricePerKg: 24.2,
      pricePerQuintal: 2420,
      distanceKm: 2.1,
      distanceStatus: 'VERIFIED_ROAD',
      distanceLabel: 'Road distance',
      distanceSource: 'OSRM / OpenStreetMap Road Routing API',
      paymentTerms: 'Spot Cash on Delivery',
      transportCost: 390,
      transportFormula: '1 trip × (₹350 base + 2.1 km × ₹18/km) = ₹390',
      netInHandPerKg: 23.9,
      netTotalEarnings: 119500
    },
    {
      id: 'mkt-farmgate',
      name: 'Farm Gate Private Buyer (Ashta)',
      location: 'Your Farm Gate (Ashta Village)',
      lat: 23.0208,
      lng: 76.7214,
      pricePerKg: 23.0,
      pricePerQuintal: 2300,
      distanceKm: 0,
      distanceStatus: 'VERIFIED_ROAD',
      distanceLabel: 'Road distance',
      distanceSource: 'Farm Gate (0 km pickup)',
      paymentTerms: 'Instant Cash at Farm Gate',
      transportCost: 0,
      transportFormula: '₹0 (Farm gate pickup)',
      netInHandPerKg: 23.0,
      netTotalEarnings: 115000
    }
  ],
  dataSource: 'Agmarknet APMC Daily Bulletin [Benchmark / Reference Data]',
  lastUpdated: 'Today, 06:30 AM IST (Agmarknet Feed)',
  isReferenceData: true
};

const defaultCropState: FarmerCropState = {
  crop: CROPS_DATA.find(c => c.id === 'wheat') || CROPS_DATA[0],
  variety: 'Sharbati Lokwan',
  quantityQuintals: 50,
  quantityKg: 5000,
  moisturePercentage: 11.8,
  harvestDaysAgo: 1,
  hasOnFarmStorage: false,
  preferredVehicle: 'tractor_trolley',
  location: defaultLocation
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'markets' | 'ask' | 'schemes' | 'profile'>('home');
  const [orbState, setOrbState] = useState<VoiceOrbState>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('Tap microphone and ask your question');
  const [isPermissionError, setIsPermissionError] = useState<boolean>(false);
  const [activeScreenData, setActiveScreenData] = useState<ActiveScreenData>(defaultInitialScreenData);
  const [conversationalContext, setConversationalContext] = useState<ConversationalContext>(initialContext);
  const [turnsHistory, setTurnsHistory] = useState<ConversationTurn[]>([]);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  // Modals & Legacy
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [cropState, setCropState] = useState<FarmerCropState>(defaultCropState);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const tapToTalkRef = useRef<TapToTalkController | null>(null);
  const resetErrorTimerRef = useRef<any>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const isConversationLive = orbState === 'listening' || orbState === 'understanding' || orbState === 'speaking';
  const isAudioPlaying = orbState === 'speaking';

  // Sync controller language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (tapToTalkRef.current) {
      tapToTalkRef.current.setLanguage(lang);
    }
  };

  const getIdlePrompt = (lang: Language) => {
    switch (lang) {
      case 'hi':
        return 'बोलने के लिए माइक दबाएं';
      case 'kn':
        return 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ';
      case 'te':
        return 'మాట్లాడటానికి మైక్ నొక్కండి';
      case 'ta':
        return 'பேச மைக்கை அழுத்தவும்';
      case 'mr':
        return 'बोलण्यासाठी माइक दाबा';
      default:
        return 'Tap microphone and ask your question';
    }
  };

  // Turn submission handler: synchronizes AI spoken response + on-screen updates
  const submitUtterance = async (userText: string) => {
    if (!userText.trim()) {
      setOrbState('idle');
      setLiveTranscript(getIdlePrompt(language));
      return;
    }

    // 1. Switch state to UNDERSTANDING (Processing)
    setOrbState('understanding');
    setLiveTranscript(`"${userText}"`);
    setIsPermissionError(false);

    const userTurn: ConversationTurn = {
      id: `turn-${Date.now()}`,
      role: 'farmer',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTurnsHistory(prev => [...prev, userTurn]);

    try {
      // 2. Call backend /api/voice-turn
      const response = await fetch('/api/voice-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUtterance: userText,
          language,
          context: conversationalContext
        })
      });

      let turnResult;
      if (response.ok) {
        turnResult = await response.json();
      } else {
        // Fallback to client conversation engine
        turnResult = processConversationTurn(userText, conversationalContext, language);
      }

      handleTurnResult(turnResult, userText);
    } catch {
      // Offline fallback
      const turnResult = processConversationTurn(userText, conversationalContext, language);
      handleTurnResult(turnResult, userText);
    }
  };

  const handleTurnResult = (turnResult: any, userText: string) => {
    const { voiceResponse, screenData, updatedContext, switchedLanguage } = turnResult;

    if (switchedLanguage) {
      setLanguage(switchedLanguage);
    }

    // 3. Update the screen simultaneously!
    setActiveScreenData(screenData);
    setConversationalContext(updatedContext);

    // Sync cropState if crop was changed/corrected
    const matchedCropObj = CROPS_DATA.find(c => c.name.toLowerCase().includes(updatedContext.crop.toLowerCase()));
    if (matchedCropObj) {
      setCropState(prev => ({
        ...prev,
        crop: matchedCropObj,
        quantityKg: updatedContext.quantityKg,
        quantityQuintals: Math.round(updatedContext.quantityKg / 100)
      }));
    }

    const aiTurn: ConversationTurn = {
      id: `turn-ai-${Date.now()}`,
      role: 'kisanmitra',
      text: voiceResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTurnsHistory(prev => [...prev, aiTurn]);

    // 4. Switch state to RESPONDING (Speaking) and speak aloud in farmer's language
    setOrbState('speaking');
    setLiveTranscript(voiceResponse);

    speakText(
      voiceResponse,
      switchedLanguage || language,
      () => {
        setOrbState('speaking');
      },
      () => {
        // 5. CRITICAL: When answer is completed, RETURN TO "Tap to Talk" (IDLE)!
        setOrbState('idle');
        setLiveTranscript(getIdlePrompt(switchedLanguage || language));
      }
    );
  };

  const interruptSpeaking = () => {
    stopSpeaking();
    setOrbState('idle');
    setLiveTranscript(getIdlePrompt(language));
  };

  // Clean initialization of TapToTalkController
  useEffect(() => {
    const handlers = {
      onListening: () => {
        setOrbState('listening');
        setLiveTranscript(t.listening || 'Listening...');
        setIsPermissionError(false);
      },
      onSpeechDetected: () => {
        setOrbState('listening');
      },
      onInterimText: (text: string) => {
        setLiveTranscript(`"${text}"`);
      },
      onSpeechEnd: (finalText: string) => {
        // End of speech detected! Stop listening and process question
        submitUtterance(finalText);
      },
      onError: (errorMessage: string, isPermission: boolean) => {
        setOrbState('error');
        setLiveTranscript(errorMessage);
        setIsPermissionError(isPermission);

        // Auto reset from error to idle after 4 seconds if not permission error
        if (resetErrorTimerRef.current) clearTimeout(resetErrorTimerRef.current);
        if (!isPermission) {
          resetErrorTimerRef.current = setTimeout(() => {
            setOrbState('idle');
            setLiveTranscript(getIdlePrompt(language));
          }, 4500);
        }
      },
      onReset: () => {
        setOrbState('idle');
        setLiveTranscript(getIdlePrompt(language));
      }
    };

    tapToTalkRef.current = new TapToTalkController(handlers, language);

    return () => {
      if (resetErrorTimerRef.current) clearTimeout(resetErrorTimerRef.current);
      if (tapToTalkRef.current) {
        tapToTalkRef.current.stop();
        tapToTalkRef.current = null;
      }
      stopSpeaking();
    };
  }, [language]);

  // Main Tap to Talk action
  const startTapToTalk = () => {
    if (resetErrorTimerRef.current) clearTimeout(resetErrorTimerRef.current);
    setIsPermissionError(false);

    // If currently speaking: interrupt and stop immediately
    if (orbState === 'speaking') {
      interruptSpeaking();
      return;
    }

    // If currently listening: stop listening and reset to idle
    if (orbState === 'listening') {
      if (tapToTalkRef.current) {
        tapToTalkRef.current.stop();
      }
      setOrbState('idle');
      setLiveTranscript(getIdlePrompt(language));
      return;
    }

    // If idle or error: start listening
    if (tapToTalkRef.current) {
      tapToTalkRef.current.setLanguage(language);
      tapToTalkRef.current.startListening();
    }
  };

  const startLiveConversation = startTapToTalk;

  const endLiveConversation = () => {
    if (tapToTalkRef.current) {
      tapToTalkRef.current.stop();
    }
    stopSpeaking();
    setOrbState('idle');
    setLiveTranscript(getIdlePrompt(language));
    setIsPermissionError(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      endLiveConversation();
    }
  };

  const playAudio = (text: string, id: string = 'general') => {
    setActiveAudioId(id);
    setOrbState('speaking');
    setLiveTranscript(text);
    speakText(
      text,
      language,
      () => setOrbState('speaking'),
      () => {
        setOrbState('idle');
        setActiveAudioId(null);
        setLiveTranscript(getIdlePrompt(language));
      }
    );
  };

  const stopAudio = () => {
    stopSpeaking();
    setActiveAudioId(null);
    setOrbState('idle');
    setLiveTranscript(getIdlePrompt(language));
  };

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
              if (res.ok) {
                const data = await res.json();
                const address = data.address || {};
                const district = address.state_district || address.county || address.city || 'Detected District';
                const state = address.state || 'India';
                setCropState(prev => ({
                  ...prev,
                  location: {
                    village: address.village || address.town || 'Farm Area',
                    mandal: address.county || district,
                    district,
                    state,
                    lat: latitude,
                    lng: longitude,
                    isDetected: true
                  }
                }));
                setConversationalContext(prev => ({
                  ...prev,
                  location: `${district}, ${state}`,
                  state
                }));
              }
            } catch {
              // fallback
            }
            setIsDetectingLocation(false);
          },
          () => setIsDetectingLocation(false),
          { timeout: 8000 }
        );
      } else {
        setIsDetectingLocation(false);
      }
    } catch {
      setIsDetectingLocation(false);
    }
  };

  const loadDemoScenario = (scenario: DemoScenario) => {
    const cropKey = scenario.cropName.toLowerCase().includes('tomato')
      ? 'tomato'
      : scenario.cropName.toLowerCase().includes('onion')
      ? 'onion'
      : scenario.cropName.toLowerCase().includes('wheat')
      ? 'wheat'
      : scenario.cropName.toLowerCase().includes('soybean')
      ? 'soybean'
      : scenario.cropName.toLowerCase().includes('cotton')
      ? 'cotton'
      : scenario.cropName.toLowerCase().includes('mustard')
      ? 'mustard'
      : 'paddy';

    const info = VERIFIED_MARKET_DATABASE[cropKey] || VERIFIED_MARKET_DATABASE.tomato;
    const qtyKg = scenario.quantityQuintals * 100;
    const matchedCrop = CROPS_DATA.find(c => c.name.toLowerCase().includes(info.name.toLowerCase())) || CROPS_DATA[0];

    const scenarioLocations: Record<string, { lat: number; lng: number; village: string; district: string; state: string }> = {
      'demo-mp-wheat': { lat: 23.0208, lng: 76.7214, village: 'Ashta', district: 'Sehore', state: 'Madhya Pradesh' },
      'demo-mh-soybean': { lat: 18.2514, lng: 76.5050, village: 'Ausa', district: 'Latur', state: 'Maharashtra' },
      'demo-ka-paddy': { lat: 15.7667, lng: 76.7667, village: 'Sindhanur', district: 'Raichur', state: 'Karnataka' },
      'demo-pb-basmati': { lat: 30.7063, lng: 76.2198, village: 'Khanna', district: 'Ludhiana', state: 'Punjab' },
      'demo-rj-mustard': { lat: 27.9300, lng: 76.6500, village: 'Khairthal', district: 'Alwar', state: 'Rajasthan' }
    };

    const resolvedGeo = scenarioLocations[scenario.id] || {
      lat: 23.0208,
      lng: 76.7214,
      village: scenario.region.split('/')[1]?.trim() || scenario.region,
      district: scenario.region.split('/')[0].trim(),
      state: scenario.state
    };

    const scenarioLocation: FarmerLocation = {
      village: resolvedGeo.village,
      mandal: `${resolvedGeo.village} Tehsil`,
      district: resolvedGeo.district,
      state: resolvedGeo.state,
      lat: resolvedGeo.lat,
      lng: resolvedGeo.lng,
      isDetected: false
    };

    setCropState({
      crop: matchedCrop,
      variety: scenario.variety,
      quantityQuintals: scenario.quantityQuintals,
      quantityKg: qtyKg,
      moisturePercentage: scenario.moisturePercentage,
      harvestDaysAgo: 1,
      hasOnFarmStorage: false,
      preferredVehicle: qtyKg > 3000 ? 'tractor_trolley' : 'pickup_truck',
      location: scenarioLocation
    });

    const highest = info.markets.find(m => m.isHighest) || info.markets[0];
    setConversationalContext({
      crop: info.name,
      cropEmoji: info.emoji,
      variety: scenario.variety,
      quantityKg: qtyKg,
      farmerLocation: scenarioLocation,
      location: `${resolvedGeo.village}, ${resolvedGeo.district}, ${resolvedGeo.state}`,
      state: resolvedGeo.state,
      targetMarket: highest.name,
      targetMarketPricePerKg: highest.pricePerKg,
      transportVehicle: qtyKg > 3000 ? 'tractor_trolley' : 'pickup_truck',
      distanceKm: null,
      lastIntent: 'DEMO_LOADED',
      lastQuestion: '',
      activeScreenType: 'market_comparison'
    });

    // Automatically trigger question for this crop
    submitUtterance(`What is the current price of ${info.name}?`);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        orbState,
        isConversationLive,
        isMuted,
        liveTranscript,
        isPermissionError,
        activeScreenData,
        conversationalContext,
        turnsHistory,
        startLiveConversation,
        startTapToTalk,
        endLiveConversation,
        toggleMute,
        submitUtterance,
        interruptSpeaking,
        playAudio,
        stopAudio,
        isAudioPlaying,
        activeAudioId,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isEntryModalOpen,
        setIsEntryModalOpen,
        cropState,
        setCropState,
        detectLocation,
        isDetectingLocation,
        loadDemoScenario,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
