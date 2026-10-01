import { Language } from '../types';

export interface MultilingualCropEntry {
  id: string;
  names: Record<Language, string>;
  category: string;
  emoji: string;
}

export const MULTILINGUAL_CROP_DICTIONARY: Record<string, MultilingualCropEntry> = {
  tomato: {
    id: 'tomato',
    emoji: '🍅',
    category: 'Vegetables',
    names: {
      en: 'Tomato',
      hi: 'टमाटर',
      kn: 'ಟೊಮೆಟೊ',
      te: 'టమాట',
      ta: 'தக்காளி',
      ml: 'തക്കാളി',
      mr: 'टोमॅटो',
      bn: 'টমেটো',
      gu: 'ટામેટા',
      pa: 'ਟਮਾਟਰ',
      or: 'ବିଲାତି ବାଇଗଣ',
      as: 'বিলাহী'
    }
  },
  onion: {
    id: 'onion',
    emoji: '🧅',
    category: 'Vegetables',
    names: {
      en: 'Onion',
      hi: 'प्याज',
      kn: 'ಈರುಳ್ಳಿ',
      te: 'ఉల్లిపాయ',
      ta: 'வெங்காயம்',
      ml: 'സവാള',
      mr: 'कांदा',
      bn: 'পেঁয়াজ',
      gu: 'ડુંગળી',
      pa: 'ਪਿਆਜ਼',
      or: 'ପିଆଜ',
      as: 'পিয়াঁজ'
    }
  },
  potato: {
    id: 'potato',
    emoji: '🥔',
    category: 'Vegetables',
    names: {
      en: 'Potato',
      hi: 'आलू',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      te: 'బంగాళాదుంప',
      ta: 'உருளைக்கிழங்கு',
      ml: 'ഉരുളക്കിഴങ്ങ്',
      mr: 'बटाटा',
      bn: 'আলু',
      gu: 'બટાટા',
      pa: 'ਆਲੂ',
      or: 'ଆଳୁ',
      as: 'আলু'
    }
  },
  wheat: {
    id: 'wheat',
    emoji: '🌾',
    category: 'Cereals',
    names: {
      en: 'Wheat',
      hi: 'गेहूं',
      kn: 'ಗೋಧಿ',
      te: 'గోధుమలు',
      ta: 'கோதுமை',
      ml: 'ഗോതമ്പ്',
      mr: 'गहू',
      bn: 'গম',
      gu: 'ઘઉં',
      pa: 'ਕਣਕ',
      or: 'ଗହମ',
      as: 'ঘেঁহু'
    }
  },
  paddy: {
    id: 'paddy',
    emoji: '🌾',
    category: 'Cereals',
    names: {
      en: 'Paddy (Rice)',
      hi: 'धान (चावल)',
      kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',
      te: 'వరి (బియ్యం)',
      ta: 'நெல் (அரிசி)',
      ml: 'നെല്ല് (അരി)',
      mr: 'भात / धान',
      bn: 'ধান (চাল)',
      gu: 'ડાંગર (ચોખા)',
      pa: 'ਝੋਨਾ (ਚੌਲ)',
      or: 'ଧାନ',
      as: 'ধান'
    }
  },
  soybean: {
    id: 'soybean',
    emoji: '🌱',
    category: 'Oilseeds',
    names: {
      en: 'Soybean',
      hi: 'सोयाबीन',
      kn: 'ಸೋಯಾಬೀನ್',
      te: 'సోయాబీన్',
      ta: 'சோயாபீன்',
      ml: 'സോയാബീൻ',
      mr: 'सोयाबीन',
      bn: 'সয়াবিন',
      gu: 'સોયાબીન',
      pa: 'ਸੋਇਆਬੀਨ',
      or: 'ସୋୟାବିନ୍',
      as: 'চয়াবিন'
    }
  },
  cotton: {
    id: 'cotton',
    emoji: '☁️',
    category: 'Commercial',
    names: {
      en: 'Cotton',
      hi: 'कपास',
      kn: 'ಹತ್ತಿ',
      te: 'పత్తి',
      ta: 'பருத்தி',
      ml: 'പരുത്തി',
      mr: 'कापूस',
      bn: 'তুলা',
      gu: 'કપાસ',
      pa: 'ਕਪਾਹ',
      or: 'କପା',
      as: 'কপাহ'
    }
  },
  maize: {
    id: 'maize',
    emoji: '🌽',
    category: 'Cereals',
    names: {
      en: 'Maize (Corn)',
      hi: 'मक्का',
      kn: 'ಮೆಕ್ಕೆಜೋಳ',
      te: 'మొక్కజొన్న',
      ta: 'மக்காச்சோளம்',
      ml: 'ചോളം',
      mr: 'मका',
      bn: 'ভুট্টা',
      gu: 'મકાઈ',
      pa: 'ਮੱਕੀ',
      or: 'ମକା',
      as: 'মাকৈ'
    }
  },
  mustard: {
    id: 'mustard',
    emoji: '🌼',
    category: 'Oilseeds',
    names: {
      en: 'Mustard',
      hi: 'सरसों',
      kn: 'ಸಾಸಿವೆ',
      te: 'ఆవాలు',
      ta: 'கடுகு',
      ml: 'കടുക്',
      mr: 'मोहरी',
      bn: 'সরিষা',
      gu: 'રાઈ',
      pa: 'ਸਰ੍ਹੋਂ',
      or: 'ସୋରିଷ',
      as: 'সৰিয়হ'
    }
  },
  chana: {
    id: 'chana',
    emoji: '🧆',
    category: 'Pulses',
    names: {
      en: 'Bengal Gram (Chana)',
      hi: 'चना',
      kn: 'ಕಡಲೆ',
      te: 'శనగలు',
      ta: 'கொண்டைக்கடலை',
      ml: 'കടല',
      mr: 'हरभरा',
      bn: 'ছোলা',
      gu: 'ચણા',
      pa: 'ਛੋਲੇ',
      or: 'ଚଣା',
      as: 'বুটমাহ'
    }
  },
  groundnut: {
    id: 'groundnut',
    emoji: '🥜',
    category: 'Oilseeds',
    names: {
      en: 'Groundnut',
      hi: 'मूंगफली',
      kn: 'ಕಡಲೆಕಾಯಿ (ಶೇಂಗಾ)',
      te: 'వేరుశనగ',
      ta: 'நிலக்கடலை',
      ml: 'നിലക്കടല',
      mr: 'भुईमूग',
      bn: 'চিনাবাদাম',
      gu: 'મગફળી',
      pa: 'ਮੂੰਗਫਲੀ',
      or: 'ଚିନାବାଦାମ',
      as: 'বাদাম'
    }
  },
  turmeric: {
    id: 'turmeric',
    emoji: '🫚',
    category: 'Spices',
    names: {
      en: 'Turmeric',
      hi: 'हल्दी',
      kn: 'ಅರಿಶಿನ',
      te: 'పసుపు',
      ta: 'மஞ்சள்',
      ml: 'മഞ്ഞൾ',
      mr: 'हळद',
      bn: 'হলুদ',
      gu: 'હળદર',
      pa: 'ਹਲਦੀ',
      or: 'ହଳଦୀ',
      as: 'হালধি'
    }
  }
};

export function getCropDisplayName(cropIdOrName: string, lang: Language): string {
  const normalized = cropIdOrName.toLowerCase().trim();
  for (const [key, crop] of Object.entries(MULTILINGUAL_CROP_DICTIONARY)) {
    if (key === normalized || crop.names.en.toLowerCase() === normalized || crop.id === normalized) {
      return crop.names[lang] || crop.names.en;
    }
    for (const [l, n] of Object.entries(crop.names)) {
      if (n.toLowerCase() === normalized) {
        return crop.names[lang] || crop.names.en;
      }
    }
  }
  return cropIdOrName;
}

export function getCategoryDisplayName(category: string, lang: Language): string {
  const cat = category.toLowerCase();
  const map: Record<string, Record<Language, string>> = {
    vegetables: {
      en: 'Vegetables', hi: 'सब्जियां', kn: 'ತರಕಾರಿಗಳು', te: 'కూరగాయలు',
      ta: 'காய்கறிகள்', ml: 'പച്ചക്കറികൾ', mr: 'भाज्या', bn: 'শাকসবজি',
      gu: 'શાકભાજી', pa: 'ਸਬਜ਼ੀਆਂ', or: 'ପନିପରିବା', as: 'শাক-পাচলি'
    },
    cereals: {
      en: 'Cereals', hi: 'अनाज', kn: 'ಧಾನ್ಯಗಳು', te: 'తృణధాన్యాలు',
      ta: 'தானியங்கள்', ml: 'ധാന്യങ്ങൾ', mr: 'तृणधान्ये', bn: 'দানাশস্য',
      gu: 'અનાજ', pa: 'ਅਨਾਜ', or: 'ଶସ୍ୟ', as: 'শস্য'
    },
    pulses: {
      en: 'Pulses', hi: 'दालें', kn: 'ಬೇಳೆಕಾಳುಗಳು', te: 'పప్పుధాನ್ಯాలు',
      ta: 'பருப்பு வகைகள்', ml: 'പയറുവർഗ്ഗങ്ങൾ', mr: 'डाळी', bn: 'ডাল',
      gu: 'કઠોળ', pa: 'ਦਾਲਾਂ', or: 'ଡାଲି', as: 'দাইল'
    },
    commercial: {
      en: 'Commercial', hi: 'नकदी फसलें', kn: 'ವಾಣಿಜ್ಯ ಬೆಳೆಗಳು', te: 'వాణిజ్య పంటలు',
      ta: 'வணிகப் பயிர்கள்', ml: 'വാണിജ്യ വിളകൾ', mr: 'व्यावसायिक पिके', bn: 'বাণিজ্যিক ফসল',
      gu: 'રોકડિયા પાક', pa: 'ਵਪਾਰਕ ਫਸਲਾਂ', or: 'ବାଣିଜ୍ୟିକ ଫସଲ', as: 'বাণিজ্যিক শস্য'
    },
    oilseeds: {
      en: 'Oilseeds', hi: 'तिलहन', kn: 'ಎಣ್ಣೆಕಾಳುಗಳು', te: 'నూనెగింజలు',
      ta: 'எண்ணெய் வித்துக்கள்', ml: 'എണ്ണക്കുരുക്കൾ', mr: 'गळित धान्ये', bn: 'তৈলবীজ',
      gu: 'તેલીબિયાં', pa: 'ਤੇਲ ਬੀਜ', or: 'ତୈଳବୀଜ', as: 'তৈলবীজ'
    },
    spices: {
      en: 'Spices', hi: 'मसाले', kn: 'ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು', te: 'సుగంధ ద్రవ్యాలు',
      ta: 'மசாலா பொருட்கள்', ml: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ', mr: 'मसाले', bn: 'মসলা',
      gu: 'મસાલા', pa: 'ਮਸਾਲੇ', or: 'ମସଲା', as: 'মচলা'
    }
  };

  return map[cat]?.[lang] || category;
}
