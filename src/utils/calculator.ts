import {
  Crop,
  FarmerCropState,
  MarketOption,
  NetRealizationBreakdown,
  StorageComparison,
  WeatherAdvisory,
  FarmerLocation
} from '../types';
import { VEHICLE_OPTIONS } from '../data/crops';
import { calculateRouteDistance, computeTransportCost } from '../services/distanceService';
import { lookupGazetteerCoordinate } from '../services/geocodingService';

/**
 * Asynchronously calculates real route distances and net realization for each market
 * from the farmer's selected location to each destination.
 */
export async function calculateNetRealizationAsync(
  cropState: FarmerCropState,
  markets: MarketOption[]
): Promise<NetRealizationBreakdown[]> {
  const { crop, quantityQuintals, moisturePercentage, preferredVehicle, location } = cropState;
  const quantityKg = quantityQuintals * 100;
  const vehicle = VEHICLE_OPTIONS.find(v => v.type === preferredVehicle) || VEHICLE_OPTIONS[0];

  const origin = {
    name: `${location.village || location.district}, ${location.state}`,
    lat: location.lat,
    lng: location.lng
  };

  const results: NetRealizationBreakdown[] = await Promise.all(
    markets.map(async (baseMarket) => {
      const destination = {
        name: baseMarket.name,
        locationDescription: baseMarket.location,
        lat: baseMarket.lat,
        lng: baseMarket.lng
      };

      // 1. Calculate actual road distance or approx distance
      const distanceInfo = await calculateRouteDistance(origin, destination);

      // 2. Calculate transparent transport cost strictly dependent on distance
      const transportCalc = computeTransportCost(distanceInfo, vehicle, quantityKg);

      const market: MarketOption = {
        ...baseMarket,
        distanceKm: distanceInfo.distanceKm,
        distanceStatus: distanceInfo.status,
        distanceLabel: distanceInfo.typeLabel, // "Road distance" | "Approx. distance" | "Distance unavailable"
        distanceSource: distanceInfo.source,
        durationMinutes: distanceInfo.durationMinutes,
        transportFormula: transportCalc.formulaLabel
      };

      const grossAmount = market.listedGrossPrice * quantityQuintals;

      // Transport freight
      let transportFreightCost: number | null = null;
      let loadingUnloadingCost = 0;

      if (market.type === 'PRIVATE_TRADER' || distanceInfo.distanceKm === 0) {
        transportFreightCost = 0;
        loadingUnloadingCost = 0;
      } else if (transportCalc.transportCost !== null) {
        transportFreightCost = transportCalc.transportCost;
        loadingUnloadingCost = vehicle.loadingLaborPerQuintal * quantityQuintals;
      }

      // APMC Cess
      const apmcCessCost = Math.round(grossAmount * (market.apmcCessPercent / 100));

      // Commission
      const commissionCost = Math.round(grossAmount * (market.traderCommissionPercent / 100));

      // Weighment
      const weighmentCost = market.weighmentLaborPerQtl * quantityQuintals;

      // Moisture discount
      let moistureDeductionCost = 0;
      if (moisturePercentage > crop.standardMoisture) {
        const excessMoisturePercent = moisturePercentage - crop.standardMoisture;
        const discountRatio = Math.min(0.20, (excessMoisturePercent * 1.25) / 100);
        moistureDeductionCost = Math.round(grossAmount * discountRatio);
      }

      if (transportFreightCost === null) {
        return {
          market,
          grossAmount,
          transportFreightCost: null,
          loadingUnloadingCost: Math.round(loadingUnloadingCost),
          apmcCessCost,
          commissionCost,
          weighmentCost: Math.round(weighmentCost),
          moistureDeductionCost,
          totalDeductions: null,
          netRealizationPerQuintal: null,
          netRealizationPerKg: null,
          totalNetEarnings: null,
          netVsMspPerQuintal: null,
          isBestNet: false,
          isClosest: false
        };
      }

      const totalDeductions =
        transportFreightCost +
        loadingUnloadingCost +
        apmcCessCost +
        commissionCost +
        weighmentCost +
        moistureDeductionCost;

      const totalNetEarnings = Math.max(0, grossAmount - totalDeductions);
      const netRealizationPerQuintal = Math.round(totalNetEarnings / quantityQuintals);
      const netRealizationPerKg = Math.round((netRealizationPerQuintal / 100) * 10) / 10;
      const netVsMspPerQuintal = netRealizationPerQuintal - crop.baseMsp;

      return {
        market,
        grossAmount,
        transportFreightCost: Math.round(transportFreightCost),
        loadingUnloadingCost: Math.round(loadingUnloadingCost),
        apmcCessCost,
        commissionCost,
        weighmentCost: Math.round(weighmentCost),
        moistureDeductionCost,
        totalDeductions: Math.round(totalDeductions),
        netRealizationPerQuintal,
        netRealizationPerKg,
        totalNetEarnings: Math.round(totalNetEarnings),
        netVsMspPerQuintal,
        isBestNet: false,
        isClosest: false
      };
    })
  );

  // Identify highest net realization and closest market
  let maxNet = -1;
  let maxNetIdx = -1;
  let minDistance = 999999;
  let minDistanceIdx = -1;

  results.forEach((res, idx) => {
    if (res.netRealizationPerQuintal !== null && res.netRealizationPerQuintal > maxNet) {
      maxNet = res.netRealizationPerQuintal;
      maxNetIdx = idx;
    }
    if (res.market.distanceKm !== null && res.market.distanceKm < minDistance) {
      minDistance = res.market.distanceKm;
      minDistanceIdx = idx;
    }
  });

  if (maxNetIdx >= 0) results[maxNetIdx].isBestNet = true;
  if (minDistanceIdx >= 0) results[minDistanceIdx].isClosest = true;

  return results.sort((a, b) => {
    if (a.netRealizationPerQuintal === null) return 1;
    if (b.netRealizationPerQuintal === null) return -1;
    return b.netRealizationPerQuintal - a.netRealizationPerQuintal;
  });
}

/**
 * Synchronous version using already calculated distances on market objects
 */
export function calculateNetRealization(
  cropState: FarmerCropState,
  markets: MarketOption[]
): NetRealizationBreakdown[] {
  const { crop, quantityQuintals, moisturePercentage, preferredVehicle } = cropState;
  const quantityKg = quantityQuintals * 100;
  const vehicle = VEHICLE_OPTIONS.find(v => v.type === preferredVehicle) || VEHICLE_OPTIONS[0];

  const results: NetRealizationBreakdown[] = markets.map((market) => {
    const grossAmount = market.listedGrossPrice * quantityQuintals;

    let transportFreightCost: number | null = null;
    let loadingUnloadingCost = 0;

    if (market.type === 'PRIVATE_TRADER' || market.distanceKm === 0) {
      transportFreightCost = 0;
      loadingUnloadingCost = 0;
    } else if (market.distanceKm !== null) {
      const tripsNeeded = Math.max(1, Math.ceil(quantityQuintals / vehicle.capacityQuintals));
      transportFreightCost = tripsNeeded * (vehicle.baseFare + Math.round(market.distanceKm * vehicle.perKmRate));
      loadingUnloadingCost = vehicle.loadingLaborPerQuintal * quantityQuintals;
    }

    const apmcCessCost = Math.round(grossAmount * (market.apmcCessPercent / 100));
    const commissionCost = Math.round(grossAmount * (market.traderCommissionPercent / 100));
    const weighmentCost = market.weighmentLaborPerQtl * quantityQuintals;

    let moistureDeductionCost = 0;
    if (moisturePercentage > crop.standardMoisture) {
      const excessMoisturePercent = moisturePercentage - crop.standardMoisture;
      const discountRatio = Math.min(0.20, (excessMoisturePercent * 1.25) / 100);
      moistureDeductionCost = Math.round(grossAmount * discountRatio);
    }

    if (transportFreightCost === null) {
      return {
        market,
        grossAmount,
        transportFreightCost: null,
        loadingUnloadingCost: Math.round(loadingUnloadingCost),
        apmcCessCost,
        commissionCost,
        weighmentCost: Math.round(weighmentCost),
        moistureDeductionCost,
        totalDeductions: null,
        netRealizationPerQuintal: null,
        netRealizationPerKg: null,
        totalNetEarnings: null,
        netVsMspPerQuintal: null,
        isBestNet: false,
        isClosest: false
      };
    }

    const totalDeductions =
      transportFreightCost +
      loadingUnloadingCost +
      apmcCessCost +
      commissionCost +
      weighmentCost +
      moistureDeductionCost;

    const totalNetEarnings = Math.max(0, grossAmount - totalDeductions);
    const netRealizationPerQuintal = Math.round(totalNetEarnings / quantityQuintals);
    const netRealizationPerKg = Math.round((netRealizationPerQuintal / 100) * 10) / 10;
    const netVsMspPerQuintal = netRealizationPerQuintal - crop.baseMsp;

    return {
      market,
      grossAmount,
      transportFreightCost: Math.round(transportFreightCost),
      loadingUnloadingCost: Math.round(loadingUnloadingCost),
      apmcCessCost,
      commissionCost,
      weighmentCost: Math.round(weighmentCost),
      moistureDeductionCost,
      totalDeductions: Math.round(totalDeductions),
      netRealizationPerQuintal,
      netRealizationPerKg,
      totalNetEarnings: Math.round(totalNetEarnings),
      netVsMspPerQuintal,
      isBestNet: false,
      isClosest: false
    };
  });

  let maxNet = -1;
  let maxNetIdx = -1;
  let minDistance = 999999;
  let minDistanceIdx = -1;

  results.forEach((res, idx) => {
    if (res.netRealizationPerQuintal !== null && res.netRealizationPerQuintal > maxNet) {
      maxNet = res.netRealizationPerQuintal;
      maxNetIdx = idx;
    }
    if (res.market.distanceKm !== null && res.market.distanceKm < minDistance) {
      minDistance = res.market.distanceKm;
      minDistanceIdx = idx;
    }
  });

  if (maxNetIdx >= 0) results[maxNetIdx].isBestNet = true;
  if (minDistanceIdx >= 0) results[minDistanceIdx].isClosest = true;

  return results.sort((a, b) => {
    if (a.netRealizationPerQuintal === null) return 1;
    if (b.netRealizationPerQuintal === null) return -1;
    return b.netRealizationPerQuintal - a.netRealizationPerQuintal;
  });
}

export async function calculateStorageDecisionWithDistance(
  crop: Crop,
  quantityQuintals: number,
  currentBestNetPerQtl: number,
  location: FarmerLocation
): Promise<StorageComparison> {
  const isPerishable = crop.isPerishable;
  const monthlyRent = isPerishable ? 75 : 14; // ₹/quintal/month
  const district = location.district || 'District';

  const priceUptickPercent60Days = isPerishable ? 0.05 : 0.09;
  const priceUptickPercent90Days = isPerishable ? -0.15 : 0.14;

  const expectedPrice60 = Math.round(currentBestNetPerQtl * (1 + priceUptickPercent60Days));
  const expectedPrice90 = Math.round(currentBestNetPerQtl * (1 + priceUptickPercent90Days));

  const storageCost60Days = monthlyRent * 2 * quantityQuintals;
  const handlingLoss = Math.round(currentBestNetPerQtl * 0.01 * quantityQuintals);
  const loanAmount = Math.round(currentBestNetPerQtl * quantityQuintals * 0.75);
  const pledgeInterestCost = Math.round(loanAmount * (0.07 * (2 / 12)));

  const grossGain60Days = (expectedPrice60 - currentBestNetPerQtl) * quantityQuintals;
  const netBenefitHolding60Days = grossGain60Days - (storageCost60Days + handlingLoss + pledgeInterestCost);

  let recommendation: StorageComparison['recommendation'] = 'SELL_NOW';
  let reasoning = '';

  if (isPerishable) {
    recommendation = 'SELL_NOW';
    reasoning = `${crop.name} is perishable with short shelf-life (${crop.shelfLifeDays} days). Cold storage adds ₹${monthlyRent}/qtl/month and risks market crash upon release. Prompt sale is safest.`;
  } else if (netBenefitHolding60Days > quantityQuintals * 70) {
    recommendation = 'HOLD_IN_STORAGE';
    reasoning = `Storing ${quantityQuintals} qtl in WDRA accredited godown can generate ~₹${netBenefitHolding60Days.toLocaleString('en-IN')} additional net profit in 60 days after rent & financing. You can avail a 75% e-NWR pledge loan (₹${loanAmount.toLocaleString('en-IN')}) for immediate liquidity.`;
  } else {
    recommendation = 'SPLIT_DECISION';
    reasoning = `Holding offers a moderate net gain of ₹${Math.max(0, netBenefitHolding60Days).toLocaleString('en-IN')}. Consider selling 50% immediately to cover harvesting debts and storing 50% for off-season premium.`;
  }

  // Calculate distance from farmer location to district warehouse
  const districtMatch = lookupGazetteerCoordinate(location.district);
  const warehouseLat = districtMatch ? districtMatch.lat : location.lat;
  const warehouseLng = districtMatch ? districtMatch.lng : location.lng;

  let warehouseDistKm: number | null = null;
  let warehouseDistLabel = 'Distance unavailable';
  let warehouseDistStatus: any = 'UNAVAILABLE';

  if (location.lat !== null && location.lng !== null && warehouseLat !== null && warehouseLng !== null) {
    const distInfo = await calculateRouteDistance(
      { name: location.district, lat: location.lat, lng: location.lng },
      { name: `${district} SWC Warehouse`, lat: warehouseLat, lng: warehouseLng }
    );
    warehouseDistKm = distInfo.distanceKm;
    warehouseDistLabel = distInfo.typeLabel;
    warehouseDistStatus = distInfo.status;
  }

  return {
    warehouseName: `${district} State Warehousing Corporation Yard (WDRA Accredited)`,
    lat: warehouseLat,
    lng: warehouseLng,
    distanceKm: warehouseDistKm,
    distanceStatus: warehouseDistStatus,
    distanceLabel: warehouseDistLabel,
    monthlyRentPerQuintal: monthlyRent,
    monthlyRentPerKg: Math.round((monthlyRent / 100) * 10) / 10,
    expectedPriceIn60Days: expectedPrice60,
    expectedPriceIn90Days: expectedPrice90,
    storageLossRiskPercent: isPerishable ? 8.5 : 1.2,
    eNWRFinancingAvailable: !isPerishable,
    pledgeLoanPercent: 75,
    pledgeInterestRate: 7.0,
    netBenefitHolding60Days,
    recommendation,
    reasoning
  };
}

export function calculateStorageDecision(
  crop: Crop,
  quantityQuintals: number,
  currentBestNetPerQtl: number,
  district: string
): StorageComparison {
  const isPerishable = crop.isPerishable;
  const monthlyRent = isPerishable ? 75 : 14;

  const priceUptickPercent60Days = isPerishable ? 0.05 : 0.09;
  const priceUptickPercent90Days = isPerishable ? -0.15 : 0.14;

  const expectedPrice60 = Math.round(currentBestNetPerQtl * (1 + priceUptickPercent60Days));
  const expectedPrice90 = Math.round(currentBestNetPerQtl * (1 + priceUptickPercent90Days));

  const storageCost60Days = monthlyRent * 2 * quantityQuintals;
  const handlingLoss = Math.round(currentBestNetPerQtl * 0.01 * quantityQuintals);
  const loanAmount = Math.round(currentBestNetPerQtl * quantityQuintals * 0.75);
  const pledgeInterestCost = Math.round(loanAmount * (0.07 * (2 / 12)));

  const grossGain60Days = (expectedPrice60 - currentBestNetPerQtl) * quantityQuintals;
  const netBenefitHolding60Days = grossGain60Days - (storageCost60Days + handlingLoss + pledgeInterestCost);

  let recommendation: StorageComparison['recommendation'] = 'SELL_NOW';
  let reasoning = '';

  if (isPerishable) {
    recommendation = 'SELL_NOW';
    reasoning = `${crop.name} is perishable with short shelf-life (${crop.shelfLifeDays} days). Cold storage adds ₹${monthlyRent}/qtl/month and risks market crash upon release. Prompt sale is safest.`;
  } else if (netBenefitHolding60Days > quantityQuintals * 70) {
    recommendation = 'HOLD_IN_STORAGE';
    reasoning = `Storing ${quantityQuintals} qtl in WDRA accredited godown can generate ~₹${netBenefitHolding60Days.toLocaleString('en-IN')} additional net profit in 60 days after rent & financing. You can avail a 75% e-NWR pledge loan (₹${loanAmount.toLocaleString('en-IN')}) for immediate liquidity.`;
  } else {
    recommendation = 'SPLIT_DECISION';
    reasoning = `Holding offers a moderate net gain of ₹${Math.max(0, netBenefitHolding60Days).toLocaleString('en-IN')}. Consider selling 50% immediately to cover harvesting debts and storing 50% for off-season premium.`;
  }

  return {
    warehouseName: `${district} State Warehousing Corporation (WDRA Reg.)`,
    distanceKm: null,
    distanceStatus: 'UNAVAILABLE',
    distanceLabel: 'Distance unavailable',
    monthlyRentPerQuintal: monthlyRent,
    monthlyRentPerKg: Math.round((monthlyRent / 100) * 10) / 10,
    expectedPriceIn60Days: expectedPrice60,
    expectedPriceIn90Days: expectedPrice90,
    storageLossRiskPercent: isPerishable ? 8.5 : 1.2,
    eNWRFinancingAvailable: !isPerishable,
    pledgeLoanPercent: 75,
    pledgeInterestRate: 7.0,
    netBenefitHolding60Days,
    recommendation,
    reasoning
  };
}

export function generateWeatherAdvisory(district: string, crop: Crop): WeatherAdvisory {
  const hash = district.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rainProb = (hash % 60) + 15;
  const temp = 26 + (hash % 10);
  const humidity = 45 + (hash % 40);

  let riskLevel: WeatherAdvisory['riskLevel'] = 'safe';
  let condition: WeatherAdvisory['condition'] = 'Sunny';
  let advisoryText = '';
  let recommendedAction = '';

  if (rainProb > 55) {
    riskLevel = 'danger';
    condition = 'Rainy';
    advisoryText = `Moderate to heavy rain showers predicted across ${district} in next 48-72 hours (${rainProb}% probability). High humidity (${humidity}%).`;
    recommendedAction = `Avoid leaving harvested ${crop.name} in open-air APMC auction yards. If transporting in an open trolley, ensure tarpaulin (tirpal) cover or divert to covered godowns / FPO centers to prevent grade downgrading.`;
  } else if (rainProb > 30) {
    riskLevel = 'caution';
    condition = 'Partly Cloudy';
    advisoryText = `Scattered clouds and mild gusty winds forecasted. Rain probability is ${rainProb}%. Humidity around ${humidity}%.`;
    recommendedAction = `Ensure produce is sun-dried below ${crop.standardMoisture}% moisture before loading. Keep waterproof sheets ready during transport.`;
  } else {
    riskLevel = 'safe';
    condition = 'Sunny';
    advisoryText = `Dry, clear sunny weather expected over the next 4 days across ${district}. Optimum conditions for open threshing and transit.`;
    recommendedAction = `Ideal window for mandi transportation and open yard auctions. No rainfall hazard reported.`;
  }

  return {
    district,
    temp,
    condition,
    rainProbabilityNext3Days: rainProb,
    humidity,
    advisoryText,
    riskLevel,
    recommendedAction,
    dataSourceLabel: 'Agro-Met Advisory Service [Reference / Demo Data]'
  };
}
