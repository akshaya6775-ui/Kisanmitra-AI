import { Language } from '../types';
import { getCropDisplayName } from './crops';

export function getPriceVoiceResponse(
  cropId: string,
  minPrice: number,
  maxPrice: number,
  highestMarketName: string,
  lang: Language
): string {
  const crop = getCropDisplayName(cropId, lang);
  switch (lang) {
    case 'hi':
      return `वर्तमान में ${crop} का भाव ₹${minPrice} से ₹${maxPrice} प्रति किलो चल रहा है। सबसे अधिक भाव ${highestMarketName} में ₹${maxPrice} प्रति किलो है।`;
    case 'kn':
      return `ಪ್ರಸ್ತುತ ${crop} ದರ ಕೆಜಿಗೆ ₹${minPrice} ರಿಂದ ₹${maxPrice} ವರೆಗೆ ಇದೆ. ಅತ್ಯಧಿಕ ದರ ${highestMarketName} ನಲ್ಲಿ ಕೆಜಿಗೆ ₹${maxPrice} ಇದೆ.`;
    case 'te':
      return `ప్రస్తుతం ${crop} ధర కేజీకి ₹${minPrice} నుండి ₹${maxPrice} వరకు ఉంది. అత్యధిక ధర ${highestMarketName} లో కేజీకి ₹${maxPrice} ఉంది.`;
    case 'ta':
      return `தற்போது ${crop} விலை கிலோவுக்கு ₹${minPrice} முதல் ₹${maxPrice} வரை உள்ளது. அதிகபட்ச விலை ${highestMarketName} சந்தையில் கிலோவுக்கு ₹${maxPrice} கிடைக்கிறது.`;
    case 'ml':
      return `നിലവിൽ ${crop} വില കിലോയ്ക്ക് ₹${minPrice} മുതൽ ₹${maxPrice} വരെയാണ്. ഏറ്റവും ഉയർന്ന വില ${highestMarketName} വിപണിയിൽ കിലോയ്ക്ക് ₹${maxPrice} ആണ്.`;
    case 'mr':
      return `सध्या ${crop} चा भाव ₹${minPrice} ते ₹${maxPrice} प्रति किलो आहे. सर्वाधिक भाव ${highestMarketName} मध्ये ₹${maxPrice} प्रति किलो आहे.`;
    case 'bn':
      return `বর্তমানে ${crop}-এর দর প্রতি কেজিতে ₹${minPrice} থেকে ₹${maxPrice} চলছে। সর্বোচ্চ দর ${highestMarketName}-এ প্রতি কেজিতে ₹${maxPrice}।`;
    case 'gu':
      return `હાલમાં ${crop}નો ભાવ પ્રતિ કિલો ₹${minPrice}થી ₹${maxPrice} છે. સૌથી વધુ ભાવ ${highestMarketName}માં પ્રતિ કિલો ₹${maxPrice} છે.`;
    case 'pa':
      return `ਮੌਜੂਦਾ ਸਮੇਂ ${crop} ਦਾ ਭਾਅ ₹${minPrice} ਤੋਂ ₹${maxPrice} ਪ੍ਰਤੀ ਕਿਲੋ ਚੱਲ ਰਿਹਾ ਹੈ। ਸਭ ਤੋਂ ਵੱਧ ਭਾਅ ${highestMarketName} ਵਿੱਚ ₹${maxPrice} ਪ੍ਰਤੀ ਕਿਲੋ ਹੈ।`;
    case 'or':
      return `ବର୍ତ୍ତମାନ ${crop}ର ଦର କିଲୋ ପିଛା ₹${minPrice} ରୁ ₹${maxPrice} ଚାଲିଛି। ସର୍ବାଧିକ ଦର ${highestMarketName} ରେ କିଲୋ ପିଛା ₹${maxPrice} ଅଛି।`;
    case 'as':
      return `বৰ্তমান ${crop}ৰ দৰ প্ৰতি কেজিত ₹${minPrice}ৰ পৰা ₹${maxPrice} চলি আছে। সৰ্বাধিক দৰ ${highestMarketName}ত প্ৰতি কেজিত ₹${maxPrice}।`;
    default:
      return `The current price of ${crop} is between ₹${minPrice} and ₹${maxPrice} per kg. The highest listed price is ₹${maxPrice} per kg at ${highestMarketName}.`;
  }
}

export function getDistanceVoiceResponse(
  marketName: string,
  distanceKm: number | null,
  distanceLabel: string,
  lang: Language
): string {
  if (distanceKm === null) {
    switch (lang) {
      case 'hi': return `माफ़ कीजिए, ${marketName} की दूरी की गणना के लिए सटीक स्थान उपलब्ध नहीं है।`;
      case 'kn': return `${marketName} ಗೆ ದೂರ ಲಭ್ಯವಿಲ್ಲ.`;
      case 'te': return `${marketName} కు దూరం అందుబాటులో లేదు.`;
      case 'ta': return `${marketName} சந்தைக்கு தூரம் கிடைக்கவில்லை.`;
      case 'ml': return `${marketName} വിപണിയിലേക്കുള്ള ദൂരം ലഭ്യമല്ല.`;
      case 'mr': return `क्षमस्व, ${marketName} चे अंतर उपलब्ध नाही.`;
      case 'bn': return `দুঃখিত, ${marketName}-এর দূরত্ব পাওয়া যায়নি।`;
      case 'gu': return `માફ કરશો, ${marketName}નું અંતર ઉપલબ્ધ નથી.`;
      case 'pa': return `ਮਾਫ਼ ਕਰਨਾ, ${marketName} ਦੀ ਦੂਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।`;
      case 'or': return `କ୍ଷମା କରିବେ, ${marketName} ର ଦୂରତା ଉପଲବ୍ଧ ନାହିଁ।`;
      case 'as': return `ক্ষমা কৰিব, ${marketName}ৰ দূৰত্ব উপলব্ধ নহয়।`;
      default: return `Distance to ${marketName} is currently unavailable.`;
    }
  }

  switch (lang) {
    case 'hi':
      return `आपके स्थान से ${marketName} की सड़क दूरी लगभग ${distanceKm} किलोमीटर है।`;
    case 'kn':
      return `ನಿಮ್ಮ ಸ್ಥಳದಿಂದ ${marketName} ಗೆ ರಸ್ತೆ ದೂರ ಸುಮಾರು ${distanceKm} ಕಿಮೀ.`;
    case 'te':
      return `మీ ప్రాంతం నుంచి ${marketName} కు రోడ్డు దూరం సుమారు ${distanceKm} కిలోమీటర్లు.`;
    case 'ta':
      return `உங்கள் இடத்திலிருந்து ${marketName} சந்தைக்கு சாலை தூரம் சுமார் ${distanceKm} கி.மீ.`;
    case 'ml':
      return `നിങ്ങളുടെ സ്ഥലത്ത് നിന്ന് ${marketName} വിപണിയിലേക്ക് റോഡ് ദൂരം ഏകദേശം ${distanceKm} കി.മീ.`;
    case 'mr':
      return `आपल्या ठिकाणावरून ${marketName} चे रस्ता अंतर अंदाજે ${distanceKm} किमी आहे.`;
    case 'bn':
      return `আপনার অবস্থান থেকে ${marketName}-এর সড়ক দূরত্ব প্রায় ${distanceKm} কিমি।`;
    case 'gu':
      return `તમારા સ્થળેથી ${marketName}નું સડક અંતર આશરે ${distanceKm} કિમી છે.`;
    case 'pa':
      return `ਤੁਹਾਡੇ ਟਿਕਾਣੇ ਤੋਂ ${marketName} ਦੀ ਸੜਕੀ ਦੂਰੀ ਲਗਭਗ ${distanceKm} ਕਿਲੋਮੀਟਰ ਹੈ।`;
    case 'or':
      return `ଆପଣଙ୍କ ସ୍ଥାନରୁ ${marketName} ର ସଡ଼କ ଦୂରତା ପ୍ରାୟ ${distanceKm} କିଲୋମିଟର।`;
    case 'as':
      return `আপোনাৰ স্থানৰ পৰা ${marketName}ৰ পথৰ দূৰত্ব প্ৰায় ${distanceKm} কিলোমিটাৰ।`;
    default:
      return `The distance to ${marketName} from your location is approximately ${distanceKm} km (${distanceLabel}).`;
  }
}

export function getNetTransportVoiceResponse(
  marketName: string,
  quantityKg: number,
  grossVal: number,
  freightCost: number | null,
  mandiCess: number,
  netInHand: number | null,
  netPerKg: string | null,
  lang: Language
): string {
  if (freightCost === null || netInHand === null || netPerKg === null) {
    switch (lang) {
      case 'hi': return `दूरी अनुपलब्ध होने के कारण भाड़े की गणना नहीं की जा सकी। कृपया अपना स्थान सत्यापित करें।`;
      case 'kn': return `ದೂರ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಸಾರಿಗೆ ವೆಚ್ಚ ಲೆಕ್ಕಹಾಕಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಳ ನಮೂದಿಸಿ.`;
      case 'te': return `దూరం లేకపోవడం వల్ల రవాణా ఖర్చు లెక్కించలేకపోయాము. దయచేసి ప్రాంతం నమోదు చేయండి.`;
      case 'ta': return `தூரம் கிடைக்காததால் போக்குவரத்து செலவை கணக்கிட முடியவில்லை.`;
      case 'ml': return `ദൂരം ലഭ്യമല്ലാത്തതിനാൽ ഗതാഗതച്ചെലവ് കണക്കാക്കാനായില്ല.`;
      case 'mr': return `अंतर उपलब्ध नसल्याने वाहतूक भाडे मोजता आले नाही.`;
      case 'bn': return `দূরত্ব না পাওয়ায় গাড়ির ভাড়া হিসাব করা যায়নি।`;
      case 'gu': return `અંતર ઉપલબ્ધ ન હોવાથી વાહનભાડું ગણી શકાયું નથી.`;
      case 'pa': return `ਦੂਰੀ ਉਪਲਬਧ ਨਾ ਹੋਣ ਕਰਕੇ ਕਿਰਾਇਆ ਨਹੀਂ ਗਿਣਿਆ ਜਾ ਸਕਿਆ।`;
      case 'or': return `ଦୂରତା ନଥିବାରୁ ଗାଡ଼ିଭଡ଼ା ଗଣନା ହୋଇପାରିଲା ନାହିଁ।`;
      case 'as': return `দূৰত্ব নথকাৰ বাবে গাড়ীভাড়া গণনা কৰিব পৰা নগ’ল।`;
      default: return `Transport cost cannot be calculated because distance is unavailable. Please verify your farm location.`;
    }
  }

  switch (lang) {
    case 'hi':
      return `${marketName} में ${quantityKg} किलो का कुल मूल्य ₹${grossVal} होगा। ₹${freightCost} भाड़ा और ₹${mandiCess} मंडी शुल्क काटकर, हाथ में लगभग ₹${netInHand.toLocaleString('en-IN')} शुद्ध बचेंगे, जो ₹${netPerKg} प्रति किलो है।`;
    case 'kn':
      return `${quantityKg} ಕೆಜಿ ಬೆಳೆಗೆ ${marketName} ನಲ್ಲಿ ₹${freightCost} ಸಾರಿಗೆ ಮತ್ತು ₹${mandiCess} ಮಂಡಿ ಕಡಿತದ ನಂತರ ನಿವ್ವಳ ₹${netInHand.toLocaleString('en-IN')} (ಕೆಜಿಗೆ ₹${netPerKg}) ಸಿಗುತ್ತದೆ.`;
    case 'te':
      return `${marketName} లో ${quantityKg} కేజీలకు రవాణా కిరాయి ₹${freightCost} మరియు మార్కెట్ పన్ను తీసివేయగా చేతికి సుమారు ₹${netInHand.toLocaleString('en-IN')} (కేజీకి ₹${netPerKg}) నికరంగా వస్తుంది.`;
    case 'ta':
      return `${marketName} சந்தையில் ${quantityKg} கிலோவுக்கு ₹${freightCost} போக்குவரத்து மற்றும் வரி பிடித்தம் போக கையில் நிகரமாக ₹${netInHand.toLocaleString('en-IN')} (கிலோவுக்கு ₹${netPerKg}) கிடைக்கும்.`;
    case 'ml':
      return `${marketName} വിപണിയിൽ ${quantityKg} കിലോയ്ക്ക് ₹${freightCost} വാടകയും ഫീസും കഴിഞ്ഞ് കയ്യിൽ ₹${netInHand.toLocaleString('en-IN')} (കിലോയ്ക്ക് ₹${netPerKg}) ലഭിക്കും.`;
    case 'mr':
      return `${marketName} मध्ये ${quantityKg} किलोसाठी ₹${freightCost} वाहतूक भाडे व कर वजा जाता हातात अंदाજે ₹${netInHand.toLocaleString('en-IN')} (प्रति किलो ₹${netPerKg}) निव्वळ नफा राहील.`;
    case 'bn':
      return `${marketName}-এ ${quantityKg} কেজিতে ₹${freightCost} গাড়িভাড়া ও কর কাটার পর হাতে প্রায় ₹${netInHand.toLocaleString('en-IN')} (কেজিতে ₹${netPerKg}) নিট থাকবে।`;
    case 'gu':
      return `${marketName}માં ${quantityKg} કિલો માટે ₹${freightCost} વાહનભાડું અને ટેક્સ બાદ કરતાં હાથમાં આશરે ₹${netInHand.toLocaleString('en-IN')} (કિલો દીઠ ₹${netPerKg}) ચોખ્ખો નફો મળશે.`;
    case 'pa':
      return `${marketName} ਵਿੱਚ ${quantityKg} ਕਿਲੋ ਲਈ ₹${freightCost} ਕਿਰਾਇਆ ਅਤੇ ਫ਼ੀਸ ਕੱਟ ਕੇ ਹੱਥ ਵਿੱਚ ਲਗਭਗ ₹${netInHand.toLocaleString('en-IN')} (ਪ੍ਰਤੀ ਕਿਲੋ ₹${netPerKg}) ਸ਼ੁੱਧ ਬਚੇਗਾ।`;
    case 'or':
      return `${marketName} ରେ ${quantityKg} କିଲୋ ପାଇଁ ₹${freightCost} ଭଡ଼ା ଓ କର କାଟିବା ପରେ ହାତକୁ ପ୍ରାୟ ₹${netInHand.toLocaleString('en-IN')} (କିଲୋ ପିଛା ₹${netPerKg}) ନିଟ୍ ମିଳିବ।`;
    case 'as':
      return `${marketName}ত ${quantityKg} কেজিৰ বাবে ₹${freightCost} ভাড়া আৰু কৰ কটাৰ পাছত হাতলৈ প্ৰায় ₹${netInHand.toLocaleString('en-IN')} (কেজিত ₹${netPerKg}) নিট লাভ আহিব।`;
    default:
      return `For ${quantityKg} kg at ${marketName}, after deducting ₹${freightCost} transport and ₹${mandiCess} cess, your net in-hand earnings will be ₹${netInHand.toLocaleString('en-IN')} (≈ ₹${netPerKg}/kg).`;
  }
}

export function getGrossValueVoiceResponse(
  marketName: string,
  quantityKg: number,
  cropId: string,
  pricePerKg: number,
  grossVal: number,
  lang: Language
): string {
  const crop = getCropDisplayName(cropId, lang);
  switch (lang) {
    case 'hi':
      return `${quantityKg} किलो ${crop} के लिए ${marketName} में भाव ₹${pricePerKg} प्रति किलो है। आपकी कुल बिक्री लगभग ₹${grossVal.toLocaleString('en-IN')} होगी।`;
    case 'kn':
      return `${quantityKg} ಕೆಜಿ ${crop} ಗೆ ${marketName} ನಲ್ಲಿ ₹${pricePerKg}/ಕೆಜಿ ದರದಲ್ಲಿ ಒಟ್ಟು ₹${grossVal.toLocaleString('en-IN')} ಸಿಗುತ್ತದೆ.`;
    case 'te':
      return `${quantityKg} కేజీల ${crop} కు ${marketName} లో కేజీకి ₹${pricePerKg} చొప్పున మొత్తం ₹${grossVal.toLocaleString('en-IN')} స్థూల ఆదాయం వస్తుంది.`;
    case 'ta':
      return `${marketName} சந்தையில் ${quantityKg} கிலோ ${crop}-க்கு கிலோ ₹${pricePerKg} வீதம் மொத்தம் ₹${grossVal.toLocaleString('en-IN')} கிடைக்கும்.`;
    case 'ml':
      return `${marketName} വിപണിയിൽ ${quantityKg} കിലോ ${crop}-ന് കിലോയ്ക്ക് ₹${pricePerKg} നിരക്കിൽ ആകെ ₹${grossVal.toLocaleString('en-IN')} ലഭിക്കും.`;
    case 'mr':
      return `${marketName} मध्ये ${quantityKg} किलो ${crop} साठी ₹${pricePerKg} प्रति किलो दराने एकूण ₹${grossVal.toLocaleString('en-IN')} मिळकत होईल.`;
    case 'bn':
      return `${marketName}-এ ${quantityKg} কেজি ${crop}-এর জন্য প্রতি কেজি ₹${pricePerKg} দরে মোট প্রায় ₹${grossVal.toLocaleString('en-IN')} হবে।`;
    case 'gu':
      return `${marketName}માં ${quantityKg} કિલો ${crop} માટે કિલોના ₹${pricePerKg} લેખે કુલ આશરે ₹${grossVal.toLocaleString('en-IN')} ઉપજ થશે.`;
    case 'pa':
      return `${marketName} ਵਿੱਚ ${quantityKg} ਕਿਲੋ ${crop} ਲਈ ₹${pricePerKg} ਪ੍ਰਤੀ ਕਿਲੋ ਦੇ ਹਿਸਾਬ ਨਾਲ ਕੁੱਲ ਆਮਦਨ ਲਗਭਗ ₹${grossVal.toLocaleString('en-IN')} ਹੋਵੇਗੀ।`;
    case 'or':
      return `${marketName} ରେ ${quantityKg} କିଲୋ ${crop} ପାଇଁ କିଲୋ ପିଛା ₹${pricePerKg} ହିସାବରେ ମୋଟ ପ୍ରାୟ ₹${grossVal.toLocaleString('en-IN')} ମିଳିବ।`;
    case 'as':
      return `${marketName}ত ${quantityKg} কেজি ${crop}ৰ বাবে প্ৰতি কেজিত ₹${pricePerKg} হিচাপত মুঠ প্ৰায় ₹${grossVal.toLocaleString('en-IN')} হ’ব।`;
    default:
      return `For ${quantityKg} kg of ${crop} at ${marketName} (₹${pricePerKg}/kg), your gross selling value is ₹${grossVal.toLocaleString('en-IN')}.`;
  }
}

export function getStorageVoiceResponse(
  cropId: string,
  canStore: boolean,
  shelfLifeDays: number,
  advice: string,
  lang: Language
): string {
  const crop = getCropDisplayName(cropId, lang);
  if (canStore) {
    switch (lang) {
      case 'hi': return `${crop} को भंडारित किया जा सकता है। इसकी शेल्फ-लाइफ लगभग ${shelfLifeDays} दिन है। ${advice}`;
      case 'kn': return `${crop} ಅನ್ನು ಗೋದಾಮಿನಲ್ಲಿ ಇಡಬಹುದು. ಇದರ ಬಾಳಿಕೆ ಸುಮಾರು ${shelfLifeDays} ದಿನಗಳು. ${advice}`;
      case 'te': return `${crop} ను గిడ్డంగిలో నిల్వ చేయవచ్చు. దీని నిల్వ సామర్థ్యం ಸುಮಾರು ${shelfLifeDays} రోజులు. ${advice}`;
      case 'ta': return `${crop}-ஐ கிடங்கில் சேமித்து வைக்கலாம். இதன் சேமிப்பு காலம் சுமார் ${shelfLifeDays} நாட்கள்.`;
      case 'ml': return `${crop} വെയർഹൗസിൽ സൂക്ഷിക്കാം. സൂക്ഷിപ്പ് കാലാവധി ഏകദേശം ${shelfLifeDays} ദിവസമാണ്.`;
      case 'mr': return `${crop} गोदामात साठवता येईल. साठवणूक कालावधी अंदाજે ${shelfLifeDays} दिवस आहे. ${advice}`;
      case 'bn': return `${crop} গুদামে সংরক্ষণ করা যাবে। এর স্বাভাবিক মেয়াদ প্রায় ${shelfLifeDays} দিন।`;
      case 'gu': return `${crop}ને ગોદામમાં સંગ્રહી શકાય છે. તેની સંગ્રહ ક્ષમતા આશરે ${shelfLifeDays} દિવસ છે.`;
      case 'pa': return `${crop} ਨੂੰ ਗੋਦਾਮ ਵਿੱਚ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਇਸਦਾ ਸਮਾਂ ਲਗਭਗ ${shelfLifeDays} ਦਿਨ ਹੈ।`;
      case 'or': return `${crop} କୁ ଗୋଦାମରେ ସାଇତି ରଖାଯାଇପାରିବ। ଏହାର ସମୟ ପ୍ରାୟ ${shelfLifeDays} ଦିନ।`;
      case 'as': return `${crop} গুদামত সাঁচি ৰাখিব পাৰি। ইয়াৰ সময় প্ৰায় ${shelfLifeDays} দিন।`;
      default: return `Yes, ${crop} can be stored safely for up to ${shelfLifeDays} days. ${advice}`;
    }
  } else {
    switch (lang) {
      case 'hi': return `${crop} जल्दी खराब होने वाली फसल है। इसकी शेल्फ-लाइफ केवल ${shelfLifeDays} दिन है, इसलिए तुरंत बेचना ही सुरक्षित है।`;
      case 'kn': return `${crop} ಬೇಗ ಹಾಳಾಗುವ ಬೆಳೆಯಾಗಿದೆ (ಕೇವಲ ${shelfLifeDays} ದಿನಗಳ ಬಾಳಿಕೆ). ಆದ್ದರಿಂದ ಕೂಡಲೇ ಮಾರಾಟ ಮಾಡುವುದು ಉತ್ತಮ.`;
      case 'te': return `${crop} త్వరగా పాడయ్యే పంట (కేవలం ${shelfLifeDays} రోజుల నిల్వ). కాబట్టి వెంటనే అమ్మడం శ్రేయస్కరం.`;
      case 'ta': return `${crop} விரைவில் கெட்டுப்போகும் பயிர் (சுமார் ${shelfLifeDays} நாட்கள் மட்டுமே இருக்கும்). உடனே விற்பதே நல்லது.`;
      case 'ml': return `${crop} വേഗത്തിൽ കേടാകുന്ന വിളവാണ് (${shelfLifeDays} ദിവസം മാത്രം). ഉടൻ വിൽക്കുന്നതാണ് ഉചിതം.`;
      case 'mr': return `${crop} नाशवंत पीक आहे (फक्त ${shelfLifeDays} दिवस टिकते). त्यामुळे लगेच विक्री करणे योग्य आहे.`;
      case 'bn': return `${crop} পচনশীল ফসল (মাত্র ${shelfLifeDays} দিন থাকে)। এখনই বিক্রি করাই নিরাপদ।`;
      case 'gu': return `${crop} ઝડપથી બગડતો પાક છે (માત્ર ${shelfLifeDays} દિવસ ટકે છે). તરત વેચી દેવું શ્રેષ્ઠ રહેશે.`;
      case 'pa': return `${crop} ਛੇਤੀ ਖ਼ਰਾਬ ਹੋਣ ਵਾਲੀ ਫ਼ਸਲ ਹੈ (${shelfLifeDays} ਦਿਨ ਦੀ ਮਿਆਦ)। ਤੁਰੰਤ ਵੇਚਣਾ ਹੀ ਠੀਕ ਹੈ।`;
      case 'or': return `${crop} ଶୀଘ୍ର ନଷ୍ଟ ହେଉଥିବା ଫସଲ (କେବଳ ${shelfLifeDays} ଦିନ ରହେ)। ତୁରନ୍ତ ବିକ୍ରି କରିବା ଉଚିତ୍।`;
      case 'as': return `${crop} সোনকালে নষ্ট হোৱা শস্য (মাত্ৰ ${shelfLifeDays} দিন থাকে)। এতিয়াই বিক্ৰী কৰা উচিত।`;
      default: return `No, ${crop} is perishable with a shelf life of only ${shelfLifeDays} days. Immediate sale is strongly advised.`;
    }
  }
}

export function getWeatherVoiceResponse(
  district: string,
  temp: number,
  rainProbability: number,
  advisory: string,
  lang: Language
): string {
  switch (lang) {
    case 'hi': return `${district} में मौसम: तापमान ${temp} डिग्री और बारिश की संभावना ${rainProbability}% है। ${advisory}`;
    case 'kn': return `${district} ನಲ್ಲಿ ತಾಪಮಾನ ${temp}°C ಮತ್ತು ಮಳೆಯ ಸಾಧ್ಯತೆ ${rainProbability}%. ${advisory}`;
    case 'te': return `${district} లో ఉష్ణోగ్రత ${temp}°C మరియు వర్షం పడే అవకాశం ${rainProbability}%. ${advisory}`;
    case 'ta': return `${district} பகுதியில் வெப்பநிலை ${temp}°C மற்றும் மழை வாய்ப்பு ${rainProbability}%.`;
    case 'ml': return `${district} പ്രദേശത്ത് താപനില ${temp}°C, മഴ സാധ്യത ${rainProbability}%.`;
    case 'mr': return `${district} मध्ये तापमान ${temp}°C आणि पावसाची शक्यता ${rainProbability}% आहे. ${advisory}`;
    case 'bn': return `${district}-এ তাপমাত্রা ${temp}°C এবং বৃষ্টির সম্ভাবনা ${rainProbability}%।`;
    case 'gu': return `${district}માં તાપમાન ${temp}°C અને વરસાદની સંભાવના ${rainProbability}% છે.`;
    case 'pa': return `${district} ਵਿੱਚ ਤਾਪਮਾਨ ${temp}°C ਅਤੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${rainProbability}% ਹੈ।`;
    case 'or': return `${district} ରେ ତାପମାତ୍ରା ${temp}°C ଏବଂ ବର୍ଷାର ସମ୍ଭାବନା ${rainProbability}% ଅଛି।`;
    case 'as': return `${district}ত উত্তাপ ${temp}°C আৰু বৰষুণৰ সম্ভাৱনা ${rainProbability}%।`;
    default: return `In ${district}, the temperature is ${temp}°C with ${rainProbability}% rain probability. ${advisory}`;
  }
}

export function getBuyersVoiceResponse(
  count: number,
  topBuyerName: string,
  lang: Language
): string {
  switch (lang) {
    case 'hi': return `आपके क्षेत्र में ${count} सत्यापित प्रत्यक्ष खरीदार और FPO केंद्र उपलब्ध हैं। पहला विकल्प ${topBuyerName} है।`;
    case 'kn': return `ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ${count} ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದਾਰರು ಮತ್ತು ಎಫ್‌ಪಿಒ ಕೇಂದ್ರಗಳು ಲಭ್ಯವಿದೆ. ಮೊದಲ ಆಯ್ಕೆ ${topBuyerName}.`;
    case 'te': return `మీ ప్రాంతంలో ${count} ధృవీకరించిన కొనుగోలుదారులు మరియు FPO కేంద్రాలు ఉన్నాయి. మొదటిది ${topBuyerName}.`;
    case 'ta': return `உங்கள் பகுதியில் ${count} சரிபார்க்கப்பட்ட நேரடி வாங்குபவர்கள் மற்றும் FPO மையங்கள் உள்ளன.`;
    case 'ml': return `നിങ്ങളുടെ പ്രദേശത്ത് ${count} സ്ഥിരീകരിച്ച വാങ്ങലുകാരും FPO കേന്ദ്രങ്ങളുമുണ്ട്.`;
    case 'mr': return `आपल्या भागात ${count} प्रमाणित थेट खरेदीदार व FPO केंद्रे उपलब्ध आहेत. पहिला पर्याय ${topBuyerName} आहे.`;
    case 'bn': return `আপনার এলাকায় ${count}টি যাচাইকৃত ক্রেতা ও FPO কেন্দ্র রয়েছে। শীর্ষ বিকল্প ${topBuyerName}।`;
    case 'gu': return `તમારા વિસ્તારમાં ${count} ચકાસાયેલા ખરીદદારો અને FPO કેન્દ્રો ઉપલબ્ધ છે. મુખ્ય વિકલ્પ ${topBuyerName} છે.`;
    case 'pa': return `ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ${count} ਪ੍ਰਮਾਣਿਤ ਖ਼ਰੀਦਦਾਰ ਤੇ FPO ਕੇਂਦਰ ਉਪਲਬਧ ਹਨ। ਪਹਿਲਾ ਬਦਲ ${topBuyerName} ਹੈ।`;
    case 'or': return `ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ${count}ଟି ପ୍ରମାଣିତ କ୍ରେତା ଓ FPO କେନ୍ଦ୍ର ଅଛି। ପ୍ରଥମ ବିକଳ୍ପ ${topBuyerName}।`;
    case 'as': return `আপোনাৰ অঞ্চলত ${count}টা পৰীক্ষিত ক্ৰেতা আৰু FPO কেন্দ্ৰ আছে। প্ৰথম বিকল্প ${topBuyerName}।`;
    default: return `There are ${count} verified direct buyers and FPO centers available. Top option is ${topBuyerName}.`;
  }
}
