import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import {
  Mic,
  Keyboard,
  Globe,
  ChevronDown,
  Volume2,
  RefreshCw,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Radio,
  X
} from 'lucide-react';

export const VoiceOrb: React.FC = () => {
  const {
    orbState,
    liveTranscript,
    startTapToTalk,
    endLiveConversation,
    submitUtterance,
    interruptSpeaking,
    language,
    setLanguage,
    isPermissionError,
    t
  } = useApp();

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const sampleConversationalPrompts = t.samplePrompts || [
    "What is today's tomato price?",
    "Which market has the highest price?",
    "How far is it?",
    "How much money will I get for 500 kg?",
    "What will I get after transport?",
    "Can I store tomatoes?",
    "What about the weather when I harvest?",
    "Show me buyers."
  ];

  const handleOrbClick = () => {
    if (orbState === 'speaking') {
      interruptSpeaking();
    } else {
      startTapToTalk();
    }
  };

  const handleSendType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedQuestion.trim()) return;
    submitUtterance(typedQuestion);
    setTypedQuestion('');
    setIsTypeOpen(false);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <section className="bg-gradient-to-b from-[#1b4332] via-[#23533e] to-[#1b4332] text-white rounded-3xl p-5 shadow-2xl border border-emerald-700/40 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: State Pill & Language Switcher */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {orbState === 'listening' ? (
            <span className="inline-flex items-center space-x-1.5 bg-rose-500/25 border border-rose-400/50 text-rose-200 text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>🔴 {t.listening}</span>
            </span>
          ) : orbState === 'understanding' ? (
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/25 border border-amber-400/50 text-amber-200 text-xs font-black px-3 py-1 rounded-full shadow-sm">
              <RefreshCw className="w-3 h-3 text-amber-300 animate-spin" />
              <span>⏳ {t.understanding}</span>
            </span>
          ) : orbState === 'speaking' ? (
            <span className="inline-flex items-center space-x-1.5 bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-black px-3 py-1 rounded-full shadow-sm animate-pulse">
              <Volume2 className="w-3 h-3 text-emerald-300 animate-bounce" />
              <span>🔊 {t.responding}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 bg-white/10 text-stone-200 text-xs font-bold px-3 py-1 rounded-full border border-white/15">
              <Radio className="w-3 h-3 text-amber-300" />
              <span>{t.voiceAssistantTitle}</span>
            </span>
          )}
        </div>

        {/* 12-Language Selector Button */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/20 active:scale-95 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 transition"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>{currentLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-emerald-200" />
          </button>

          {isLangMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setIsLangMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl py-2 z-50 text-stone-800 border border-emerald-200 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                  {t.selectLanguageTitle}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                      language === lang.code ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{lang.nativeName}</div>
                      <div className="text-[10px] text-stone-400">{lang.name}</div>
                    </div>
                    {language === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: The Large Tap to Talk Microphone Button */}
      <div className="relative z-10 flex flex-col items-center justify-center my-3">
        <div className="relative flex items-center justify-center">
          {/* Animated concentric ripples during active states */}
          {orbState === 'listening' && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-rose-400/25 animate-ping duration-1000" />
              <div className="absolute w-36 h-36 rounded-full bg-rose-400/35 animate-pulse duration-700" />
            </>
          )}

          {orbState === 'understanding' && (
            <>
              <div className="absolute w-40 h-40 rounded-full border-4 border-dashed border-amber-300/40 animate-spin duration-2000" />
              <div className="absolute w-36 h-36 rounded-full bg-amber-400/20 animate-pulse" />
            </>
          )}

          {orbState === 'speaking' && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-emerald-300/30 animate-pulse duration-500" />
              <div className="absolute w-36 h-36 rounded-full bg-amber-400/30 animate-ping duration-1500" />
            </>
          )}

          {/* Primary Interactive Button */}
          <button
            onClick={handleOrbClick}
            className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 ${
              orbState === 'listening'
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white ring-4 ring-rose-300 shadow-rose-600/50 scale-105'
                : orbState === 'understanding'
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 ring-4 ring-amber-300 shadow-amber-500/50 scale-100'
                : orbState === 'speaking'
                ? 'bg-gradient-to-tr from-emerald-400 to-amber-300 text-[#1b4332] ring-4 ring-amber-400 shadow-emerald-400/60 scale-105'
                : orbState === 'error'
                ? 'bg-gradient-to-tr from-amber-600 to-rose-600 text-white ring-4 ring-amber-300 shadow-amber-900/50'
                : 'bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white ring-4 ring-emerald-400/30 shadow-emerald-950/40 hover:scale-105'
            }`}
            title={
              orbState === 'speaking'
                ? t.stopAudio
                : orbState === 'listening'
                ? t.listening
                : t.tapToTalk
            }
          >
            {orbState === 'listening' && (
              <>
                <Mic className="w-11 h-11 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-white">
                  {t.listening}
                </span>
              </>
            )}

            {orbState === 'understanding' && (
              <>
                <RefreshCw className="w-10 h-10 animate-spin text-amber-950" />
                <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-amber-950">
                  {t.thinking}
                </span>
              </>
            )}

            {orbState === 'speaking' && (
              <>
                <Volume2 className="w-11 h-11 animate-bounce text-[#1b4332]" />
                <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-[#1b4332]">
                  {t.responding}
                </span>
              </>
            )}

            {orbState === 'error' && (
              <>
                <AlertTriangle className="w-10 h-10 text-white animate-bounce" />
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white">
                  {t.tryAgain}
                </span>
              </>
            )}

            {orbState === 'idle' && (
              <>
                <Mic className="w-11 h-11 text-white drop-shadow-md" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1 text-emerald-100">
                  {t.tapToTalk}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Status Text */}
        <div className="mt-3 text-center">
          <div className="text-sm font-extrabold tracking-wide">
            {orbState === 'idle' && (
              <span className="text-emerald-200">
                🎙 {t.tapToTalk}
              </span>
            )}
            {orbState === 'listening' && (
              <span className="text-rose-300 flex items-center justify-center space-x-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>🔴 {t.listening}</span>
              </span>
            )}
            {orbState === 'understanding' && (
              <span className="text-amber-300 flex items-center justify-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>⏳ {t.understanding}</span>
              </span>
            )}
            {orbState === 'speaking' && (
              <span className="text-amber-200 flex items-center justify-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>🔊 {t.responding}</span>
              </span>
            )}
            {orbState === 'error' && (
              <span className="text-amber-300 flex items-center justify-center space-x-1.5">
                <span>⚠️ {t.tryAgain}</span>
              </span>
            )}
          </div>
        </div>

        {/* Small Live Transcript / Spoken Text Display */}
        <div className="w-full mt-3 bg-black/35 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-center min-h-[46px] flex items-center justify-center">
          <p className="text-xs text-stone-100 font-medium italic line-clamp-2">
            {liveTranscript}
          </p>
        </div>

        {/* Permission Help Banner (if microphone access is denied) */}
        {isPermissionError && (
          <div className="w-full mt-2 bg-rose-950/80 border border-rose-500/50 rounded-2xl p-3 text-xs text-rose-200 space-y-1 text-left animate-in fade-in">
            <div className="font-bold flex items-center space-x-1.5 text-rose-100">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{t.micPermissionRequired}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-200/90">
              {t.micPermissionHelp}
            </p>
          </div>
        )}

        {/* Action Controls: Type Instead */}
        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/20 text-white border border-white/20 flex items-center space-x-1.5 transition active:scale-95"
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isTypeOpen ? t.hideInput : t.typeInstead}</span>
          </button>

          {orbState !== 'idle' && (
            <button
              onClick={endLiveConversation}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 border border-white/15 flex items-center space-x-1 transition active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.cancel}</span>
            </button>
          )}
        </div>

        {/* Expandable Type Input Form (for typing instead of speech) */}
        {isTypeOpen && (
          <form onSubmit={handleSendType} className="w-full mt-3 flex items-center space-x-2 animate-in fade-in duration-150">
            <input
              type="text"
              value={typedQuestion}
              onChange={(e) => setTypedQuestion(e.target.value)}
              placeholder={t.typeQuestionPlaceholder}
              className="flex-1 bg-white text-stone-900 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={!typedQuestion.trim()}
              className="bg-amber-400 disabled:opacity-40 text-amber-950 p-2.5 rounded-xl transition active:scale-95 font-bold"
              aria-label={t.sendQuery}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Suggested Follow-up Questions Bar */}
      <div className="relative z-10 pt-2.5 border-t border-white/10">
        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-200 mb-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.tapToAskInstantly}</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {sampleConversationalPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => submitUtterance(prompt)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-medium whitespace-nowrap border border-white/15 transition"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
