import React from 'react';
import { useApp } from '../context/AppContext';
import { VoiceOrb } from '../components/VoiceOrb';
import { SynchronizedScreen } from '../components/SynchronizedScreen';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import {
  PhoneCall,
  Store,
  ShieldCheck,
  PlayCircle
} from 'lucide-react';
import { getCropDisplayName } from '../i18n/crops';

export const HomeView: React.FC = () => {
  const {
    t,
    loadDemoScenario,
    setActiveTab,
    language
  } = useApp();

  return (
    <div className="space-y-5 pb-24">
      {/* 1. PRIMARY INTERACTION: Real-Time Two-Way Conversational Voice Orb */}
      <VoiceOrb />

      {/* 2. REAL-TIME SYNCHRONIZED SCREEN: Updates simultaneously with voice turns */}
      <SynchronizedScreen />

      {/* 3. Quick Action Cards (Explore More Features without Leaving Voice Context) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setActiveTab('markets')}
          className="bg-white p-3.5 rounded-2xl border border-stone-200/90 hover:border-emerald-500 text-left transition active:scale-95 shadow-xs flex items-center space-x-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
              {t.fullMandiMatrixCard}
            </div>
            <div className="text-[10px] text-stone-500">
              {t.fullMandiMatrixDesc}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className="bg-white p-3.5 rounded-2xl border border-stone-200/90 hover:border-teal-500 text-left transition active:scale-95 shadow-xs flex items-center space-x-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-teal-800">
              {t.mspSchemesCard}
            </div>
            <div className="text-[10px] text-stone-500">
              {t.mspSchemesDesc}
            </div>
          </div>
        </button>
      </div>

      {/* 4. Pan-India 1-Tap Realistic Demo Scenarios */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              {t.tryDemoScenarios}
            </h3>
            <p className="text-[10px] text-stone-400">
              {t.demoSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {DEMO_SCENARIOS.slice(0, 3).map((scenario) => {
            const localizedCrop = getCropDisplayName(scenario.cropId || scenario.cropName, language);
            return (
              <button
                key={scenario.id}
                onClick={() => loadDemoScenario(scenario)}
                className="bg-white p-3 rounded-2xl border border-stone-200 hover:border-emerald-400 text-left transition active:scale-[0.99] shadow-xs flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{scenario.avatarEmoji}</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                      {scenario.farmerName} • <span className="text-stone-500 font-normal">{scenario.region}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700">
                      {localizedCrop} ({scenario.quantityQuintals} {t.quintalsUnit})
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full shrink-0 flex items-center space-x-1">
                  <PlayCircle className="w-3 h-3 text-amber-700" />
                  <span>{t.tryDemoButton}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Emergency Toll-Free Kisan Call Center 1800-180-1551 */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950">
              {t.tollFreeHelpline}
            </div>
            <div className="text-xs text-amber-900 font-semibold mt-0.5">
              {t.callTollFree}
            </div>
          </div>
        </div>
        <a
          href="tel:18001801551"
          className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
        >
          {t.callBuyer}
        </a>
      </div>

      {/* 6. Transparent Data Integrity Notice */}
      <div className="text-center text-[10px] text-stone-400 py-1 space-y-0.5">
        <p>{t.dataSafetyNotice}</p>
        <p className="font-semibold text-stone-500">
          {t.complianceNotice}
        </p>
      </div>
    </div>
  );
};
