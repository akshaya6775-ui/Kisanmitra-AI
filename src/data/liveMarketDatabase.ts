import {
  ActiveScreenData,
  ConversationalContext,
  Language,
  ActiveMarketPriceItem,
  FarmerLocation,
  CalculatedDistanceInfo,
  VehicleOption
} from '../types';
import {
  calculateRouteDistance,
  computeTransportCost,
  computeNetRealization
} from '../services/distanceService';
import { VEHICLE_OPTIONS } from './crops';

export interface VerifiedCropMarketInfo {
  cropId: string;
  name: string;
  emoji: string;
  aliases: string[];
  standardPricePerKg: number;
  markets: Array<{
    id: string;
    name: string;
    location: string;
    lat: number | null;
    lng: number | null;
    pricePerKg: number;
    pricePerQuintal: number;
    paymentTerms: string;
    isHighest?: boolean;
    isLowest?: boolean;
  }>;
  storage: {
    warehouseName: string;
    lat: number | null;
    lng: number | null;
    canStore: boolean;
    shelfLifeDays: number;
    coldStorageAvailable: boolean;
    monthlyRentPerKg: number;
    expectedGainPerKg: number;
    recommendedAction: string;
    advice: string;
  };
  weather: {
    district: string;
    temp: number;
    condition: string;
    rainProbability: number;
    humidity: number;
    advisory: string;
    risk: 'safe' | 'caution' | 'danger';
  };
  buyers: Array<{
    id: string;
    name: string;
    type: string;
    lat: number | null;
    lng: number | null;
    contactNumber: string;
    paymentTerms: string;
    verified: boolean;
  }>;
}

export const VERIFIED_MARKET_DATABASE: Record<string, VerifiedCropMarketInfo> = {
  tomato: {
    cropId: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    aliases: ['tomato', 'tamatar', 'thakkali', 'tomaato', 'tameta', 'टमाटर', 'ಟೊಮೆಟೊ', 'తక్కాలి', 'தக்காளி', 'തക്കാളി'],
    standardPricePerKg: 25,
    markets: [
      {
        id: 'mkt-blr',
        name: 'Bangalore APMC Market',
        location: 'Yeshwanthpur / Singena Agrahara, Karnataka',
        lat: 13.0285,
        lng: 77.5451,
        pricePerKg: 27,
        pricePerQuintal: 2700,
        paymentTerms: 'Immediate RTGS / Cash',
        isHighest: true
      },
      {
        id: 'mkt-klr',
        name: 'Kolar APMC Market',
        location: 'Kolar Mandi Yard, Karnataka',
        lat: 13.1362,
        lng: 78.1291,
        pricePerKg: 24,
        pricePerQuintal: 2400,
        paymentTerms: 'Same Day Settlement'
      },
      {
        id: 'mkt-mys',
        name: 'Mysore Bandipalya Market',
        location: 'Bandipalya, Mysore, Karnataka',
        lat: 12.2818,
        lng: 76.6784,
        pricePerKg: 23,
        pricePerQuintal: 2300,
        paymentTerms: '24 Hours Bank Transfer',
        isLowest: true
      },
      {
        id: 'mkt-rmn',
        name: 'Ramanagara Sub-Market',
        location: 'Ramanagara Town Yard, Karnataka',
        lat: 12.7209,
        lng: 77.2799,
        pricePerKg: 25,
        pricePerQuintal: 2500,
        paymentTerms: 'Cash on spot'
      },
      {
        id: 'mkt-chk',
        name: 'Chikkaballapur APMC Market',
        location: 'Chikkaballapur Town Yard, Karnataka',
        lat: 13.4325,
        lng: 77.7275,
        pricePerKg: 24.5,
        pricePerQuintal: 2450,
        paymentTerms: 'Daily electronic settlement'
      }
    ],
    storage: {
      warehouseName: 'Kolar District Cold Storage Federation',
      lat: 13.1380,
      lng: 78.1320,
      canStore: false,
      shelfLifeDays: 7,
      coldStorageAvailable: true,
      monthlyRentPerKg: 1.6,
      expectedGainPerKg: -3.0,
      recommendedAction: 'Immediate Sale Recommended',
      advice: 'Tomatoes are highly perishable (ambient shelf life 5-7 days). Cold storage (10-12°C) adds ₹1.6/kg/month with high moisture loss risk. Prompt dispatch to the highest price market yields maximum net returns.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 28,
      condition: 'Partly Cloudy',
      rainProbability: 25,
      humidity: 62,
      advisory: 'Clear harvest window over next 48 hours. Light rain chance (25%). Suitable for picking and immediate crate dispatch in covered vehicles.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-1',
        name: 'Kolar Farmer Producer Co. (FPO Hub)',
        type: 'FPO Direct Aggregation',
        lat: 13.1420,
        lng: 78.1350,
        contactNumber: '08152-224411',
        paymentTerms: 'Direct DBT within 24 hrs',
        verified: true
      },
      {
        id: 'b-2',
        name: 'FreshHarvest Wholesale Aggregators',
        type: 'Verified Institutional Buyer',
        lat: 13.0100,
        lng: 77.5500,
        contactNumber: '98451-22901',
        paymentTerms: 'Spot electronic payment',
        verified: true
      },
      {
        id: 'b-3',
        name: 'Reliance Retail Agri Procurement Center',
        type: 'Direct Corporate Collection',
        lat: 12.9800,
        lng: 77.6200,
        contactNumber: '1800-891-0001',
        paymentTerms: 'Next-day Bank NEFT',
        verified: true
      }
    ]
  },

  onion: {
    cropId: 'onion',
    name: 'Onion',
    emoji: '🧅',
    aliases: ['onion', 'pyaz', 'kanda', 'eerulli', 'ullipayalu', 'vengayam', 'dungli', 'प्याज', 'कांदा', 'ಈರುಳ್ಳಿ', 'ఉల్లిపాయలు', 'வெங்காயம்'],
    standardPricePerKg: 21,
    markets: [
      {
        id: 'mkt-lasal',
        name: 'Lasalgaon APMC Market',
        location: 'Lasalgaon, Nashik, Maharashtra',
        lat: 20.1472,
        lng: 74.2255,
        pricePerKg: 22.5,
        pricePerQuintal: 2250,
        paymentTerms: 'Online RTGS / Arhatiya Cash',
        isHighest: true
      },
      {
        id: 'mkt-nsk',
        name: 'Nashik Main Yard',
        location: 'Panchavati, Nashik, Maharashtra',
        lat: 20.0110,
        lng: 73.7900,
        pricePerKg: 20.0,
        pricePerQuintal: 2000,
        paymentTerms: '24-48 Hours NEFT'
      },
      {
        id: 'mkt-pune',
        name: 'Pune Gultekdi Market',
        location: 'Market Yard, Pune, Maharashtra',
        lat: 18.4967,
        lng: 73.8682,
        pricePerKg: 21.0,
        pricePerQuintal: 2100,
        paymentTerms: 'Same day RTGS'
      },
      {
        id: 'mkt-blr-on',
        name: 'Bangalore Yeshwanthpur APMC',
        location: 'Yeshwanthpur, Bangalore, Karnataka',
        lat: 13.0285,
        lng: 77.5451,
        pricePerKg: 23.5,
        pricePerQuintal: 2350,
        paymentTerms: 'Direct bank transfer',
        isHighest: true
      }
    ],
    storage: {
      warehouseName: 'Maharashtra State Warehousing Corp (Onion Chawl)',
      lat: 20.0100,
      lng: 73.7850,
      canStore: true,
      shelfLifeDays: 60,
      coldStorageAvailable: true,
      monthlyRentPerKg: 0.8,
      expectedGainPerKg: 4.5,
      recommendedAction: 'Can Hold in Ventilated Storage',
      advice: 'Rabi / Summer onions can be stored for 45-60 days in traditional naturally ventilated chawls or godowns. Anticipated off-season price rise is ₹4-₹6/kg.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 30,
      condition: 'Dry & Sunny',
      rainProbability: 10,
      humidity: 48,
      advisory: 'Excellent dry weather conditions. Low humidity (48%). Ideal for post-harvest drying and curing before bagging.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-on-1',
        name: 'MahaFPO Onion Federation Center',
        type: 'State FPO Consortium',
        lat: 20.0200,
        lng: 73.8000,
        contactNumber: '0253-241088',
        paymentTerms: 'Direct DBT within 2 Days',
        verified: true
      },
      {
        id: 'b-on-2',
        name: 'NAFED Buffer Stock Procurement Center',
        type: 'Government Price Support',
        lat: 20.1500,
        lng: 74.2300,
        contactNumber: '1800-180-1551',
        paymentTerms: 'Aadhaar DBT linked account',
        verified: true
      }
    ]
  },

  potato: {
    cropId: 'potato',
    name: 'Potato',
    emoji: '🥔',
    aliases: ['potato', 'aloo', 'batata', 'alu', 'urulaikizhangu', 'urulaikilangu', 'ಆಲೂಗಡ್ಡೆ', 'आलू', 'बटाटा', 'బంగాళాదుంప'],
    standardPricePerKg: 17,
    markets: [
      {
        id: 'mkt-hsn',
        name: 'Hassan APMC Mandi',
        location: 'Hassan Yard, Karnataka',
        lat: 13.0033,
        lng: 76.1004,
        pricePerKg: 18.5,
        pricePerQuintal: 1850,
        paymentTerms: 'Immediate cash',
        isHighest: true
      },
      {
        id: 'mkt-blr-pot',
        name: 'Bangalore Binny Mills Yard',
        location: 'Bangalore Central, Karnataka',
        lat: 12.9716,
        lng: 77.5684,
        pricePerKg: 19.5,
        pricePerQuintal: 1950,
        paymentTerms: 'Same day RTGS',
        isHighest: true
      },
      {
        id: 'mkt-kolar-pot',
        name: 'Kolar Sub-Yard',
        location: 'Kolar, Karnataka',
        lat: 13.1362,
        lng: 78.1291,
        pricePerKg: 17.0,
        pricePerQuintal: 1700,
        paymentTerms: 'Direct settlement',
        isLowest: true
      }
    ],
    storage: {
      warehouseName: 'Central Warehousing Corporation Cold Store',
      lat: 13.0100,
      lng: 76.1100,
      canStore: true,
      shelfLifeDays: 120,
      coldStorageAvailable: true,
      monthlyRentPerKg: 0.9,
      expectedGainPerKg: 3.5,
      recommendedAction: 'Safe to Store in Cold Storage',
      advice: 'Potatoes can be held up to 4-6 months at 2-4°C in accredited cold storages with CWC / SWC e-NWR pledge financing.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 26,
      condition: 'Sunny',
      rainProbability: 15,
      humidity: 55,
      advisory: 'Clear sunny sky. No rain danger. Safely transport in covered trucks.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-pot-1',
        name: 'Hassan Potato Growers FPO',
        type: 'FPO Aggregation',
        lat: 13.0050,
        lng: 76.0950,
        contactNumber: '08172-268800',
        paymentTerms: 'DBT in 48 hours',
        verified: true
      }
    ]
  },

  wheat: {
    cropId: 'wheat',
    name: 'Wheat',
    emoji: '🌾',
    aliases: ['wheat', 'gehun', 'gehu', 'kanak', 'godhi', 'godhumalu', 'kothumai', 'ghau', 'गेहूं', 'ಗೋಧಿ', 'கோதுமை', 'గోధుమలు'],
    standardPricePerKg: 25.0,
    markets: [
      {
        id: 'mkt-sehore',
        name: 'Sehore APMC Mandi',
        location: 'Ashta Road, Sehore, Madhya Pradesh',
        lat: 23.2032,
        lng: 77.0844,
        pricePerKg: 25.8,
        pricePerQuintal: 2580,
        paymentTerms: 'Same day RTGS / e-NAM',
        isHighest: true
      },
      {
        id: 'mkt-bhopal',
        name: 'Bhopal Karond APMC',
        location: 'Karond, Bhopal, Madhya Pradesh',
        lat: 23.2982,
        lng: 77.4045,
        pricePerKg: 25.1,
        pricePerQuintal: 2510,
        paymentTerms: '24-48 Hours Bank Transfer'
      },
      {
        id: 'mkt-indore',
        name: 'Indore Chhavani Mandi',
        location: 'Chhavani, Indore, Madhya Pradesh',
        lat: 22.7096,
        lng: 75.8748,
        pricePerKg: 25.4,
        pricePerQuintal: 2540,
        paymentTerms: 'RTGS Settlement'
      }
    ],
    storage: {
      warehouseName: 'MP Warehousing & Logistics Corp (WDRA Reg.)',
      lat: 23.2100,
      lng: 77.0900,
      canStore: true,
      shelfLifeDays: 365,
      coldStorageAvailable: false,
      monthlyRentPerKg: 0.14,
      expectedGainPerKg: 2.2,
      recommendedAction: 'Hold in WDRA Godown with Pledge Loan',
      advice: 'Dry wheat (moisture < 12%) is highly storable in warehouse for 6-9 months. Avail 75% e-NWR pledge loan at 7% interest.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 32,
      condition: 'Sunny & Clear',
      rainProbability: 5,
      humidity: 35,
      advisory: 'Dry summer conditions. Zero rain hazard. Ideal for open threshing and transit.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-wh-1',
        name: 'Sehore Kisan Samriddhi FPO',
        type: 'FPO Procurement Hub',
        lat: 23.2050,
        lng: 77.0800,
        contactNumber: '07562-223311',
        paymentTerms: 'Direct bank transfer within 24 hrs',
        verified: true
      }
    ]
  },

  soybean: {
    cropId: 'soybean',
    name: 'Soybean',
    emoji: '🌱',
    aliases: ['soybean', 'soyabean', 'soya', 'सोयाबीन', 'ಸೋಯಾಬೀನ್', 'సోయాబీన్'],
    standardPricePerKg: 48.5,
    markets: [
      {
        id: 'mkt-latur',
        name: 'Latur APMC Mandi',
        location: 'Main Yard, Latur, Maharashtra',
        lat: 18.4088,
        lng: 76.5604,
        pricePerKg: 49.2,
        pricePerQuintal: 4920,
        paymentTerms: 'Direct electronic transfer',
        isHighest: true
      },
      {
        id: 'mkt-barshi',
        name: 'Barshi APMC Mandi',
        location: 'Barshi, Solapur, Maharashtra',
        lat: 18.2333,
        lng: 75.6947,
        pricePerKg: 47.5,
        pricePerQuintal: 4750,
        paymentTerms: 'Bank NEFT in 24 hrs'
      },
      {
        id: 'mkt-nagpur',
        name: 'Nagpur Kalamna Market',
        location: 'Kalamna, Nagpur, Maharashtra',
        lat: 21.1712,
        lng: 79.1380,
        pricePerKg: 48.0,
        pricePerQuintal: 4800,
        paymentTerms: 'RTGS'
      }
    ],
    storage: {
      warehouseName: 'MSWC Registered Grain Godown Latur',
      lat: 18.4120,
      lng: 76.5650,
      canStore: true,
      shelfLifeDays: 180,
      coldStorageAvailable: false,
      monthlyRentPerKg: 0.15,
      expectedGainPerKg: 4.0,
      recommendedAction: 'Store if moisture < 10%',
      advice: 'If moisture is under 10%, storing for 60-90 days past peak harvest glut typically recovers ₹300-₹450/quintal.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 31,
      condition: 'Partly Cloudy with Humidity',
      rainProbability: 40,
      humidity: 68,
      advisory: 'Moderate cloud cover. Keep tarpaulin ready during transit to avoid moisture absorption.',
      risk: 'caution'
    },
    buyers: [
      {
        id: 'b-sb-1',
        name: 'Marathwada Oilseed Growers FPO',
        type: 'FPO Aggregation Center',
        lat: 18.4050,
        lng: 76.5580,
        contactNumber: '02382-245599',
        paymentTerms: 'Direct payment to farmer bank',
        verified: true
      }
    ]
  },

  paddy: {
    cropId: 'paddy',
    name: 'Paddy / Rice',
    emoji: '🍚',
    aliases: ['paddy', 'dhan', 'rice', 'bhatta', 'vari', 'nel', 'chawal', 'jhona', 'धान', 'ಭತ್ತ', 'వరి', 'நெல்'],
    standardPricePerKg: 23.5,
    markets: [
      {
        id: 'mkt-raichur',
        name: 'Raichur APMC Yard',
        location: 'Raichur Central, Karnataka',
        lat: 16.2076,
        lng: 77.3463,
        pricePerKg: 24.5,
        pricePerQuintal: 2450,
        paymentTerms: '24 Hours RTGS',
        isHighest: true
      },
      {
        id: 'mkt-gangavathi',
        name: 'Gangavathi Rice Hub Yard',
        location: 'Gangavathi, Koppal, Karnataka',
        lat: 15.4326,
        lng: 76.5298,
        pricePerKg: 24.0,
        pricePerQuintal: 2400,
        paymentTerms: 'Mill gate payment'
      },
      {
        id: 'mkt-sindh',
        name: 'Sindhanur Sub-Mandi',
        location: 'Sindhanur, Karnataka',
        lat: 15.7667,
        lng: 76.7667,
        pricePerKg: 23.6,
        pricePerQuintal: 2360,
        paymentTerms: 'Cash / Bank'
      }
    ],
    storage: {
      warehouseName: 'Raichur SWC Warehouse',
      lat: 16.2100,
      lng: 77.3500,
      canStore: true,
      shelfLifeDays: 240,
      coldStorageAvailable: false,
      monthlyRentPerKg: 0.14,
      expectedGainPerKg: 2.0,
      recommendedAction: 'Store if moisture < 14%',
      advice: 'Standard moisture is 14%. Rice millers pay higher premiums when moisture is calibrated below 13.5%.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 33,
      condition: 'Sunny',
      rainProbability: 10,
      humidity: 45,
      advisory: 'Clear dry weather. No rainfall threat. Safe for open transport.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-pd-1',
        name: 'Raichur Sona Masoori Millers Association',
        type: 'Direct Rice Mill Consortium',
        lat: 16.2000,
        lng: 77.3400,
        contactNumber: '08532-231122',
        paymentTerms: 'Instant electronic transfer upon weighment',
        verified: true
      }
    ]
  },

  cotton: {
    cropId: 'cotton',
    name: 'Cotton (Kapas)',
    emoji: '☁️',
    aliases: ['cotton', 'kapas', 'hatti', 'patthi', 'paruthi', 'narma', 'कपास', 'कापूस', 'ಹತ್ತಿ', 'పత్తి', 'பருத்தி'],
    standardPricePerKg: 72.0,
    markets: [
      {
        id: 'mkt-rajkot',
        name: 'Rajkot Bedi APMC Yard',
        location: 'Bedi, Rajkot, Gujarat',
        lat: 22.3364,
        lng: 70.8022,
        pricePerKg: 73.5,
        pricePerQuintal: 7350,
        paymentTerms: 'CCI / Private Ginning e-Transfer',
        isHighest: true
      },
      {
        id: 'mkt-surendra',
        name: 'Surendranagar Cotton Yard',
        location: 'Surendranagar, Gujarat',
        lat: 22.7278,
        lng: 71.6370,
        pricePerKg: 71.8,
        pricePerQuintal: 7180,
        paymentTerms: 'Direct bank transfer'
      }
    ],
    storage: {
      warehouseName: 'Gujarat State Warehousing Corporation',
      lat: 22.3100,
      lng: 70.8100,
      canStore: true,
      shelfLifeDays: 180,
      coldStorageAvailable: false,
      monthlyRentPerKg: 0.25,
      expectedGainPerKg: 5.0,
      recommendedAction: 'Sell at MSP or Ginning Center',
      advice: 'Cotton Corporation of India (CCI) procures at MSP (₹7,121/qtl). Ginning mills pay premium for low moisture (<8%).'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 34,
      condition: 'Dry & Breezy',
      rainProbability: 5,
      humidity: 40,
      advisory: 'Dry conditions. Zero rain risk. Protect lint from road dust during transit.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-ct-1',
        name: 'Cotton Corporation of India (CCI) Center',
        type: 'Government MSP Procurement Center',
        lat: 22.3200,
        lng: 70.8050,
        contactNumber: '1800-266-2244',
        paymentTerms: 'DBT within 48 hours directly into bank',
        verified: true
      }
    ]
  },

  mustard: {
    cropId: 'mustard',
    name: 'Mustard (Sarson)',
    emoji: '🌼',
    aliases: ['mustard', 'sarson', 'sasive', 'avalu', 'kadugu', 'raydo', 'राई', 'सरसों', 'ಸಾಸಿವೆ', 'ఆవాలు'],
    standardPricePerKg: 56.5,
    markets: [
      {
        id: 'mkt-alwar',
        name: 'Alwar APMC Mandi',
        location: 'Alwar Central Yard, Rajasthan',
        lat: 27.5530,
        lng: 76.6346,
        pricePerKg: 57.8,
        pricePerQuintal: 5780,
        paymentTerms: 'Direct RTGS',
        isHighest: true
      },
      {
        id: 'mkt-bharatpur',
        name: 'Bharatpur Mandi',
        location: 'Bharatpur, Rajasthan',
        lat: 27.2152,
        lng: 77.5030,
        pricePerKg: 56.9,
        pricePerQuintal: 5690,
        paymentTerms: 'Same day payment'
      }
    ],
    storage: {
      warehouseName: 'Rajasthan State Warehousing Corporation',
      lat: 27.5600,
      lng: 76.6400,
      canStore: true,
      shelfLifeDays: 300,
      coldStorageAvailable: false,
      monthlyRentPerKg: 0.16,
      expectedGainPerKg: 4.5,
      recommendedAction: 'Hold for oil mill premium',
      advice: 'Mustard with oil content > 40% earns ₹150-₹200/qtl bonus above base mandi rate.'
    },
    weather: {
      district: 'Regional Agro-Zone',
      temp: 31,
      condition: 'Sunny',
      rainProbability: 5,
      humidity: 38,
      advisory: 'Clear skies. Optimal for transport and unloading.',
      risk: 'safe'
    },
    buyers: [
      {
        id: 'b-ms-1',
        name: 'Alwar Mustard Growers FPO Federation',
        type: 'FPO Hub',
        lat: 27.5500,
        lng: 76.6300,
        contactNumber: '0144-2331122',
        paymentTerms: 'DBT payment',
        verified: true
      }
    ]
  }
};

// Match crop from user utterance
export function identifyCropFromText(text: string): VerifiedCropMarketInfo | null {
  const t = text.toLowerCase().trim();
  for (const key of Object.keys(VERIFIED_MARKET_DATABASE)) {
    const info = VERIFIED_MARKET_DATABASE[key];
    if (t.includes(info.name.toLowerCase()) || info.aliases.some(alias => t.includes(alias.toLowerCase()))) {
      return info;
    }
  }
  return null;
}

// Extract quantity in kilograms
export function extractQuantityKgFromText(text: string): number | null {
  const t = text.toLowerCase();
  
  const kgMatch = t.match(/(\d+)\s*(kg|kgs|kilo|kilos|किलो|ಕಿಲೋಗ್ರಾಂ|కిలోలు|கிலோ)/i);
  if (kgMatch) {
    return parseInt(kgMatch[1], 10);
  }

  const qtlMatch = t.match(/(\d+)\s*(quintal|quintals|qtl|qtls|क्विंटल|ಕ್ವಿಂಟಾಲ್|క్వింటాల్)/i);
  if (qtlMatch) {
    return parseInt(qtlMatch[1], 10) * 100;
  }

  const tonMatch = t.match(/(\d+)\s*(ton|tons|tonne|tonnes|टन)/i);
  if (tonMatch) {
    return parseInt(tonMatch[1], 10) * 1000;
  }

  const bagMatch = t.match(/(\d+)\s*(bag|bags|बोरी|बोरियां|ಚೀಲ|బస్తాలు)/i);
  if (bagMatch) {
    return parseInt(bagMatch[1], 10) * 50;
  }

  const bareNumMatch = t.match(/(?:have|of|quantity|amount|total|no|actually)\s+(\d{2,5})(?!\s*(?:rupees|rs|inr|km))/i);
  if (bareNumMatch) {
    return parseInt(bareNumMatch[1], 10);
  }

  return null;
}

// Extract target market from utterance
export function extractMarketTarget(text: string, markets: VerifiedCropMarketInfo['markets']): VerifiedCropMarketInfo['markets'][0] | null {
  const t = text.toLowerCase();
  for (const m of markets) {
    const cityName = m.name.toLowerCase().split(' ')[0];
    if (t.includes(cityName) || t.includes(m.location.toLowerCase().split(',')[0].trim())) {
      return m;
    }
  }
  return null;
}

/**
 * Dynamically calculates distance, transport costs, and net realization for each market
 * strictly from the farmer's selected location to the destination.
 * NEVER reuses prior distances or generates fake numbers.
 */
export async function calculateDynamicMarketItems(
  markets: VerifiedCropMarketInfo['markets'],
  farmerLocation: FarmerLocation,
  vehicle: VehicleOption,
  quantityKg: number
): Promise<ActiveMarketPriceItem[]> {
  const origin = {
    name: `${farmerLocation.village || farmerLocation.district}, ${farmerLocation.state}`,
    lat: farmerLocation.lat,
    lng: farmerLocation.lng
  };

  const calculatedItems = await Promise.all(
    markets.map(async (m) => {
      const destination = {
        name: m.name,
        lat: m.lat,
        lng: m.lng
      };

      // 1. Calculate actual or estimated road distance
      const distanceInfo = await calculateRouteDistance(origin, destination);

      // 2. Calculate transport freight dependent on the distance
      const transportResult = computeTransportCost(distanceInfo, vehicle, quantityKg);

      // 3. Calculate net realization
      const gross = Math.round(m.pricePerKg * quantityKg);
      const netResult = computeNetRealization(gross, transportResult.transportCost, 1.5, 0, 15, 0, quantityKg);

      return {
        id: m.id,
        name: m.name,
        location: m.location,
        lat: m.lat,
        lng: m.lng,
        pricePerKg: m.pricePerKg,
        pricePerQuintal: m.pricePerQuintal,
        distanceKm: distanceInfo.distanceKm,
        distanceStatus: distanceInfo.status,
        distanceLabel: distanceInfo.statusLabel,
        distanceSource: distanceInfo.source,
        isHighest: m.isHighest,
        isLowest: m.isLowest,
        paymentTerms: m.paymentTerms,
        transportCost: transportResult.transportCost,
        transportFormula: transportResult.formulaLabel,
        netInHandPerKg: netResult.netInHandPerKg,
        netTotalEarnings: netResult.netTotalEarnings
      };
    })
  );

  return calculatedItems;
}
