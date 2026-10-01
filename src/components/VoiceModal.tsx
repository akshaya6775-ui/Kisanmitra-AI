import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  Volume2,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export const VoiceModal: React.FC = () => {
  const {
    isVoiceModalOpen,
    setIsVoiceModalOpen,
    startLiveConversation,
    submitUtterance,
    language,
    t
  } = useApp();

  if (!isVoiceModalOpen) return null;

  const samplePrompts = [
    "What is today's tomato price?",
    "Which market has the highest price?",
    "How far is it?",
    "How much money will I get for 500 kg?",
    "What will I get after transport?",
    "Can I store tomatoes?"
  ];

  const handleSelectPrompt = (prompt: string) => {
    setIsVoiceModalOpen(false);
    startLiveConversation();
    submitUtterance(prompt);
  };

  const handleStartLive = () => {
    setIsVoiceModalOpen(false);
    startLiveConversation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#faf8f2] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1b4332] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.talkToKisanMitra}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {t.liveVoiceMode}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Action */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-5">
          <button
            onClick={handleStartLive}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-900/30 ring-4 ring-emerald-300 active:scale-95 transition"
          >
            <Mic className="w-10 h-10 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1">Start Live</span>
          </button>

          <div>
            <h4 className="font-extrabold text-stone-900 text-base">
              Enter Continuous Live Conversation
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Talk freely without pressing buttons for each question.
            </p>
          </div>

          {/* Quick Voice Prompt Chips */}
          <div className="w-full text-left pt-2 border-t border-stone-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Or tap an example to begin:</span>
            </p>
            <div className="space-y-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(p)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 active:bg-emerald-100 border border-stone-200 text-xs font-medium text-stone-700 transition flex items-center justify-between group"
                >
                  <span className="truncate pr-2">"{p}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700 opacity-60 group-hover:opacity-100 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
