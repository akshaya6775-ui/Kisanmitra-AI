import React from 'react';
import { StorageComparison, Crop } from '../types';
import { useApp } from '../context/AppContext';
import {
  Warehouse,
  Coins,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Calendar
} from 'lucide-react';

interface Props {
  storage: StorageComparison;
  crop: Crop;
  quantityQuintals: number;
}

export const StorageDecisionCard: React.FC<Props> = ({ storage, crop, quantityQuintals }) => {
  const { playAudio, language, t } = useApp();

  const handleSpeakStorage = () => {
    let msg = '';
    if (language === 'hi') {
      msg = `भंडारण विश्लेषण: यदि आप ${quantityQuintals} क्विंटल ${crop.localNames.hi} को WDRA गोदाम में 60 दिन रखते हैं, तो किराया और खर्च काटने के बाद आपको लगभग ₹${Math.max(0, storage.netBenefitHolding60Days).toLocaleString('en-IN')} का अतिरिक्त शुद्ध लाभ हो सकता है। साथ ही आप 75% ई-एनडब्ल्यूआर बैंक ऋण भी ले सकते हैं।`;
    } else {
      msg = `Storage advisory: Holding ${quantityQuintals} quintals in a registered warehouse for 60 days can yield an estimated extra profit of ₹${Math.max(0, storage.netBenefitHolding60Days).toLocaleString('en-IN')} after rent and driage costs.`;
    }
    playAudio(msg, 'storage-decision');
  };

  const isHoldRecommended = storage.recommendation === 'HOLD_IN_STORAGE';

  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isHoldRecommended
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {isHoldRecommended ? 'Recommend: Hold in Godown' : 'Recommend: Prompt Sale'}
              </span>
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm mt-0.5">
              {t.sellNowVsHold}
            </h4>
            <div className="text-[11px] text-stone-500 mt-0.5">
              <span>{storage.warehouseName}</span>
              {storage.distanceKm !== null ? (
                <span className="font-semibold text-emerald-800 ml-1.5">
                  • 📍 {storage.distanceKm} km ({storage.distanceLabel})
                </span>
              ) : (
                <span className="text-stone-400 ml-1.5">• 📍 Distance unavailable</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSpeakStorage}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition active:scale-95"
          title="Listen in audio"
        >
          <Volume2 className="w-4 h-4 text-emerald-800" />
        </button>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">
            Warehouse Rental Rate
          </span>
          <span className="text-sm font-black text-stone-800 mt-0.5 block">
            ₹{storage.monthlyRentPerQuintal} / qtl / month
          </span>
          <span className="text-[10px] text-stone-400">WDRA Standard Tariff</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">
            Expected 60-Day Price
          </span>
          <span className="text-sm font-black text-emerald-700 mt-0.5 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ₹{storage.expectedPriceIn60Days} / qtl
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">Post-harvest price surge</span>
        </div>
      </div>

      {/* Financial Net Gain Box */}
      <div className={`p-3 rounded-xl border text-xs ${
        storage.netBenefitHolding60Days > 0
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-stone-100 border-stone-200 text-stone-700'
      }`}>
        <div className="flex items-center justify-between font-bold mb-1">
          <span>Est. Net Advantage of 60-Day Storage:</span>
          <span className="text-sm font-black text-emerald-800">
            {storage.netBenefitHolding60Days > 0 ? '+' : ''}₹{storage.netBenefitHolding60Days.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-stone-600">
          {storage.reasoning}
        </p>
      </div>

      {/* e-NWR Pledge Loan Highlight (Liquidity without distress sale) */}
      {storage.eNWRFinancingAvailable && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-2.5 rounded-xl border border-amber-200 text-xs flex items-start space-x-2">
          <Coins className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900 leading-tight">
            <strong>Need instant cash for next sowing? </strong>
            Get a <strong>75% e-NWR pledge loan at ~7% interest</strong> from banks against your warehouse receipt. No need to sell at distressed harvest-time rates!
          </div>
        </div>
      )}
    </div>
  );
};
