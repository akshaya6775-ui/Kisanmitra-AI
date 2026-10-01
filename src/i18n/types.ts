import { Language, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', voiceCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceCode: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', voiceCode: 'kn-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', voiceCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', voiceCode: 'ta-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', voiceCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', voiceCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', voiceCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', voiceCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', voiceCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', voiceCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', voiceCode: 'as-IN' },
];

export interface AppTranslationStrings {
  // App Branding & Header
  appName: string;
  tagline: string;
  shortDesc: string;
  liveVoiceBadge: string;
  stopAudio: string;

  // Bottom Navigation
  navHome: string;
  navMarkets: string;
  navAsk: string;
  navSchemes: string;
  navProfile: string;

  // Voice Interaction & Orb
  speakToKisanMitra: string;
  listening: string;
  understanding: string;
  speaking: string;
  responding: string;
  thinking: string;
  tryAgain: string;
  tapToTalk: string;
  endConversation: string;
  cancel: string;
  hideInput: string;
  mute: string;
  unmute: string;
  typeInstead: string;
  tapToTalkPrompt: string;
  tapOrbPrompt: string;
  askPromptPlaceholder: string;
  typeQuestionPlaceholder: string;
  sendQuery: string;
  voiceUnavailable: string;
  micPermissionRequired: string;
  micPermissionHelp: string;
  speechNotDetected: string;
  contextActive: string;
  voiceAssistantTitle: string;
  tapToAskInstantly: string;
  conversationLogTitle: string;
  conversationLogEmpty: string;
  contextPrefix: string;
  talkToKisanMitraPrompt: string;
  samplePrompts: string[];

  // Location & Distances
  yourLocation: string;
  changeLocation: string;
  gpsAutoDetect: string;
  gpsLocating: string;
  locationVerified: string;
  locationUnverified: string;
  villageTownLabel: string;
  districtLabel: string;
  stateLabel: string;
  selectPresetRegion: string;
  coordinatesPending: string;
  allDistancesFromLocation: string;
  distanceLabel: string;
  roadDistance: string;
  approxDistance: string;
  distanceUnavailable: string;
  verifiedRoadDistance: string;
  estimatedDistanceBadge: string;
  routingNotice: string;
  noMarketsAvailable: string;
  calculatedRoadDistancesTitle: string;
  setLocationPrompt: string;

  // Crop & Form Modals
  selectCrop: string;
  changeCrop: string;
  cropDetailsTitle: string;
  quantityLabel: string;
  moistureLabel: string;
  vehicleLabel: string;
  locationLabel: string;
  bagsApprox: string;
  quintalsUnit: string;
  kgUnit: string;
  optimalDry: string;
  moistRisk: string;
  wetRisk: string;
  standardMoisture: string;
  calculateNetButton: string;
  step1Crop: string;
  step2Quantity: string;
  step3Moisture: string;
  step4Vehicle: string;
  step5Location: string;
  nextStep: string;
  prevStep: string;
  closeModal: string;
  allCategories: string;

  // Categories
  catVegetables: string;
  catCereals: string;
  catPulses: string;
  catCommercial: string;
  catOilseeds: string;
  catSpices: string;

  // Markets View & Cards
  mandiMatrixTitle: string;
  mandiMatrixSubtitle: string;
  topRecommendation: string;
  sellAtForMaxNet: string;
  selectVehicleFreight: string;
  filterHighestNet: string;
  filterNearest: string;
  filterLeastCosts: string;
  filterRegulatedOnly: string;
  calculatingDistances: string;
  marketName: string;
  locationName: string;
  priceLabel: string;
  transportCostLabel: string;
  netRealizationLabel: string;
  grossPrice: string;
  netInHand: string;
  totalNetEarnings: string;
  governmentMsp: string;
  costBreakdown: string;
  grossTotal: string;
  vehicleFreight: string;
  loadingLabor: string;
  mandiCess: string;
  traderCommission: string;
  moistureDiscount: string;
  netInFarmerPocket: string;
  farmGatePickup: string;
  highDemand: string;
  stableBenchmark: string;
  referenceDataBadge: string;
  dataUnavailableBadge: string;
  noVerifiedDataMsg: string;
  paymentTermsLabel: string;
  shareSummary: string;
  copiedShare: string;
  highestPriceBadge: string;
  availableMarketsComparison: string;
  pendingDistance: string;
  perQuintalAbbr: string;
  perKgAbbr: string;

  // Gross Selling Value Breakdown
  grossValueTitle: string;
  cropQuantityLabel: string;
  marketRateLabel: string;
  totalGrossRealization: string;
  askTransportHint: string;

  // Net Realization Card (in Screen)
  netInHandAfterTransportTitle: string;
  grossValueCalc: string;
  vehicleFreightCalc: string;
  apmcCessLaborCalc: string;
  estimatedNetRealizationCalc: string;
  netPerKgInPocket: string;
  distanceRequired: string;

  // Storage Card
  storageTitle: string;
  recommendHold: string;
  recommendSell: string;
  recommendSplit: string;
  warehouseNameLabel: string;
  warehouseRent: string;
  expectedPrice60Days: string;
  netBenefitHolding: string;
  enwrPledgeLoan: string;
  ambientShelfLife: string;
  coldStorageAvailable: string;
  storageStandardTariff: string;
  storageRecommendationLabel: string;
  yesColdStorage: string;
  noColdStorage: string;
  daysUnit: string;
  sellNowVsHold: string;

  // Weather Card
  weatherTitle: string;
  temperatureLabel: string;
  rainRiskLabel: string;
  humidityLabel: string;
  advisoryLabel: string;
  safeRisk: string;
  cautionRisk: string;
  dangerRisk: string;

  // Buyers Card
  buyersTitle: string;
  verifiedDirectBuyers: string;
  callBuyer: string;
  verifiedBuyerBadge: string;

  // Safety & Data Unavailable
  dataUnavailableTitle: string;
  dataSafetyNotice: string;
  updatedLabel: string;
  sourceLabel: string;

  // Schemes View
  schemesTitle: string;
  schemesSubtitle: string;
  applyOnline: string;
  eligibility: string;
  keyBenefits: string;
  helpline: string;
  centralGovt: string;
  listenAudio: string;

  // Profile View
  profileTitle: string;
  kisanId: string;
  preferredLanguage: string;
  changeLanguage: string;
  selectLanguageTitle: string;
  saveProfile: string;
  savedSuccess: string;
  tollFreeHelpline: string;
  kisanCallCenterDesc: string;
  callTollFree: string;
  aboutTitle: string;
  aboutDesc: string;
  complianceNotice: string;
  defaultTransportVehicle: string;
  farmLocationTitle: string;
  farmerNameDefault: string;

  // Home Feature Cards & Demo Scenarios
  fullMandiMatrixCard: string;
  fullMandiMatrixDesc: string;
  mspSchemesCard: string;
  mspSchemesDesc: string;
  tryDemoScenarios: string;
  demoSubtitle: string;
  enterDetailsButton: string;
  tryDemoButton: string;
  speakButton: string;
  currentCrop: string;
  audioReadout: string;
}
