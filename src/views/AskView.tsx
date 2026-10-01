import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VoiceOrb } from '../components/VoiceOrb';
import { SynchronizedScreen } from '../components/SynchronizedScreen';
import {
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Volume2,
  Mic,
  Send
} from 'lucide-react';

export const AskView: React.FC = () => {
  const {
    turnsHistory,
    submitUtterance,
    conversationalContext,
    orbState,
    language,
    t
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turnsHistory, orbState]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    submitUtterance(inputVal);
    setInputVal('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Live Voice Orb */}
      <VoiceOrb />

      {/* Synchronized Screen Card (Updates with voice turns) */}
      <SynchronizedScreen />

      {/* Conversation Turn Log */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.conversationLogTitle}</span>
          </div>
          <span className="text-[10px] text-stone-400">
            {t.contextPrefix} {conversationalContext.crop} ({conversationalContext.quantityKg} {t.kgUnit})
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
          {turnsHistory.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-4 italic">
              {t.conversationLogEmpty}
            </p>
          ) : (
            turnsHistory.map((turn) => {
              const isFarmer = turn.role === 'farmer';
              return (
                <div
                  key={turn.id}
                  className={`flex items-start space-x-2 ${isFarmer ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isFarmer ? 'bg-amber-400 text-amber-950 font-bold' : 'bg-[#1b4332] text-white'
                    }`}
                  >
                    {isFarmer ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isFarmer
                        ? 'bg-amber-100 text-amber-950 font-semibold rounded-tr-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-xs'
                    }`}
                  >
                    <p>{turn.text}</p>
                    <div className="text-[9px] text-stone-400 mt-1 text-right">
                      {turn.timestamp}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Input Bar */}
        <form onSubmit={handleSend} className="flex items-center space-x-2 pt-2 border-t border-stone-100">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.askPromptPlaceholder}
            className="flex-1 bg-stone-50 text-xs text-stone-800 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="bg-[#1b4332] disabled:opacity-40 text-white p-2.5 rounded-xl transition active:scale-95"
            aria-label={t.sendQuery}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
