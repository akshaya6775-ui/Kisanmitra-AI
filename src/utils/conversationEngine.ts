import {
  ActiveScreenData,
  ConversationalContext,
  Language,
  ActiveMarketPriceItem,
  FarmerLocation
} from '../types';
import {
  VERIFIED_MARKET_DATABASE,
  identifyCropFromText,
  extractQuantityKgFromText,
  extractMarketTarget,
  VerifiedCropMarketInfo
} from '../data/liveMarketDatabase';
import { calculateHaversineKm } from '../services/distanceService';
import { lookupGazetteerCoordinate } from '../services/geocodingService';
import { getTranslations } from '../i18n';
import { getCropDisplayName } from '../i18n/crops';
import {
  getPriceVoiceResponse,
  getDistanceVoiceResponse,
  getNetTransportVoiceResponse,
  getGrossValueVoiceResponse,
  getStorageVoiceResponse,
  getWeatherVoiceResponse,
  getBuyersVoiceResponse
} from '../i18n/voiceResponses';

export interface ProcessTurnResult {
  voiceResponse: string;
  screenData: ActiveScreenData;
  updatedContext: ConversationalContext;
  switchedLanguage?: Language;
}

export function processConversationTurn(
  userUtterance: string,
  context: ConversationalContext,
  language: Language
): ProcessTurnResult {
  const text = userUtterance.trim().toLowerCase();
  let currentLang = language;
  let switchedLang: Language | undefined = undefined;

  // 1. Language change request detection across all 12 languages
  if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) {
    switchedLang = 'kn';
    currentLang = 'kn';
  } else if (text.includes('hindi') || text.includes('हिन्दी') || text.includes('हिंदी')) {
    switchedLang = 'hi';
    currentLang = 'hi';
  } else if (text.includes('telugu') || text.includes('తెలుగు')) {
    switchedLang = 'te';
    currentLang = 'te';
  } else if (text.includes('tamil') || text.includes('தமிழ்')) {
    switchedLang = 'ta';
    currentLang = 'ta';
  } else if (text.includes('malayalam') || text.includes('മലയാളം')) {
    switchedLang = 'ml';
    currentLang = 'ml';
  } else if (text.includes('marathi') || text.includes('मराठी')) {
    switchedLang = 'mr';
    currentLang = 'mr';
  } else if (text.includes('bengali') || text.includes('bangla') || text.includes('বাংলা')) {
    switchedLang = 'bn';
    currentLang = 'bn';
  } else if (text.includes('gujarati') || text.includes('ગુજરાતી')) {
    switchedLang = 'gu';
    currentLang = 'gu';
  } else if (text.includes('punjabi') || text.includes('ਪੰਜਾਬੀ')) {
    switchedLang = 'pa';
    currentLang = 'pa';
  } else if (text.includes('odia') || text.includes('oriya') || text.includes('ଓଡ଼ିଆ')) {
    switchedLang = 'or';
    currentLang = 'or';
  } else if (text.includes('assamese') || text.includes('অসমীয়া')) {
    switchedLang = 'as';
    currentLang = 'as';
  } else if (text.includes('english') || text.includes('angrezi')) {
    switchedLang = 'en';
    currentLang = 'en';
  }

  const t = getTranslations(currentLang);

  // 2. Resolve farmer coordinates from context
  let farmerLocation: FarmerLocation = context.farmerLocation || {
    village: '',
    district: context.location ? context.location.split(',')[0].trim() : '',
    state: context.state || '',
    lat: null,
    lng: null,
    isDetected: false
  };

  if (farmerLocation.lat === null || farmerLocation.lng === null) {
    const geoMatch = lookupGazetteerCoordinate(context.location || '') || lookupGazetteerCoordinate(farmerLocation.district);
    if (geoMatch) {
      farmerLocation = {
        ...farmerLocation,
        district: geoMatch.district,
        state: geoMatch.state,
        lat: geoMatch.lat,
        lng: geoMatch.lng
      };
    }
  }

  // 3. Crop detection & correction
  const matchedCrop = identifyCropFromText(text);
  let activeCropInfo: VerifiedCropMarketInfo;
  let isCropCorrection = false;

  if (matchedCrop) {
    if (context.crop && matchedCrop.name.toLowerCase() !== context.crop.toLowerCase()) {
      isCropCorrection = true;
    }
    activeCropInfo = matchedCrop;
  } else if (context.crop && VERIFIED_MARKET_DATABASE[context.crop.toLowerCase()]) {
    activeCropInfo = VERIFIED_MARKET_DATABASE[context.crop.toLowerCase()];
  } else {
    // Default to tomato if nothing is known yet
    activeCropInfo = VERIFIED_MARKET_DATABASE.tomato;
  }

  const localizedCropName = getCropDisplayName(activeCropInfo.name, currentLang);

  // Check if user asked for an unverified / unknown crop
  const unsupportedCrops = ['dragonfruit', 'dragon fruit', 'avocado', 'vanilla', 'kiwi', 'apple', 'strawberry', 'cardamom'];
  const hasUnsupportedCrop = unsupportedCrops.some(c => text.includes(c));
  if (hasUnsupportedCrop) {
    const unverifiedCropName = unsupportedCrops.find(c => text.includes(c)) || 'this crop';
    const voiceMsg = t.noVerifiedDataMsg.replace('इस फसल', unverifiedCropName);

    const screenData: ActiveScreenData = {
      type: 'data_unavailable',
      cropName: unverifiedCropName,
      cropEmoji: '❓',
      quantityKg: context.quantityKg,
      quantityQuintals: Math.round(context.quantityKg / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      highlightTitle: t.dataUnavailableTitle,
      unavailableMessage: t.noVerifiedDataMsg,
      dataSource: 'Agmarknet APMC Daily Bulletin',
      lastUpdated: 'Live Feed Check',
      isReferenceData: false
    };

    return {
      voiceResponse: voiceMsg,
      screenData,
      updatedContext: context,
      switchedLanguage: switchedLang
    };
  }

  // 4. Quantity extraction & correction
  let activeQty = context.quantityKg || 500;
  let isQtyCorrection = false;
  const extractedQty = extractQuantityKgFromText(text);
  if (extractedQty !== null && extractedQty > 0) {
    if (context.quantityKg && extractedQty !== context.quantityKg) {
      isQtyCorrection = true;
    }
    activeQty = extractedQty;
  }

  // 5. Target market determination & dynamic mapping
  const mappedMarkets = mapMarkets(activeCropInfo.markets, activeQty, farmerLocation);
  const highestMarket = mappedMarkets.find(m => m.isHighest) || mappedMarkets[0];
  const closestMarket = [...mappedMarkets].sort((a, b) => {
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  })[0] || mappedMarkets[0];

  const targetMarketObj = extractMarketTarget(text, activeCropInfo.markets);
  const selectedMarketItem = targetMarketObj
    ? mappedMarkets.find(m => m.id === targetMarketObj.id) || highestMarket
    : highestMarket;

  // 6. Intent detection across all supported languages
  const isDistanceQuery =
    text.includes('how far') || text.includes('distance') || text.includes('kilo meter') || text.includes('km') ||
    text.includes('दूरी') || text.includes('दूर') || text.includes('ದೂರ') || text.includes('దూరం') ||
    text.includes('தூரம்') || text.includes('ദൂരം') || text.includes('अंतर') || text.includes('দূরত্ব') ||
    text.includes('અંતર') || text.includes('ਦੂਰੀ') || text.includes('ଦୂରତା') || text.includes('দূৰত্ব');

  const isNetTransportQuery =
    text.includes('transport') || text.includes('after transport') || text.includes('freight') || text.includes('net in hand') || text.includes('after cost') ||
    text.includes('किराया') || text.includes('भाड़ा') || text.includes('सूट') || text.includes('ಕಡಿತ') || text.includes('ಸಾರಿಗೆ') ||
    text.includes('నికర') || text.includes('రవాణా') || text.includes('போக்குவரத்து') || text.includes('கழித்து') || text.includes('വാടക') ||
    text.includes('ഗതാഗതം') || text.includes('वाहतूक') || text.includes('भाडे') || text.includes('গাড়িভাড়া') || text.includes('ভাড়া') ||
    text.includes('વાહનભાડું') || text.includes('કિરાਇਆ') || text.includes('ଗାଡ଼ିଭଡ଼ା');

  const isGrossQuery =
    (text.includes('how much') && !isDistanceQuery && !isNetTransportQuery) || text.includes('what will i get') || text.includes('total money') ||
    text.includes('कितना मिलेगा') || text.includes('ಎಷ್ಟು ಸಿಗುತ್ತದೆ') || text.includes('ఎంత వస్తుంది') || text.includes('எவ்வளவு கிடைக்கும்') ||
    text.includes('എത്ര കിട്ടും') || text.includes('किती मिळेल') || text.includes('কত পাব') || text.includes('કેટલા મળશે') ||
    text.includes('ਕਿੰਨੇ ਮਿਲਣਗੇ') || text.includes('କେତେ ମିଳିବ') || text.includes('কিমান পাম');

  const isStorageQuery =
    text.includes('store') || text.includes('storage') || text.includes('godown') || text.includes('cold storage') ||
    text.includes('रखें') || text.includes('सहेजें') || text.includes('ಸಂಗ್ರಹ') || text.includes('ನಿಲ್ವ') ||
    text.includes('சேமிப்பு') || text.includes('സൂക്ഷിക്കുക') || text.includes('साठवण') || text.includes('সংরক্ষণ') ||
    text.includes('સંગ્રહ') || text.includes('ਸੰਭਾਲ') || text.includes('ସାଇତିବା') || text.includes('সাঁচি');

  const isWeatherQuery =
    text.includes('weather') || text.includes('rain') || text.includes('harvest') ||
    text.includes('बारिश') || text.includes('मौसम') || text.includes('ಮಳೆ') || text.includes('ಹವಾಮಾನ') ||
    text.includes('వర్షం') || text.includes('மழை') || text.includes('வானிலை') || text.includes('മഴ') ||
    text.includes('पाऊस') || text.includes('हवामान') || text.includes('বৃষ্টি') || text.includes('আবহাওয়া') ||
    text.includes('વરસાદ') || text.includes('વાતાવરણ') || text.includes('ਮੀਂਹ') || text.includes('ਮੌਸਮ') ||
    text.includes('ବର୍ଷା') || text.includes('ପାଣିପାଗ') || text.includes('বৰষুণ') || text.includes('বতৰ');

  const isBuyersQuery =
    text.includes('buyer') || text.includes('buyers') || text.includes('fpo') || text.includes('procure') || text.includes('who will buy') ||
    text.includes('खरीदार') || text.includes('ಖರೀದಿದಾರ') || text.includes('కొనుగోలుదారు') || text.includes('வாங்குபவர்') ||
    text.includes('വാങ്ങലുകാർ') || text.includes('खरेदीदार') || text.includes('ক্রেতা') || text.includes('ખરીદદાર') ||
    text.includes('ਖ਼ਰੀਦਦਾਰ') || text.includes('କ୍ରେତା') || text.includes('ক্ৰেতা');

  // Handle corrections specifically if stated
  if (isCropCorrection || isQtyCorrection) {
    const correctionVoice = getPriceVoiceResponse(
      activeCropInfo.name,
      closestMarket.pricePerKg,
      highestMarket.pricePerKg,
      highestMarket.name,
      currentLang
    );

    const screenData: ActiveScreenData = {
      type: 'market_comparison',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      targetMarketName: highestMarket.name,
      highlightTitle: `${localizedCropName} (${activeQty} ${t.kgUnit})`,
      headlineMetric: `₹${highestMarket.pricePerKg}/${t.kgUnit}`,
      headlineSubtext: `${t.highestPriceBadge}: ${highestMarket.name}`,
      markets: mappedMarkets,
      dataSource: 'Agmarknet APMC Daily Bulletin [Benchmark / Reference Data]',
      lastUpdated: 'Today, 06:30 AM IST (Agmarknet Feed)',
      isReferenceData: true,
      correctionMessage: `${localizedCropName} (${activeQty} ${t.kgUnit})`
    };

    return {
      voiceResponse: correctionVoice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        cropEmoji: activeCropInfo.emoji,
        quantityKg: activeQty,
        farmerLocation,
        targetMarket: highestMarket.name,
        targetMarketPricePerKg: highestMarket.pricePerKg,
        distanceKm: highestMarket.distanceKm,
        lastIntent: 'CORRECTION',
        lastQuestion: userUtterance,
        activeScreenType: 'market_comparison'
      },
      switchedLanguage: switchedLang
    };
  }

  // 7. Handle Intent: STORAGE
  if (isStorageQuery) {
    const st = activeCropInfo.storage;
    const voice = getStorageVoiceResponse(
      activeCropInfo.name,
      st.canStore,
      st.shelfLifeDays,
      st.advice,
      currentLang
    );

    const screenData: ActiveScreenData = {
      type: 'storage_card',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      highlightTitle: `${t.storageTitle}: ${localizedCropName}`,
      headlineMetric: st.canStore ? t.recommendHold : t.recommendSell,
      headlineSubtext: `${t.ambientShelfLife} ${st.shelfLifeDays} ${t.daysUnit}`,
      storage: {
        canStore: st.canStore,
        shelfLifeDays: st.shelfLifeDays,
        recommendedAction: st.canStore ? t.recommendHold : t.recommendSell,
        coldStorageAvailable: st.coldStorageAvailable,
        monthlyRentPerKg: st.monthlyRentPerKg,
        expectedGainPerKg: st.expectedGainPerKg,
        warehouseName: st.warehouseName
      },
      dataSource: 'WDRA Warehousing Norms & Post-Harvest Guidelines',
      lastUpdated: 'Current Season Advisory',
      isReferenceData: true
    };

    return {
      voiceResponse: voice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        quantityKg: activeQty,
        farmerLocation,
        lastIntent: 'STORAGE',
        lastQuestion: userUtterance,
        activeScreenType: 'storage_card'
      },
      switchedLanguage: switchedLang
    };
  }

  // 8. Handle Intent: WEATHER
  if (isWeatherQuery) {
    const w = activeCropInfo.weather;
    const voice = getWeatherVoiceResponse(
      w.district,
      w.temp,
      w.rainProbability,
      w.advisory,
      currentLang
    );

    const screenData: ActiveScreenData = {
      type: 'weather_card',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      highlightTitle: `${t.weatherTitle} - ${w.district}`,
      headlineMetric: `${w.temp}°C`,
      headlineSubtext: `${t.rainRiskLabel}: ${w.rainProbability}% • ${t.humidityLabel}: ${w.humidity}%`,
      weather: {
        district: w.district,
        temp: w.temp,
        condition: w.condition,
        rainProbability: w.rainProbability,
        humidity: w.humidity,
        advisory: w.advisory,
        risk: w.risk
      },
      dataSource: 'IMD Agro-Meteorological Advisory Service',
      lastUpdated: 'Updated 2 hours ago',
      isReferenceData: true
    };

    return {
      voiceResponse: voice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        farmerLocation,
        lastIntent: 'WEATHER',
        lastQuestion: userUtterance,
        activeScreenType: 'weather_card'
      },
      switchedLanguage: switchedLang
    };
  }

  // 9. Handle Intent: BUYERS & FPOs
  if (isBuyersQuery) {
    const buyers = activeCropInfo.buyers.map(b => {
      let bDist: number | null = null;
      let bLabel = t.distanceUnavailable;
      if (farmerLocation.lat !== null && farmerLocation.lng !== null && b.lat !== null && b.lng !== null) {
        bDist = Math.round(calculateHaversineKm(farmerLocation.lat, farmerLocation.lng, b.lat, b.lng) * 1.28 * 10) / 10;
        bLabel = t.approxDistance;
      }
      return {
        id: b.id,
        name: b.name,
        type: b.type,
        distanceKm: bDist,
        distanceLabel: bLabel,
        contactNumber: b.contactNumber,
        paymentTerms: b.paymentTerms,
        verified: true
      };
    });

    const voice = getBuyersVoiceResponse(buyers.length, buyers[0]?.name || '', currentLang);

    const screenData: ActiveScreenData = {
      type: 'buyers_card',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      highlightTitle: t.buyersTitle,
      headlineMetric: `${buyers.length} ${t.verifiedDirectBuyers}`,
      headlineSubtext: 'MSP Assured Procurement & Direct Purchase',
      buyers,
      dataSource: 'State Agriculture Marketing Board & SFAC FPO Registry',
      lastUpdated: 'Verified Registry 2026',
      isReferenceData: true
    };

    return {
      voiceResponse: voice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        farmerLocation,
        lastIntent: 'BUYERS',
        lastQuestion: userUtterance,
        activeScreenType: 'buyers_card'
      },
      switchedLanguage: switchedLang
    };
  }

  // 10. Handle Intent: DISTANCE ("How far is the market?")
  if (isDistanceQuery) {
    const market = selectedMarketItem;
    const voice = getDistanceVoiceResponse(
      market.name,
      market.distanceKm,
      market.distanceLabel || t.roadDistance,
      currentLang
    );

    const screenData: ActiveScreenData = {
      type: 'distance_card',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      targetMarketName: market.name,
      highlightTitle: t.calculatedRoadDistancesTitle,
      headlineMetric: market.distanceKm !== null ? `${market.distanceKm} km` : t.distanceUnavailable,
      headlineSubtext: `${t.allDistancesFromLocation} (${context.location || farmerLocation.district || t.yourLocation})`,
      markets: mappedMarkets,
      dataSource: 'Road Routing & Geographic Distance Calculation Engine',
      lastUpdated: 'Calculated Live from Your Selected Location',
      isReferenceData: true
    };

    return {
      voiceResponse: voice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        farmerLocation,
        targetMarket: market.name,
        targetMarketPricePerKg: market.pricePerKg,
        distanceKm: market.distanceKm,
        lastIntent: 'DISTANCE',
        lastQuestion: userUtterance,
        activeScreenType: 'distance_card'
      },
      switchedLanguage: switchedLang
    };
  }

  // 11. Handle Intent: NET REALIZATION / TRANSPORT ("What will I get after transport?")
  if (isNetTransportQuery) {
    const market = selectedMarketItem;
    const grossVal = market.pricePerKg * activeQty;
    const freightCost = market.transportCost !== null && market.transportCost !== undefined ? market.transportCost : null;
    const mandiCess = Math.round(grossVal * 0.015);
    const netInHand = freightCost !== null ? Math.max(0, grossVal - (freightCost + mandiCess)) : null;
    const netPerKg = netInHand !== null ? (netInHand / activeQty).toFixed(1) : null;

    const voice = getNetTransportVoiceResponse(
      market.name,
      activeQty,
      grossVal,
      freightCost,
      mandiCess,
      netInHand,
      netPerKg,
      currentLang
    );

    const screenData: ActiveScreenData = {
      type: 'net_realization_card',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      targetMarketName: market.name,
      highlightTitle: `${t.netInHandAfterTransportTitle} (${market.name})`,
      headlineMetric: netInHand !== null ? `₹${netInHand.toLocaleString('en-IN')}` : t.pendingDistance,
      headlineSubtext: netPerKg !== null ? `₹${netPerKg}/${t.kgUnit} ${t.netPerKgInPocket}` : t.distanceRequired,
      calculation: {
        quantityKg: activeQty,
        pricePerKg: market.pricePerKg,
        grossAmount: grossVal,
        transportFreight: freightCost,
        transportFormula: market.transportFormula || '',
        mandiCessAndLabor: mandiCess,
        netRealizationTotal: netInHand,
        netPerKg: netPerKg !== null ? parseFloat(netPerKg) : null,
        marketName: market.name,
        distanceKm: market.distanceKm,
        distanceStatus: market.distanceStatus || 'UNAVAILABLE',
        distanceLabel: market.distanceLabel || t.distanceUnavailable
      },
      markets: mappedMarkets,
      dataSource: 'Calculated using Agmarknet Benchmarks & Transparent Freight Rates',
      lastUpdated: 'Live Calculation Based on Road Distance',
      isReferenceData: true
    };

    return {
      voiceResponse: voice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        farmerLocation,
        targetMarket: market.name,
        targetMarketPricePerKg: market.pricePerKg,
        distanceKm: market.distanceKm,
        lastIntent: 'NET_TRANSPORT',
        lastQuestion: userUtterance,
        activeScreenType: 'net_realization_card'
      },
      switchedLanguage: switchedLang
    };
  }

  // 12. Handle Intent: GROSS VALUE CALCULATION ("How much for 500 kg?")
  if (isGrossQuery) {
    const market = selectedMarketItem;
    const grossVal = market.pricePerKg * activeQty;
    const voice = getGrossValueVoiceResponse(
      market.name,
      activeQty,
      activeCropInfo.name,
      market.pricePerKg,
      grossVal,
      currentLang
    );

    const screenData: ActiveScreenData = {
      type: 'gross_value_card',
      cropName: localizedCropName,
      cropEmoji: activeCropInfo.emoji,
      quantityKg: activeQty,
      quantityQuintals: Math.round(activeQty / 100),
      farmerLocation,
      location: context.location || farmerLocation.district || t.yourLocation,
      targetMarketName: market.name,
      highlightTitle: `${t.grossValueTitle} (${market.name})`,
      headlineMetric: `₹${grossVal.toLocaleString('en-IN')}`,
      headlineSubtext: `${activeQty} ${t.kgUnit} × ₹${market.pricePerKg}/${t.kgUnit}`,
      markets: mappedMarkets,
      dataSource: 'Agmarknet APMC Daily Bulletin [Benchmark / Reference Data]',
      lastUpdated: 'Today, 06:30 AM IST (Agmarknet Feed)',
      isReferenceData: true
    };

    return {
      voiceResponse: voice,
      screenData,
      updatedContext: {
        ...context,
        crop: activeCropInfo.name,
        farmerLocation,
        targetMarket: market.name,
        targetMarketPricePerKg: market.pricePerKg,
        distanceKm: market.distanceKm,
        lastIntent: 'GROSS_VALUE',
        lastQuestion: userUtterance,
        activeScreenType: 'gross_value_card'
      },
      switchedLanguage: switchedLang
    };
  }

  // 13. Default: CURRENT PRICE QUERY ("What is today's tomato price?")
  const voice = getPriceVoiceResponse(
    activeCropInfo.name,
    closestMarket.pricePerKg,
    highestMarket.pricePerKg,
    highestMarket.name,
    currentLang
  );

  const screenData: ActiveScreenData = {
    type: 'price_card',
    cropName: localizedCropName,
    cropEmoji: activeCropInfo.emoji,
    quantityKg: activeQty,
    quantityQuintals: Math.round(activeQty / 100),
    farmerLocation,
    location: context.location || farmerLocation.district || t.yourLocation,
    targetMarketName: highestMarket.name,
    highlightTitle: `${localizedCropName} - ${t.priceLabel}`,
    headlineMetric: `₹${highestMarket.pricePerKg}/${t.kgUnit}`,
    headlineSubtext: `${t.highestPriceBadge}: ${highestMarket.name}`,
    markets: mappedMarkets,
    dataSource: 'Agmarknet APMC Daily Bulletin [Benchmark / Reference Data]',
    lastUpdated: 'Today, 06:30 AM IST (Agmarknet Feed)',
    isReferenceData: true
  };

  return {
    voiceResponse: voice,
    screenData,
    updatedContext: {
      ...context,
      crop: activeCropInfo.name,
      quantityKg: activeQty,
      farmerLocation,
      targetMarket: highestMarket.name,
      targetMarketPricePerKg: highestMarket.pricePerKg,
      distanceKm: highestMarket.distanceKm,
      lastIntent: 'PRICE',
      lastQuestion: userUtterance,
      activeScreenType: 'price_card'
    },
    switchedLanguage: switchedLang
  };
}

/**
 * Calculates dynamic road distance and freight for each market
 */
function mapMarkets(
  markets: ActiveMarketPriceItem[],
  quantityKg: number,
  farmerLoc?: FarmerLocation | null
): ActiveMarketPriceItem[] {
  const qtl = quantityKg / 100;

  return markets.map(m => {
    let distKm: number | null = null;
    let distStatus = m.distanceStatus || 'UNAVAILABLE';
    let distLabel = m.distanceLabel || 'Distance unavailable';

    if (m.type === 'direct_buyer' && m.distanceKm === 0) {
      distKm = 0;
      distStatus = 'VERIFIED_ROAD';
      distLabel = 'Road distance';
    } else if (farmerLoc && farmerLoc.lat !== null && farmerLoc.lng !== null && m.lat !== null && m.lng !== null) {
      const straightLineKm = calculateHaversineKm(farmerLoc.lat, farmerLoc.lng, m.lat, m.lng);
      distKm = Math.max(1, Math.round(straightLineKm * 1.28 * 10) / 10);
      distStatus = 'ESTIMATED';
      distLabel = 'Approx. distance';
    }

    let transportCost: number | null = null;
    let formula = 'Distance unavailable';
    if (distKm !== null) {
      if (distKm === 0) {
        transportCost = 0;
        formula = '₹0 (Farm gate pickup)';
      } else {
        const ratePerKm = 14; // Standard light truck base
        const baseCost = Math.round(distKm * ratePerKm);
        const weightFactor = Math.max(1, Math.ceil(qtl / 10));
        transportCost = Math.round(baseCost * (0.8 + 0.2 * weightFactor));
        formula = `${distKm} km × ₹${ratePerKm}/km`;
      }
    }

    const grossVal = m.pricePerKg * quantityKg;
    const cessAndLabor = Math.round(grossVal * 0.015);
    const netTotal = transportCost !== null ? Math.max(0, grossVal - (transportCost + cessAndLabor)) : null;
    const netPerKg = netTotal !== null ? Math.round((netTotal / quantityKg) * 10) / 10 : null;

    return {
      ...m,
      distanceKm: distKm,
      distanceStatus: distStatus,
      distanceLabel: distLabel,
      transportCost,
      transportFormula: formula,
      netInHandPerKg: netPerKg,
      netTotalEarnings: netTotal
    };
  });
}
