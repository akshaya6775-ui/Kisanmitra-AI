import {
  CalculatedDistanceInfo,
  DistanceStatus,
  VehicleOption
} from '../types';

export interface LocationPoint {
  name: string;
  locationDescription?: string;
  district?: string;
  state?: string;
  lat: number | null;
  lng: number | null;
}

// In-memory cache for computed distances (key: "lat1,lng1->lat2,lng2")
const distanceCache: Record<string, CalculatedDistanceInfo> = {};

// Haversine formula to compute great-circle distance between two coordinates in kilometers
export function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates road distance or approximate distance between farmer location and destination.
 * 1. Checks verified coordinates. If missing, returns 'UNAVAILABLE' (never generates fake numbers!).
 * 2. If farm gate / local area (< 500m), returns 0 km / farm gate pickup.
 * 3. Tries real OSRM road routing service for actual driving distance in meters.
 * 4. If OSRM is offline or timed out, falls back to geodesic distance with circuity factor (× 1.28)
 *    and transparently labels it as 'Approx. distance' (Distance estimate).
 *    Never pretends an estimated distance is an exact road distance.
 */
export async function calculateRouteDistance(
  origin: LocationPoint,
  destination: LocationPoint
): Promise<CalculatedDistanceInfo> {
  // If destination or origin coordinates are missing or invalid
  if (
    origin.lat === null ||
    origin.lng === null ||
    destination.lat === null ||
    destination.lng === null ||
    isNaN(origin.lat) ||
    isNaN(origin.lng) ||
    isNaN(destination.lat) ||
    isNaN(destination.lng)
  ) {
    return {
      distanceKm: null,
      status: 'UNAVAILABLE',
      statusLabel: 'Distance unavailable',
      typeLabel: 'Distance unavailable',
      source: 'Unverified location coordinates'
    };
  }

  // Exact farm gate / same location check (< 500 meters)
  if (
    Math.abs(origin.lat - destination.lat) < 0.005 &&
    Math.abs(origin.lng - destination.lng) < 0.005
  ) {
    return {
      distanceKm: 0,
      status: 'VERIFIED_ROAD',
      statusLabel: 'Road distance',
      typeLabel: 'Road distance',
      source: 'Farm Gate / Village yard (0 km direct pickup)',
      durationMinutes: 0
    };
  }

  const cacheKey = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}->${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`;
  if (distanceCache[cacheKey]) {
    return distanceCache[cacheKey];
  }

  // Step 1: Try real OSRM road routing API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.routes && data.routes.length > 0) {
        const roadDistanceMeters = data.routes[0].distance;
        const roadDistanceKm = Math.round((roadDistanceMeters / 1000) * 10) / 10;
        const durationMins = Math.round(data.routes[0].duration / 60);

        const result: CalculatedDistanceInfo = {
          distanceKm: roadDistanceKm,
          status: 'VERIFIED_ROAD',
          statusLabel: 'Road distance',
          typeLabel: 'Road distance',
          source: 'OSRM / OpenStreetMap Road Routing API',
          durationMinutes: durationMins
        };

        distanceCache[cacheKey] = result;
        return result;
      }
    }
  } catch {
    // Road routing service unavailable or timeout, proceed to geodesic fallback
  }

  // Step 2: Fallback to Geodesic circuity calculation
  // Great-circle distance multiplied by rural Indian road circuity factor (~1.28)
  const straightLineKm = calculateHaversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
  const circuityFactor = 1.28;
  const estimatedRoadKm = Math.round(straightLineKm * circuityFactor * 10) / 10;
  const estimatedDuration = Math.round(estimatedRoadKm * 1.8);

  const fallbackResult: CalculatedDistanceInfo = {
    distanceKm: estimatedRoadKm,
    status: 'APPROX_ESTIMATE',
    statusLabel: 'Approx. distance',
    typeLabel: 'Approx. distance',
    source: 'Distance estimate (Geodesic circuity calculation × 1.28)',
    durationMinutes: estimatedDuration
  };

  distanceCache[cacheKey] = fallbackResult;
  return fallbackResult;
}

/**
 * Calculates vehicle transport cost strictly dependent on distance.
 * Returns null if distance is unavailable.
 * If distance is 0 (farm gate pickup), transport cost is 0.
 */
export function computeTransportCost(
  distanceInfo: CalculatedDistanceInfo,
  vehicle: VehicleOption,
  quantityKg: number
): {
  transportCost: number | null;
  formulaLabel: string;
  tripsNeeded: number;
} {
  if (distanceInfo.distanceKm === null || distanceInfo.status === 'UNAVAILABLE') {
    return {
      transportCost: null,
      formulaLabel: 'Distance unavailable',
      tripsNeeded: 1
    };
  }

  const distanceKm = distanceInfo.distanceKm;

  // Farm gate pickup (0 km) has 0 transport freight
  if (distanceKm === 0) {
    return {
      transportCost: 0,
      formulaLabel: '₹0 (Farm gate direct buyer pickup)',
      tripsNeeded: 1
    };
  }

  const quantityQuintals = Math.max(1, Math.ceil(quantityKg / 100));
  const tripsNeeded = Math.max(1, Math.ceil(quantityQuintals / vehicle.capacityQuintals));

  // Formula: trips * (baseFare + (distanceKm * perKmRate))
  const mileageCost = Math.round(distanceKm * vehicle.perKmRate);
  const totalCost = tripsNeeded * (vehicle.baseFare + mileageCost);

  const formulaLabel = tripsNeeded > 1
    ? `${tripsNeeded} trips × (₹${vehicle.baseFare} base + ${distanceKm} km × ₹${vehicle.perKmRate}/km) = ₹${totalCost.toLocaleString('en-IN')}`
    : `₹${vehicle.baseFare} base + (${distanceKm} km × ₹${vehicle.perKmRate}/km) = ₹${totalCost.toLocaleString('en-IN')}`;

  return {
    transportCost: totalCost,
    formulaLabel,
    tripsNeeded
  };
}

/**
 * Computes net realization in hand after all costs:
 * Estimated Net Realization = Gross Selling Value − Transport Cost − Storage Cost − Other Applicable Costs (Mandi cess, commission, weighment)
 */
export function computeNetRealization(
  grossSellingValue: number,
  transportCost: number | null,
  apmcCessPercent: number,
  traderCommissionPercent: number,
  weighmentLaborPerQtl: number,
  storageCost: number,
  quantityKg: number
): {
  netTotalEarnings: number | null;
  netInHandPerKg: number | null;
  mandiCess: number;
  commission: number;
  weighment: number;
  totalDeductions: number | null;
} {
  const mandiCess = Math.round(grossSellingValue * (apmcCessPercent / 100));
  const commission = Math.round(grossSellingValue * (traderCommissionPercent / 100));
  const quantityQuintals = Math.max(0.1, quantityKg / 100);
  const weighment = Math.round(weighmentLaborPerQtl * quantityQuintals);

  if (transportCost === null) {
    return {
      netTotalEarnings: null,
      netInHandPerKg: null,
      mandiCess,
      commission,
      weighment,
      totalDeductions: null
    };
  }

  const totalDeductions = transportCost + storageCost + mandiCess + commission + weighment;
  const netTotal = Math.max(0, grossSellingValue - totalDeductions);
  const netPerKg = quantityKg > 0 ? parseFloat((netTotal / quantityKg).toFixed(1)) : 0;

  return {
    netTotalEarnings: netTotal,
    netInHandPerKg: netPerKg,
    mandiCess,
    commission,
    weighment,
    totalDeductions
  };
}
