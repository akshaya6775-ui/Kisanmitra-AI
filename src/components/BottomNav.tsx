import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Store,
  MessageSquareQuote,
  ShieldCheck,
  User,
  Mic
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsVoiceModalOpen, t } = useApp();

  const navItems = [
    { id: 'home' as const, label: t.navHome, icon: Home },
    { id: 'markets' as const, label: t.navMarkets, icon: Store },
    { id: 'ask' as const, label: t.navAsk, icon: MessageSquareQuote, isVoiceAction: false },
    { id: 'schemes' as const, label: t.navSchemes, icon: ShieldCheck },
    { id: 'profile' as const, label: t.navProfile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-900/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 min-w-[64px] active:scale-95 ${
                isActive
                  ? 'text-[#1b4332]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-[#1b4332] shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'markets' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#1b4332]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
