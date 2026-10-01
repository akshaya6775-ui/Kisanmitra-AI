import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Truck,
  Warehouse,
  CloudSun,
  Users2,
  AlertCircle,
  Clock,
  Sparkles,
  Navigation,
  Coins
} from 'lucide-react';
import { getCropDisplayName } from '../i18n/crops';

export const SynchronizedScreen: React.FC = () => {
  const { activeScreenData, conversationalContext, language, t } = useApp();

  const {
    type,
    cropName,
    cropEmoji,
    quantityKg,
    highlightTitle,
    headlineMetric,
    headlineSubtext,
    markets,
    storage,
    weather,
    buyers,
    calculation,
    correctionMessage,
    unavailableMessage,
    dataSource,
    lastUpdated,
    isReferenceData
  } = activeScreenData;

  const highestMarket = markets?.find(m => m.isHighest) || markets?.[0];
  const localizedCrop = getCropDisplayName(cropName || conversationalContext.crop, language);

  return (
    <div className="space-y-4">
      {/* 1. MANDATORY SECTION: YOUR LOCATION (Before showing market results) */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xl p-1 bg-emerald-50 rounded-lg">{conversationalContext.cropEmoji || '🌾'}</span>
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-stone-900">
              <MapPin className="w-3.5 h-3.5 text-rose-600 inline" />
              <span>📍 {t.yourLocation}:</span>
              <span className="text-emerald-800">{conversationalContext.location}</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">
              {t.step1Crop}: <strong>{localizedCrop}</strong> ({conversationalContext.quantityKg} {t.kgUnit}) • {t.allDistancesFromLocation}
            </p>
          </div>
        </div>

        {correctionMessage ? (
          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] animate-bounce shrink-0">
            ⚡ {correctionMessage}
          </span>
        ) : (
          <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px] shrink-0">
            {t.locationVerified}
          </span>
        )}
      </div>

      {/* Main Dynamic Synchronized Screen Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-5 space-y-4 transition-all">
        {/* Card Header & Transparent Data Integrity Badges */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#1b4332] text-white">
                {highlightTitle}
              </span>
              {isReferenceData && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                  {t.referenceDataBadge}
                </span>
              )}
            </div>
            <h2 className="text-lg font-black text-stone-900 flex items-center space-x-2">
              <span>{cropEmoji}</span>
              <span>{localizedCrop}</span>
              <span className="text-xs font-semibold text-stone-500">({quantityKg} {t.kgUnit})</span>
            </h2>
          </div>

          {headlineMetric && (
            <div className="text-right">
              <div className="text-2xl font-black text-[#1b4332] tracking-tight">
                {headlineMetric}
              </div>
              <div className="text-[10px] text-stone-500 font-medium">
                {headlineSubtext}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Panel 1: Price Card & Market Comparison */}
        {(type === 'price_card' || type === 'market_comparison') && markets && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600 px-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-stone-400">
                {t.availableMarketsComparison}
              </span>
              {highestMarket && (
                <span className="text-emerald-700 font-bold text-[11px]">
                  ★ {t.highestPriceBadge}: {highestMarket.name} (₹{highestMarket.pricePerKg}{t.perKgAbbr})
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {markets.map((m) => {
                const isSelected = m.isHighest;
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-stone-50/50 border-stone-200/90'
                    }`}
                  >
                    {/* Market Name & Location */}
                    <div className="flex items-start justify-between gap-2 border-b border-stone-200/50 pb-2">
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-extrabold text-stone-900 text-sm">
                            {m.name}
                          </span>
                          {m.isHighest && (
                            <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                              {t.highestPriceBadge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-stone-600 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{m.location}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-stone-900">
                          ₹{m.pricePerKg}
                          <span className="text-xs font-semibold text-stone-500">{t.perKgAbbr}</span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          ₹{m.pricePerQuintal}{t.perQuintalAbbr}
                        </div>
                      </div>
                    </div>

                    {/* 4 Required Market Card Lines: Distance, Price, Transport Cost, Net Realization */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {/* Distance */}
                      <div className="bg-white p-2 rounded-xl border border-stone-200/70">
                        <span className="text-[10px] font-bold text-stone-400 block">
                          📍 {t.distanceLabel}
                        </span>
                        {m.distanceKm !== null ? (
                          <div className="font-bold text-stone-800">
                            {m.distanceKm} km{' '}
                            <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1 rounded">
                              {m.distanceLabel || t.roadDistance}
                            </span>
                          </div>
                        ) : (
                          <div className="font-bold text-rose-700">{t.distanceUnavailable}</div>
                        )}
                      </div>

                      {/* Transport Cost */}
                      <div className="bg-white p-2 rounded-xl border border-stone-200/70">
                        <span className="text-[10px] font-bold text-stone-400 block">
                          🚚 {t.transportCostLabel}
                        </span>
                        {m.transportCost !== null && m.transportCost !== undefined ? (
                          <div className="font-bold text-rose-700">
                            ₹{m.transportCost.toLocaleString('en-IN')}
                            {m.transportCost === 0 && <span className="text-[9px] text-emerald-700 ml-1">({t.farmGatePickup})</span>}
                          </div>
                        ) : (
                          <div className="font-bold text-rose-700">{t.distanceUnavailable}</div>
                        )}
                      </div>

                      {/* Net Realization */}
                      <div className="bg-white p-2 rounded-xl border border-stone-200/70 col-span-2 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 block">
                            💵 {t.netRealizationLabel}
                          </span>
                          {m.netInHandPerKg !== null && m.netInHandPerKg !== undefined ? (
                            <span className="font-black text-emerald-900 text-xs">
                              ₹{m.netInHandPerKg}{t.perKgAbbr} • {t.totalNetEarnings}: ₹{m.netTotalEarnings?.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="font-bold text-stone-500">{t.pendingDistance}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400">{m.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Panel 2: Road Distance Card */}
        {type === 'distance_card' && (
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-stone-700 text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>{t.calculatedRoadDistancesTitle} ({t.yourLocation}: {conversationalContext.location})</span>
            </div>

            <div className="space-y-2">
              {markets && markets.length > 0 ? (
                markets.map((m) => (
                  <div key={m.id} className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">{m.name}</span>
                      <span className="text-[10px] text-stone-500">{m.location}</span>
                    </div>
                    <div className="text-right">
                      {m.distanceKm !== null ? (
                        <>
                          <div className="text-base font-black text-stone-900">{m.distanceKm} km</div>
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            {m.distanceLabel || t.roadDistance}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-rose-700">{t.distanceUnavailable}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500">{t.noMarketsAvailable}</div>
              )}
            </div>

            <p className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200 leading-relaxed">
              <strong>{t.routingNotice}</strong>
            </p>
          </div>
        )}

        {/* Dynamic Panel 3: Gross Selling Value Calculation */}
        {type === 'gross_value_card' && (
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <Coins className="w-4 h-4 text-emerald-700" />
              <span>{t.grossValueTitle}</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{t.cropQuantityLabel}</span>
                <span className="font-bold text-stone-800">{quantityKg} {t.kgUnit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{t.marketRateLabel}</span>
                <span className="font-bold text-stone-800">
                  ₹{highestMarket?.pricePerKg || 27}{t.perKgAbbr} ({highestMarket?.name || 'Selected Market'})
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-emerald-900">
                <span>{t.totalGrossRealization}</span>
                <span>₹{((quantityKg || 500) * (highestMarket?.pricePerKg || 27)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              {t.askTransportHint}
            </p>
          </div>
        )}

        {/* Dynamic Panel 4: Net Realization & Transport Breakdown */}
        {type === 'net_realization_card' && calculation && (
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>{t.netInHandAfterTransportTitle} ({calculation.marketName})</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">{t.grossValueCalc} ({calculation.quantityKg} {t.kgUnit} × ₹{calculation.pricePerKg}{t.perKgAbbr}):</span>
                <span className="font-bold text-stone-900">₹{calculation.grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-700">
                <span>{t.vehicleFreightCalc} ({calculation.distanceKm !== null ? `${calculation.distanceKm} km` : t.pendingDistance}):</span>
                <span className="font-bold">
                  {calculation.transportFreight !== null ? `-₹${calculation.transportFreight.toLocaleString('en-IN')}` : t.distanceUnavailable}
                </span>
              </div>
              <div className="flex justify-between py-1 text-rose-700 border-b border-stone-100">
                <span>{t.apmcCessLaborCalc}</span>
                <span className="font-bold">-₹{calculation.mandiCessAndLabor.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1.5 text-base font-black text-emerald-800">
                <span>{t.estimatedNetRealizationCalc}</span>
                <span>
                  {calculation.netRealizationTotal !== null ? `₹${calculation.netRealizationTotal.toLocaleString('en-IN')}` : t.pendingDistance}
                </span>
              </div>
              <div className="text-[11px] text-right font-semibold text-emerald-700">
                {calculation.netPerKg !== null ? `≈ ₹${calculation.netPerKg}${t.perKgAbbr} ${t.netPerKgInPocket}` : t.distanceRequired}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Panel 5: Storage & Shelf Life Info */}
        {type === 'storage_card' && storage && (
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center space-x-2 text-amber-950 text-xs font-bold uppercase tracking-wider">
              <Warehouse className="w-4 h-4 text-amber-800" />
              <span>{t.storageTitle}</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">{t.warehouseNameLabel}</span>
                <span className="font-bold text-stone-900">{storage.warehouseName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">{t.ambientShelfLife}</span>
                <span className="font-bold text-stone-900">{storage.shelfLifeDays} {t.daysUnit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">{t.coldStorageAvailable}</span>
                <span className="font-bold text-stone-900">{storage.coldStorageAvailable ? t.yesColdStorage : t.noColdStorage}</span>
              </div>
              <div className="pt-1 text-stone-700 font-medium leading-relaxed">
                <strong>{t.storageRecommendationLabel} </strong>{storage.recommendedAction}.
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Panel 6: Weather & Harvest Conditions */}
        {type === 'weather_card' && weather && (
          <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200 space-y-3">
            <div className="flex items-center space-x-2 text-sky-950 text-xs font-bold uppercase tracking-wider">
              <CloudSun className="w-4 h-4 text-sky-700" />
              <span>{t.weatherTitle}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-sky-200">
                <span className="text-[10px] text-stone-400 block font-bold">{t.temperatureLabel}</span>
                <span className="font-black text-stone-800 text-sm">{weather.temp}°C</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-sky-200">
                <span className="text-[10px] text-stone-400 block font-bold">{t.rainRiskLabel}</span>
                <span className="font-black text-emerald-700 text-sm">{weather.rainProbability}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-sky-200">
                <span className="text-[10px] text-stone-400 block font-bold">{t.humidityLabel}</span>
                <span className="font-black text-stone-800 text-sm">{weather.humidity}%</span>
              </div>
            </div>

            <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-sky-200 leading-relaxed">
              <strong>{t.advisoryLabel} </strong>{weather.advisory}
            </p>
          </div>
        )}

        {/* Dynamic Panel 7: Verified Buyers & FPOs */}
        {type === 'buyers_card' && buyers && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-stone-700 text-xs font-bold uppercase tracking-wider px-1">
              <Users2 className="w-4 h-4 text-emerald-700" />
              <span>{t.buyersTitle}</span>
            </div>

            <div className="space-y-2">
              {buyers.map((b) => (
                <div key={b.id} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-stone-900 text-xs">{b.name}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        {t.verifiedBuyerBadge}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {b.type} • {b.distanceKm !== null ? `${b.distanceKm} km (${b.distanceLabel || t.roadDistance})` : t.distanceUnavailable}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      ✓ {b.paymentTerms}
                    </div>
                  </div>

                  <a
                    href={`tel:${b.contactNumber}`}
                    className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                  >
                    {t.callBuyer}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Panel 8: Data Unavailable (Safety Guarantee) */}
        {type === 'data_unavailable' && (
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-2">
            <div className="flex items-center space-x-1.5 font-black text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{t.dataUnavailableTitle}</span>
            </div>
            <p className="leading-relaxed">
              {unavailableMessage || t.noVerifiedDataMsg}
            </p>
            <div className="text-[10px] text-stone-500 pt-1">
              {t.dataSafetyNotice}
            </div>
          </div>
        )}

        {/* Transparent Source & Timestamp Footer */}
        <div className="pt-3 border-t border-stone-100 text-[10px] text-stone-400 flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{t.updatedLabel} {lastUpdated}</span>
          </div>
          <div>
            <span>{t.sourceLabel} {dataSource}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
