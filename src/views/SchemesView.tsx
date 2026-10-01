import React, { useState } from 'react';
import { GOVERNMENT_SCHEMES } from '../data/schemes';
import { useApp } from '../context/AppContext';
import { GovernmentScheme } from '../types';
import {
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sparkles,
  Info
} from 'lucide-react';

export const SchemesView: React.FC = () => {
  const { playAudio, language, t } = useApp();
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(GOVERNMENT_SCHEMES[0].id);

  const handleSpeakScheme = (scheme: GovernmentScheme) => {
    let msg = '';
    if (language === 'hi') {
      msg = `${scheme.title}: ${scheme.highlight}। इसके तहत किसानों को ${scheme.benefitsList[0]} का सीधा लाभ मिलता है। हेल्पलाइन नंबर ${scheme.helpline} है।`;
    } else {
      msg = `${scheme.title}: ${scheme.highlight}. Key benefit: ${scheme.benefitsList[0]}. Official Helpline: ${scheme.helpline}.`;
    }
    playAudio(msg, scheme.id);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-4 rounded-2xl shadow-md border border-teal-700/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">
              {t.navSchemes} & Support
            </h2>
            <p className="text-[11px] text-teal-200">
              Government Price Support, MSP Floors & Storage Subsidies
            </p>
          </div>
        </div>
      </div>

      {/* Schemes Accordion List */}
      <div className="space-y-3">
        {GOVERNMENT_SCHEMES.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;

          return (
            <div
              key={scheme.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                isExpanded
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-stone-200/90 shadow-xs hover:border-emerald-300'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                className="p-4 cursor-pointer flex items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {scheme.beneficiary}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-sm leading-snug">
                    {scheme.title}
                  </h3>

                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    ★ {scheme.highlight}
                  </p>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakScheme(scheme);
                    }}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 transition"
                    title="Listen in audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="p-1.5 text-stone-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-stone-100 space-y-3 text-xs text-stone-700 animate-in fade-in duration-150">
                  <p className="leading-relaxed text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                    {scheme.description}
                  </p>

                  {/* Key Benefits */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Farmer Benefits</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {scheme.benefitsList.map((b, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-sky-600" />
                      <span>Eligibility Criteria</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-600 pl-1">
                      {scheme.eligibility.map((el, idx) => (
                        <li key={idx}>{el}</li>
                      ))}
                    </ul>
                  </div>

                  {/* How to Apply & Helpline */}
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-2">
                    <div>
                      <span className="font-bold text-emerald-950 block">How to apply:</span>
                      <span className="text-emerald-900">{scheme.howToApply}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs">
                      <a
                        href={scheme.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-800 hover:underline flex items-center space-x-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={`tel:${scheme.helpline.split(' ')[0]}`}
                        className="font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{scheme.helpline}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
