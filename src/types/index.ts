export type Language =
  | 'en'
  | 'hi'
  | 'kn'
  | 'te'
  | 'ta'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa'
  | 'or'
  | 'as';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  voiceCode: string;
}

export type CropCategory = 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Vegetables' | 'Spices';

export interface Crop {
  id: string;
  name: string;
  category: CropCategory;
  emoji: string;
  localNames: Partial<Record<Language, string>>;
  baseMsp: number; // Official MSP or standard benchmark in ₹/quintal
  standardPricePerKg: number; // in ₹/kg
  standardMoisture: number; // e.g. 12%
  shelfLifeDays: number;
  isPerishable: boolean;
  typicalYieldUnit: string;
  varieties: string[];
}

export type VehicleType = 'tractor_trolley' | 'pickup_truck' | 'mini_truck_ace' | 'large_truck' | 'local_cart';

export interface VehicleOption {
  type: VehicleType;
  name: string;
  capacityQuintals: number;
  capacityKg: number;
  baseFare: number;
  perKmRate: number;
  loadingLaborPerQuintal: number;
  icon: string;
}

export interface FarmerLocation {
  village?: string;
  mandal?: string;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
  isDetected: boolean;
}

export interface FarmerCropState {
  crop: Crop;
  variety: string;
  quantityQuintals: number;
  quantityKg: number;
  moisturePercentage: number;
  harvestDaysAgo: number;
  hasOnFarmStorage: boolean;
  preferredVehicle: VehicleType;
  location: FarmerLocation;
}

export type MarketType = 'APMC_MANDI' | 'FPO_COLLECTION' | 'PRIVATE_TRADER' | 'ENAM_BID' | 'LOCAL_HAAT';

// Distance & Trust status
export type DistanceStatus = 'VERIFIED_ROAD' | 'APPROX_ESTIMATE' | 'UNAVAILABLE';

export interface CalculatedDistanceInfo {
  distanceKm: number | null;
  status: DistanceStatus;
  statusLabel: string; // "✓ Verified road distance" | "≈ Approx. distance" | "— Distance unavailable"
  typeLabel: string;   // "Road distance" | "Approx. distance" | "Distance unavailable"
  source: string;      // Source attribution
  durationMinutes?: number;
}

export interface MarketOption {
  id: string;
  name: string;
  location: string; // Destination location (e.g., "Mandi Yard, Sehore, MP")
  type: MarketType;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
  distanceStatus: DistanceStatus;
  distanceLabel: string;
  distanceSource: string;
  durationMinutes?: number;
  transportFormula?: string;
  listedGrossPrice: number; // ₹/quintal
  pricePerKg: number; // ₹/kg
  priceTrend: 'up' | 'down' | 'stable';
  paymentTerms: string;
  apmcCessPercent: number;
  traderCommissionPercent: number;
  weighmentLaborPerQtl: number;
  disputeProtection: boolean;
  dataSourceLabel: string;
  verifiedBadge?: string;
  notes?: string;
  lastUpdated: string;
}

export interface NetRealizationBreakdown {
  market: MarketOption;
  grossAmount: number;
  transportFreightCost: number | null;
  loadingUnloadingCost: number;
  apmcCessCost: number;
  commissionCost: number;
  weighmentCost: number;
  moistureDeductionCost: number;
  totalDeductions: number | null;
  netRealizationPerQuintal: number | null;
  netRealizationPerKg: number | null;
  totalNetEarnings: number | null;
  netVsMspPerQuintal: number | null;
  isBestNet: boolean;
  isClosest: boolean;
}

export interface WeatherAdvisory {
  district: string;
  temp: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Humid';
  rainProbabilityNext3Days: number;
  humidity: number;
  advisoryText: string;
  riskLevel: 'safe' | 'caution' | 'danger';
  recommendedAction: string;
  dataSourceLabel: string;
}

export interface StorageComparison {
  warehouseName: string;
  lat?: number | null;
  lng?: number | null;
  distanceKm: number | null;
  distanceStatus?: DistanceStatus;
  distanceLabel?: string;
  monthlyRentPerQuintal: number;
  monthlyRentPerKg: number;
  expectedPriceIn60Days: number;
  expectedPriceIn90Days: number;
  storageLossRiskPercent: number;
  eNWRFinancingAvailable: boolean;
  pledgeLoanPercent: number;
  pledgeInterestRate: number;
  netBenefitHolding60Days: number;
  recommendation: 'SELL_NOW' | 'HOLD_IN_STORAGE' | 'SPLIT_DECISION';
  reasoning: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  category: 'Price Support' | 'Storage & Finance' | 'Direct Benefit' | 'Insurance' | 'Market Access';
  beneficiary: string;
  highlight: string;
  description: string;
  benefitsList: string[];
  eligibility: string[];
  howToApply: string;
  portalUrl: string;
  helpline: string;
}

export interface DemoScenario {
  id: string;
  farmerName: string;
  farmerTitle: string;
  region: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  cropName: string;
  variety: string;
  quantityQuintals: number;
  moisturePercentage: number;
  keyDilemma: string;
  highlightBadge: string;
  avatarEmoji: string;
}

// ----------------- Real-Time Voice Assistant Types -----------------

export type VoiceOrbState = 'idle' | 'listening' | 'understanding' | 'speaking' | 'error';

export interface ConversationTurn {
  id: string;
  role: 'farmer' | 'kisanmitra';
  text: string;
  timestamp: string;
}

export interface ActiveMarketPriceItem {
  id: string;
  name: string;
  location: string;
  lat: number | null;
  lng: number | null;
  pricePerKg: number;
  pricePerQuintal: number;
  distanceKm: number | null;
  distanceStatus: DistanceStatus;
  distanceLabel: string;
  distanceSource: string;
  isHighest?: boolean;
  isLowest?: boolean;
  paymentTerms?: string;
  transportCost: number | null;
  transportFormula?: string;
  netInHandPerKg: number | null;
  netTotalEarnings: number | null;
}

export interface ActiveScreenData {
  type:
    | 'price_card'
    | 'market_comparison'
    | 'distance_card'
    | 'gross_value_card'
    | 'net_realization_card'
    | 'storage_card'
    | 'weather_card'
    | 'buyers_card'
    | 'correction_alert'
    | 'data_unavailable'
    | 'welcome';
  cropName: string;
  cropEmoji: string;
  variety?: string;
  quantityKg: number;
  quantityQuintals: number;
  farmerLocation: FarmerLocation;
  location: string; // Display text for location
  targetMarketName?: string;
  highlightTitle: string;
  headlineMetric?: string;
  headlineSubtext?: string;
  markets?: ActiveMarketPriceItem[];
  selectedMarket?: ActiveMarketPriceItem;
  distanceInfo?: CalculatedDistanceInfo;
  storage?: {
    canStore: boolean;
    shelfLifeDays: number;
    recommendedAction: string;
    coldStorageAvailable: boolean;
    monthlyRentPerKg: number;
    expectedGainPerKg: number;
    warehouseName?: string;
    distanceKm?: number | null;
    distanceStatus?: DistanceStatus;
  };
  weather?: {
    district: string;
    temp: number;
    condition: string;
    rainProbability: number;
    humidity: number;
    advisory: string;
    risk: 'safe' | 'caution' | 'danger';
  };
  buyers?: Array<{
    id: string;
    name: string;
    type: string;
    lat?: number | null;
    lng?: number | null;
    distanceKm: number | null;
    distanceStatus?: DistanceStatus;
    distanceLabel?: string;
    contactNumber: string;
    paymentTerms: string;
    verified: boolean;
  }>;
  calculation?: {
    quantityKg: number;
    pricePerKg: number;
    grossAmount: number;
    transportFreight: number | null;
    transportFormula: string;
    mandiCessAndLabor: number;
    netRealizationTotal: number | null;
    netPerKg: number | null;
    marketName: string;
    distanceKm: number | null;
    distanceStatus: DistanceStatus;
    distanceLabel: string;
  };
  correctionMessage?: string;
  unavailableMessage?: string;
  dataSource: string;
  lastUpdated: string;
  isReferenceData: boolean;
}

export interface ConversationalContext {
  crop: string;
  cropEmoji: string;
  variety: string;
  quantityKg: number;
  farmerLocation: FarmerLocation;
  location: string;
  state: string;
  targetMarket: string;
  targetMarketPricePerKg: number;
  transportVehicle: VehicleType;
  distanceKm: number | null;
  distanceStatus?: DistanceStatus;
  distanceLabel?: string;
  lastIntent: string;
  lastQuestion: string;
  activeScreenType: ActiveScreenData['type'];
}
