import React, { useState } from 'react';
import { NetRealizationBreakdown, Crop } from '../types';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Navigation,
  Truck,
  ChevronDown,
  ChevronUp,
  Volume2,
  AlertCircle,
  Banknote,
  Sparkles,
  MapPin
} from 'lucide-react';

interface Props {
  data: NetRealizationBreakdown;
  crop: Crop;
  rank: number;
}

export const NetRealizationCard: React.FC<Props> = ({ data, crop, rank }) => {
  const { playAudio, isAudioPlaying, activeAudioId, language, t } = useApp();
  const [isExpanded, setIsExpanded] = useState(rank === 1); // Expand top choice by default

  const { market } = data;
  const isAudioActive = isAudioPlaying && activeAudioId === market.id;

  const handleSpeakSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    let text = '';
    const distText = market.distanceKm !== null ? `${market.distanceKm} किलोमीटर ${market.distanceLabel}` : 'दूरी अनुपलब्ध है';
    const netText = data.netRealizationPerKg !== null ? `खर्च काटने के बाद शुद्ध ₹${data.netRealizationPerKg} प्रति किलो` : 'शुद्ध भाव की गणना दूरी के बाद होगी';

    if (language === 'hi') {
      text = `${market.name}, भाव ₹${market.pricePerKg} प्रति किलो। दूरी ${distText}। ${netText}। कुल कमाई लगभग ₹${data.totalNetEarnings ? data.totalNetEarnings.toLocaleString('en-IN') : 'अज्ञात'} होगी।`;
    } else if (language === 'kn') {
      text = `${market.name}, ದರ ಕೆಜಿಗೆ ₹${market.pricePerKg}. ದೂರ ${market.distanceKm ? market.distanceKm + ' ಕಿಮೀ' : 'ಲಭ್ಯವಿಲ್ಲ'}. ನಿವ್ವಳ ₹${data.netRealizationPerKg ? data.netRealizationPerKg + '/kg' : 'ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ'}.`;
    } else {
      text = `${market.name}. Listed price ₹${market.pricePerKg} per kg. Distance: ${market.distanceKm !== null ? market.distanceKm + ' km ' + market.distanceLabel : 'Distance unavailable'}. Estimated net in-hand: ${data.netRealizationPerKg !== null ? '₹' + data.netRealizationPerKg + ' per kg' : 'Unavailable'}.`;
    }
    playAudio(text, market.id);
  };

  const getMarketTypeBadge = () => {
    switch (market.type) {
      case 'APMC_MANDI':
        return { label: 'APMC Yard', bg: 'bg-blue-100 text-blue-800' };
      case 'FPO_COLLECTION':
        return { label: 'FPO Hub (Direct)', bg: 'bg-emerald-100 text-emerald-800' };
      case 'PRIVATE_TRADER':
        return { label: 'Farm Gate Trader', bg: 'bg-amber-100 text-amber-900' };
      case 'ENAM_BID':
        return { label: 'e-NAM National Bid', bg: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Local Haat', bg: 'bg-stone-100 text-stone-800' };
    }
  };

  const badgeInfo = getMarketTypeBadge();

  return (
    <div
      className={`rounded-2xl transition-all duration-200 border overflow-hidden shadow-xs ${
        data.isBestNet
          ? 'bg-gradient-to-b from-emerald-50/70 to-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'bg-white border-stone-200/90 hover:border-emerald-300'
      }`}
    >
      {/* Top Banner Tag if Best or Closest */}
      {(data.isBestNet || data.isClosest) && (
        <div
          className={`px-4 py-1.5 text-xs font-black flex items-center justify-between tracking-wide uppercase ${
            data.isBestNet
              ? 'bg-[#1b4332] text-emerald-100'
              : 'bg-stone-800 text-amber-200'
          }`}
        >
          <span className="flex items-center space-x-1.5">
            {data.isBestNet ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.highestNetPrice} (Rank #{rank})</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.closestOption} ({market.distanceKm !== null ? `${market.distanceKm} km` : 'Near'})</span>
              </>
            )}
          </span>
          <span className="text-[10px] font-semibold text-emerald-300/80 lowercase">
            {market.distanceKm !== null ? `${market.distanceKm} km • ${market.distanceLabel}` : 'Distance unavailable'}
          </span>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-4 space-y-3">
        {/* Header: Market Name & Location */}
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2.5">
          <div className="flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
              {market.verifiedBadge && (
                <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200">
                  {market.verifiedBadge}
                </span>
              )}
            </div>

            {/* Market Name */}
            <h4 className="font-black text-stone-900 text-base leading-snug">
              {market.name}
            </h4>

            {/* Location */}
            <div className="flex items-center space-x-1 text-xs text-stone-600 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{market.location || `${market.district}, ${market.state}`}</span>
            </div>
          </div>

          {/* Voice Speaker button */}
          <button
            onClick={handleSpeakSummary}
            className={`p-2 rounded-xl transition active:scale-95 shrink-0 ${
              isAudioActive
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700'
            }`}
            title="Listen to market details"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Prominent Decision Metrics matching prompt requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* 1. Distance */}
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-emerald-700" />
              <span>📍 Distance</span>
            </span>
            <div className="mt-1 flex items-baseline space-x-1.5 flex-wrap">
              {market.distanceKm !== null ? (
                <>
                  <span className="text-base font-black text-stone-900">
                    {market.distanceKm} km
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      market.distanceStatus === 'VERIFIED_ROAD'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {market.distanceLabel}
                  </span>
                </>
              ) : (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Distance unavailable
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5 truncate">
              {market.distanceSource}
            </p>
          </div>

          {/* 2. Listed Price */}
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center space-x-1">
              <span>💰 Price</span>
            </span>
            <div className="mt-1 flex items-baseline space-x-1.5">
              <span className="text-base font-black text-stone-900">
                ₹{market.pricePerKg}/kg
              </span>
              <span className="text-[10px] text-stone-500">
                (₹{market.listedGrossPrice.toLocaleString('en-IN')}/qtl)
              </span>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5 flex items-center space-x-1">
              {market.priceTrend === 'up' ? (
                <span className="text-emerald-700 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> High Demand
                </span>
              ) : (
                <span className="text-stone-500">Agmarknet Benchmark</span>
              )}
            </div>
          </div>

          {/* 3. Estimated Transport Cost */}
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center space-x-1">
              <Truck className="w-3 h-3 text-stone-600" />
              <span>🚚 Estimated Transport Cost</span>
            </span>
            <div className="mt-1">
              {data.transportFreightCost !== null ? (
                <div className="flex items-baseline space-x-1">
                  <span className="text-base font-black text-rose-800">
                    ₹{data.transportFreightCost.toLocaleString('en-IN')}
                  </span>
                  {data.transportFreightCost === 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                      Farm gate pickup
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Distance unavailable
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5 truncate" title={market.transportFormula}>
              {market.transportFormula || 'Calculated from distance'}
            </p>
          </div>

          {/* 4. Estimated Net Realization */}
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-300">
            <span className="text-[10px] uppercase font-black text-emerald-900 flex items-center space-x-1">
              <span>💵 Estimated Net Realization</span>
            </span>
            <div className="mt-1">
              {data.netRealizationPerKg !== null ? (
                <div className="flex items-baseline space-x-1">
                  <span className="text-base font-black text-[#1b4332]">
                    ₹{data.netRealizationPerKg}/kg
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold">
                    (₹{data.netRealizationPerQuintal}/qtl)
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-stone-500">
                  Pending distance
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold text-emerald-800 mt-0.5">
              {data.totalNetEarnings !== null ? (
                <span>Total: ₹{data.totalNetEarnings.toLocaleString('en-IN')}</span>
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Profit Margin vs MSP Callout */}
        <div className="flex items-center justify-between text-xs py-1 text-stone-600">
          <span className="text-[11px]">
            {t.governmentMsp}: <strong className="text-stone-800">₹{crop.baseMsp}/qtl</strong>
          </span>
          {data.netVsMspPerQuintal !== null && (
            <span
              className={`font-black text-xs px-2 py-0.5 rounded-full ${
                data.netVsMspPerQuintal >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {data.netVsMspPerQuintal >= 0 ? '+' : ''}₹{data.netVsMspPerQuintal} vs MSP
            </span>
          )}
        </div>

        {/* Expandable Cost Breakdown Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600 hover:text-emerald-700 transition"
        >
          <span className="flex items-center space-x-1.5">
            <Banknote className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {t.costBreakdown}
              {data.totalDeductions !== null ? ` (-₹${data.totalDeductions.toLocaleString('en-IN')})` : ''}
            </span>
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Detailed Deductions Drawer */}
        {isExpanded && (
          <div className="pt-2 border-t border-dashed border-stone-200 space-y-1.5 text-xs text-stone-600 animate-in fade-in duration-150">
            <div className="flex justify-between py-0.5">
              <span className="text-stone-500">Gross Total (Before Costs):</span>
              <span className="font-semibold text-stone-800">
                ₹{data.grossAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between py-0.5 text-rose-700">
              <span className="flex items-center space-x-1">
                <Truck className="w-3 h-3" />
                <span>Transport & Vehicle Freight ({market.distanceKm !== null ? `${market.distanceKm} km` : 'distance pending'}):</span>
              </span>
              <span className="font-bold">
                {data.transportFreightCost !== null ? `-₹${data.transportFreightCost.toLocaleString('en-IN')}` : 'Unavailable'}
              </span>
            </div>

            {data.loadingUnloadingCost > 0 && (
              <div className="flex justify-between py-0.5 text-rose-700">
                <span>Loading & Unloading Labor (Hamali):</span>
                <span className="font-semibold">-₹{data.loadingUnloadingCost.toLocaleString('en-IN')}</span>
              </div>
            )}

            {data.apmcCessCost > 0 && (
              <div className="flex justify-between py-0.5 text-rose-700">
                <span>APMC Mandi Cess / Tax ({market.apmcCessPercent}%):</span>
                <span className="font-semibold">-₹{data.apmcCessCost.toLocaleString('en-IN')}</span>
              </div>
            )}

            {data.commissionCost > 0 && (
              <div className="flex justify-between py-0.5 text-rose-700">
                <span>Trader Commission ({market.traderCommissionPercent}%):</span>
                <span className="font-semibold">-₹{data.commissionCost.toLocaleString('en-IN')}</span>
              </div>
            )}

            {data.moistureDeductionCost > 0 && (
              <div className="flex justify-between py-0.5 text-rose-800 bg-rose-50 px-2 py-1 rounded-lg">
                <span className="flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Excess Moisture Discount:</span>
                </span>
                <span className="font-bold">-₹{data.moistureDeductionCost.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-1 border-t border-stone-200 font-black text-stone-900">
              <span>Estimated Net Realization:</span>
              <span className="text-emerald-800 text-sm">
                {data.totalNetEarnings !== null ? `₹${data.totalNetEarnings.toLocaleString('en-IN')}` : 'Pending distance'}
              </span>
            </div>

            {/* Transparent Data Source Label */}
            <div className="text-[10px] text-stone-400 pt-1 italic text-right">
              Data: {market.dataSourceLabel} • Distance: {market.distanceSource}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
