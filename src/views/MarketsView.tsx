import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getMarketsForFarmer } from '../data/mandis';
import {
  calculateNetRealizationAsync,
  calculateStorageDecisionWithDistance,
  generateWeatherAdvisory
} from '../utils/calculator';
import { NetRealizationCard } from '../components/NetRealizationCard';
import { WeatherAdvisoryCard } from '../components/WeatherAdvisoryCard';
import { StorageDecisionCard } from '../components/StorageDecisionCard';
import { VEHICLE_OPTIONS } from '../data/crops';
import { VehicleType, NetRealizationBreakdown, StorageComparison } from '../types';
import { formatFarmerLocationDisplay } from '../services/geocodingService';
import {
  TrendingUp,
  SlidersHorizontal,
  Navigation,
  Sparkles,
  Truck,
  Volume2,
  Share2,
  CheckCircle2,
  MapPin,
  Loader2,
  Compass,
  AlertCircle
} from 'lucide-react';

type SortFilter = 'best_net' | 'closest' | 'least_cost' | 'msp_guarantee';

export const MarketsView: React.FC = () => {
  const {
    cropState,
    setIsEntryModalOpen,
    playAudio,
    detectLocation,
    isDetectingLocation,
    language,
    t
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<SortFilter>('best_net');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(cropState.preferredVehicle);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState<boolean>(true);
  const [netBreakdowns, setNetBreakdowns] = useState<NetRealizationBreakdown[]>([]);
  const [storageAnalysis, setStorageAnalysis] = useState<StorageComparison | null>(null);

  // Sync selectedVehicle with cropState when changed externally
  useEffect(() => {
    setSelectedVehicle(cropState.preferredVehicle);
  }, [cropState.preferredVehicle]);

  // Asynchronously calculate road distance and net realization for each destination
  // from the farmer's selected location!
  useEffect(() => {
    let isCancelled = false;

    async function computeRoutesAndNet() {
      setIsCalculatingRoutes(true);

      // 1. Generate candidate market destinations for this crop & location
      const rawMarkets = getMarketsForFarmer(cropState.crop, cropState.location);

      // 2. Compute route distances & transport freight from farmer's location
      const stateForCalc = { ...cropState, preferredVehicle: selectedVehicle };
      const calculatedBreakdowns = await calculateNetRealizationAsync(stateForCalc, rawMarkets);

      // 3. Compute storage decision with real route distance
      const bestRate = calculatedBreakdowns[0]?.netRealizationPerQuintal || cropState.crop.baseMsp;
      const storageResult = await calculateStorageDecisionWithDistance(
        cropState.crop,
        cropState.quantityQuintals,
        bestRate,
        cropState.location
      );

      if (!isCancelled) {
        setNetBreakdowns(calculatedBreakdowns);
        setStorageAnalysis(storageResult);
        setIsCalculatingRoutes(false);
      }
    }

    computeRoutesAndNet();

    return () => {
      isCancelled = true;
    };
  }, [
    cropState.crop,
    cropState.location.district,
    cropState.location.village,
    cropState.location.state,
    cropState.location.lat,
    cropState.location.lng,
    cropState.quantityQuintals,
    cropState.moisturePercentage,
    selectedVehicle
  ]);

  // Weather advisory based on district
  const weatherAdvisory = useMemo(() => {
    return generateWeatherAdvisory(cropState.location.district || 'Your District', cropState.crop);
  }, [cropState.location.district, cropState.crop]);

  // Apply sorting filter
  const sortedBreakdowns = useMemo(() => {
    const list = [...netBreakdowns];
    if (activeFilter === 'closest') {
      return list.sort((a, b) => {
        if (a.market.distanceKm === null) return 1;
        if (b.market.distanceKm === null) return -1;
        return a.market.distanceKm - b.market.distanceKm;
      });
    }
    if (activeFilter === 'least_cost') {
      return list.sort((a, b) => {
        if (a.totalDeductions === null) return 1;
        if (b.totalDeductions === null) return -1;
        return a.totalDeductions - b.totalDeductions;
      });
    }
    if (activeFilter === 'msp_guarantee') {
      return list.filter(m => m.market.type === 'FPO_COLLECTION' || m.market.type === 'APMC_MANDI');
    }
    // Default 'best_net' already sorted descending
    return list;
  }, [netBreakdowns, activeFilter]);

  const bestOption = netBreakdowns.find(n => n.isBestNet) || netBreakdowns[0];

  // Farmer's location display string
  const farmerLocationText = formatFarmerLocationDisplay(cropState.location);
  const hasCoordinates = cropState.location.lat !== null && cropState.location.lng !== null;

  // Spoken audio summary
  const handleSpeakComparison = () => {
    if (!bestOption) return;
    const closestOption = netBreakdowns.find(n => n.isClosest);

    let summaryText = '';
    if (language === 'hi') {
      summaryText = `नमस्ते किसान भाई! आपके ${cropState.quantityQuintals} क्विंटल ${cropState.crop.localNames.hi || cropState.crop.name} के लिए सबसे अधिक शुद्ध भाव ${bestOption.market.name} में मिल रहा है। यहां से दूरी ${bestOption.market.distanceKm !== null ? bestOption.market.distanceKm + ' किलोमीटर ' + bestOption.market.distanceLabel : 'अनुमानित'} है। खर्च काटने के बाद आपको लगभग ₹${bestOption.netRealizationPerKg} प्रति किलो शुद्ध मिलेंगे।`;
    } else if (language === 'kn') {
      summaryText = `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ${cropState.quantityQuintals} ಕ್ವಿಂಟಾಲ್ ಬೆಳೆಗೆ ಅತ್ಯುತ್ತಮ ನಿವ್ವಳ ಆದಾಯ ${bestOption.market.name} ನಲ್ಲಿ ಲಭ್ಯವಿದೆ. ಸಾರಿಗೆ ವೆಚ್ಚದ ನಂತರ ಕೆಜಿಗೆ ಸುಮಾರು ₹${bestOption.netRealizationPerKg} ಸಿಗುತ್ತದೆ.`;
    } else {
      summaryText = `Market summary: For your ${cropState.quantityQuintals} quintals of ${cropState.crop.name}, ${bestOption.market.name} offers the highest net realization of ₹${bestOption.netRealizationPerKg} per kg in hand after transport deductions. Distance is ${bestOption.market.distanceKm !== null ? bestOption.market.distanceKm + ' km ' + bestOption.market.distanceLabel : 'unverified'}.`;
    }

    playAudio(summaryText, 'market-overall-summary');
  };

  const handleShareSummary = () => {
    const text = `KisanMitra Decision Summary:\nCrop: ${cropState.crop.name} (${cropState.quantityQuintals} Q)\nFarmer Location: ${farmerLocationText}\nBest Market: ${bestOption?.market.name}\nDistance: ${bestOption?.market.distanceKm !== null ? `${bestOption?.market.distanceKm} km (${bestOption?.market.distanceLabel})` : 'Unavailable'}\nNet In Hand: ₹${bestOption?.netRealizationPerKg}/kg (Total: ₹${bestOption?.totalNetEarnings?.toLocaleString('en-IN')})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. MANDATORY SECTION: YOUR LOCATION (Before showing market results) */}
      <div className="bg-white p-4 rounded-2xl border-2 border-emerald-600/30 shadow-xs space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <span>📍 {t.yourLocation}</span>
            </span>

            {/* [Village/Town, District, State] */}
            <h3 className="text-base font-extrabold text-stone-900 mt-1">
              {farmerLocationText}
            </h3>

            <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-0.5">
              {hasCoordinates ? (
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>GPS: {cropState.location.lat?.toFixed(3)}°N, {cropState.location.lng?.toFixed(3)}°E • {t.allDistancesFromLocation}</span>
                </span>
              ) : (
                <span className="text-amber-800 font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>{t.coordinatesPending}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
            <button
              onClick={() => setIsEntryModalOpen(true)}
              className="text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 transition active:scale-95"
            >
              {t.changeLocation}
            </button>
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl transition flex items-center justify-center space-x-1"
              title="Detect GPS"
            >
              <Compass className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              <span>{isDetectingLocation ? '...' : 'GPS'}</span>
            </button>
          </div>
        </div>

        {/* Current Crop Overview Chip */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl p-1 bg-emerald-50 rounded-lg">{cropState.crop.emoji}</span>
            <span className="font-extrabold text-stone-900">
              {cropState.quantityQuintals} {t.quintalsUnit} ({cropState.quantityQuintals * 100} {t.kgUnit}) {cropState.crop.localNames[language] || cropState.crop.name}
            </span>
            <span className="text-stone-400">•</span>
            <span>{t.moistureLabel}: <strong>{cropState.moisturePercentage}%</strong></span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsEntryModalOpen(true)}
              className="text-[11px] font-bold text-emerald-800 hover:underline"
            >
              {t.changeCrop}
            </button>
            <button
              onClick={handleShareSummary}
              className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg transition"
              title="Share summary"
            >
              {copiedShare ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner Decision Callout */}
      {bestOption && bestOption.netRealizationPerKg !== null && (
        <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white p-4 rounded-2xl shadow-md border border-emerald-800/60">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                {t.topRecommendation}
              </span>
            </div>
            <button
              onClick={handleSpeakComparison}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              title="Speak overall comparison"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5">
            <div className="text-sm font-bold text-white leading-snug">
              {t.sellAtForMaxNet} <strong>{bestOption.market.name}</strong>
            </div>
            <div className="mt-1 flex items-baseline space-x-2 flex-wrap">
              <span className="text-2xl font-black text-amber-300">
                ₹{bestOption.netRealizationPerKg}{t.perKgAbbr}
              </span>
              <span className="text-xs text-emerald-200">(₹{bestOption.netRealizationPerQuintal}{t.perQuintalAbbr} {t.netInHand})</span>
              {bestOption.totalNetEarnings !== null && (
                <span className="text-xs font-bold text-white/90 bg-emerald-800/80 px-2 py-0.5 rounded-md">
                  {t.totalNetEarnings}: ₹{bestOption.totalNetEarnings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-200 mt-1 flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-amber-300 inline" />
              <span>
                {t.distanceLabel}: {bestOption.market.distanceKm !== null ? `${bestOption.market.distanceKm} km (${bestOption.market.distanceLabel})` : t.distanceUnavailable}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Transport Vehicle Selector */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.selectVehicleFreight}</span>
          </label>
          <span className="text-[10px] text-stone-400 font-bold">
            {cropState.quantityQuintals} {t.quintalsUnit} ({cropState.quantityQuintals * 100} {t.kgUnit})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {VEHICLE_OPTIONS.map((v) => {
            const isSelected = selectedVehicle === v.type;
            const trips = Math.ceil(cropState.quantityQuintals / v.capacityQuintals);

            return (
              <button
                key={v.type}
                onClick={() => setSelectedVehicle(v.type)}
                className={`p-2 rounded-xl border text-left transition active:scale-95 flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 font-bold text-[#1b4332]'
                    : 'bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="text-lg">{v.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold truncate">{v.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-stone-500">₹{v.perKmRate}/km • {trips} Trip(s)</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting & Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'best_net' as const, label: t.filterHighestNet, icon: TrendingUp },
          { id: 'closest' as const, label: t.filterNearest, icon: Navigation },
          { id: 'least_cost' as const, label: t.filterLeastCosts, icon: SlidersHorizontal },
          { id: 'msp_guarantee' as const, label: t.filterRegulatedOnly, icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition active:scale-95 ${
                isActive
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Calculating distances indicator */}
      {isCalculatingRoutes && (
        <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-pulse border border-emerald-200">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-700 shrink-0" />
          <span>{t.calculatingDistances} {farmerLocationText}...</span>
        </div>
      )}

      {/* List of Compared Selling Channels with Market Cards */}
      <div className="space-y-3">
        {sortedBreakdowns.map((item, idx) => (
          <NetRealizationCard
            key={item.market.id}
            data={item}
            crop={cropState.crop}
            rank={idx + 1}
          />
        ))}
      </div>

      {/* Hold in Godown vs Sell Now Decision Analysis with Real Distance */}
      {storageAnalysis && (
        <section className="space-y-2 pt-1">
          <StorageDecisionCard
            storage={storageAnalysis}
            crop={cropState.crop}
            quantityQuintals={cropState.quantityQuintals}
          />
        </section>
      )}

      {/* Weather & Harvest Conditions Advisory */}
      <section className="space-y-2 pt-2">
        <WeatherAdvisoryCard
          weather={weatherAdvisory}
          crop={cropState.crop}
        />
      </section>
    </div>
  );
};
