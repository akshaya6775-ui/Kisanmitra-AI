import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import {
  Sprout,
  MapPin,
  Globe,
  Volume2,
  VolumeX,
  Compass,
  Check,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    cropState,
    setIsEntryModalOpen,
    detectLocation,
    isDetectingLocation,
    isAudioPlaying,
    stopAudio,
    t
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#1b4332] text-white shadow-md border-b border-[#2d6a4f]/50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-[#52b788] flex items-center justify-center shadow-inner text-[#081c15]">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                {t.appName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d8f3dc] text-[#1b4332] px-1.5 py-0.5 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium leading-none mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls: Audio status & Language Selector */}
        <div className="flex items-center space-x-2">
          {/* Active Audio Indicator */}
          {isAudioPlaying && (
            <button
              onClick={stopAudio}
              className="flex items-center space-x-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse shadow-sm"
              title={t.stopAudio}
            >
              <Volume2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.stopAudio}</span>
            </button>
          )}

          {/* Location button */}
          <button
            onClick={() => setIsEntryModalOpen(true)}
            className="flex items-center space-x-1 bg-[#2d6a4f] hover:bg-[#40916c] active:scale-95 text-emerald-100 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border border-emerald-600/40"
            title="View or change your farm location"
          >
            <MapPin className={`w-3.5 h-3.5 text-emerald-300 ${isDetectingLocation ? 'animate-bounce' : ''}`} />
            <span className="max-w-[95px] truncate font-semibold">
              {cropState.location.village || cropState.location.district || t.setLocationPrompt}
            </span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center space-x-1 bg-[#2d6a4f] hover:bg-[#40916c] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-600/40 transition active:scale-95"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {/* Language Dropdown Modal */}
            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 text-slate-800 border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t.selectLanguageTitle}
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left text-sm hover:bg-emerald-50 transition ${
                          language === lang.code
                            ? 'bg-emerald-50 font-bold text-[#1b4332]'
                            : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold">{lang.nativeName}</div>
                          <div className="text-[11px] text-slate-400">{lang.name}</div>
                        </div>
                        {language === lang.code && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
