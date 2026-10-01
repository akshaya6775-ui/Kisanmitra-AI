import { FarmerLocation } from '../types';

export interface GeoCoordinate {
  lat: number;
  lng: number;
  district: string;
  state: string;
  townOrMandiYard?: string;
}

// Verified coordinate gazetteer for major agricultural districts and mandi towns across India
export const INDIAN_AGRI_LOCATIONS: Record<string, GeoCoordinate> = {
  // Madhya Pradesh
  'sehore': { lat: 23.2032, lng: 77.0844, district: 'Sehore', state: 'Madhya Pradesh', townOrMandiYard: 'Sehore Mandi Yard' },
  'ashta': { lat: 23.0208, lng: 76.7214, district: 'Sehore', state: 'Madhya Pradesh', townOrMandiYard: 'Ashta Sub-Mandi' },
  'ichhawar': { lat: 23.0189, lng: 77.0142, district: 'Sehore', state: 'Madhya Pradesh', townOrMandiYard: 'Ichhawar Yard' },
  'bhopal': { lat: 23.2599, lng: 77.4126, district: 'Bhopal', state: 'Madhya Pradesh', townOrMandiYard: 'Karond Terminal Mandi' },
  'indore': { lat: 22.7196, lng: 75.8577, district: 'Indore', state: 'Madhya Pradesh', townOrMandiYard: 'Chhoti Gwaltoli / Laxmi Bai Nagar Mandi' },
  'dewas': { lat: 22.9676, lng: 76.0534, district: 'Dewas', state: 'Madhya Pradesh', townOrMandiYard: 'Dewas APMC Yard' },
  'vidisha': { lat: 23.5251, lng: 77.8081, district: 'Vidisha', state: 'Madhya Pradesh', townOrMandiYard: 'Vidisha Mandi' },
  'hoshangabad': { lat: 22.7519, lng: 77.7289, district: 'Narmadapuram', state: 'Madhya Pradesh', townOrMandiYard: 'Itarsi / Hoshangabad Yard' },
  'harda': { lat: 22.3444, lng: 77.0954, district: 'Harda', state: 'Madhya Pradesh', townOrMandiYard: 'Harda Mandi Yard' },
  'ujjain': { lat: 23.1765, lng: 75.7885, district: 'Ujjain', state: 'Madhya Pradesh', townOrMandiYard: 'Ujjain Krishi Upaj Mandi' },
  'mandsaur': { lat: 24.0722, lng: 75.0684, district: 'Mandsaur', state: 'Madhya Pradesh', townOrMandiYard: 'Mandsaur APMC Mandi' },

  // Maharashtra
  'latur': { lat: 18.4088, lng: 76.5604, district: 'Latur', state: 'Maharashtra', townOrMandiYard: 'Latur APMC Super Market Yard' },
  'ausa': { lat: 18.2514, lng: 76.5050, district: 'Latur', state: 'Maharashtra', townOrMandiYard: 'Ausa Sub-Mandi Yard' },
  'solapur': { lat: 17.6599, lng: 75.9064, district: 'Solapur', state: 'Maharashtra', townOrMandiYard: 'Solapur APMC Yard' },
  'pune': { lat: 18.5204, lng: 73.8567, district: 'Pune', state: 'Maharashtra', townOrMandiYard: 'Gultekdi APMC Market' },
  'nashik': { lat: 19.9975, lng: 73.7898, district: 'Nashik', state: 'Maharashtra', townOrMandiYard: 'Panchavati / Dindori APMC Yard' },
  'lasalgaon': { lat: 20.1472, lng: 74.2289, district: 'Nashik', state: 'Maharashtra', townOrMandiYard: 'Lasalgaon Asia Largest Onion Market' },
  'nagpur': { lat: 21.1458, lng: 79.0882, district: 'Nagpur', state: 'Maharashtra', townOrMandiYard: 'Kalamna Market Yard' },
  'akola': { lat: 20.7002, lng: 77.0082, district: 'Akola', state: 'Maharashtra', townOrMandiYard: 'Akola Cotton & Grain Mandi' },
  'amravati': { lat: 20.9374, lng: 77.7796, district: 'Amravati', state: 'Maharashtra', townOrMandiYard: 'Amravati APMC Yard' },
  'nanded': { lat: 19.1383, lng: 77.3210, district: 'Nanded', state: 'Maharashtra', townOrMandiYard: 'Nanded Cotton Market' },
  'ahmednagar': { lat: 19.0948, lng: 74.7480, district: 'Ahmednagar', state: 'Maharashtra', townOrMandiYard: 'Nepti APMC Sub-Yard' },

  // Karnataka
  'raichur': { lat: 16.2076, lng: 77.3463, district: 'Raichur', state: 'Karnataka', townOrMandiYard: 'Raichur APMC Yard' },
  'sindhanur': { lat: 15.7667, lng: 76.7667, district: 'Raichur', state: 'Karnataka', townOrMandiYard: 'Sindhanur Paddy Mandi' },
  'gangavathi': { lat: 15.4300, lng: 76.5300, district: 'Koppal', state: 'Karnataka', townOrMandiYard: 'Gangavathi Rice Bowl Yard' },
  'bellary': { lat: 15.1394, lng: 76.9214, district: 'Bellary', state: 'Karnataka', townOrMandiYard: 'Bellary APMC Yard' },
  'mandya': { lat: 12.5218, lng: 76.8951, district: 'Mandya', state: 'Karnataka', townOrMandiYard: 'Mandya APMC Yard' },
  'mysore': { lat: 12.2958, lng: 76.6394, district: 'Mysuru', state: 'Karnataka', townOrMandiYard: 'Bandipalya APMC Yard' },
  'kolar': { lat: 13.1362, lng: 78.1291, district: 'Kolar', state: 'Karnataka', townOrMandiYard: 'Kolar Tomato & Silk Mandi Yard' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, district: 'Bengaluru Urban', state: 'Karnataka', townOrMandiYard: 'Yeshwanthpur APMC Yard' },
  'bangalore': { lat: 12.9716, lng: 77.5946, district: 'Bengaluru Urban', state: 'Karnataka', townOrMandiYard: 'Singena Agrahara Fruit/Veg Yard' },
  'chikkaballapur': { lat: 13.4325, lng: 77.7275, district: 'Chikkaballapur', state: 'Karnataka', townOrMandiYard: 'Chikkaballapur APMC' },
  'ramanagara': { lat: 12.7209, lng: 77.2799, district: 'Ramanagara', state: 'Karnataka', townOrMandiYard: 'Ramanagara Cocoon & Veg Market' },
  'belagavi': { lat: 15.8497, lng: 74.4977, district: 'Belagavi', state: 'Karnataka', townOrMandiYard: 'Belagavi APMC Yard' },
  'davanagere': { lat: 14.4644, lng: 75.9218, district: 'Davanagere', state: 'Karnataka', townOrMandiYard: 'Davanagere APMC Yard' },

  // Punjab
  'ludhiana': { lat: 30.9010, lng: 75.8573, district: 'Ludhiana', state: 'Punjab', townOrMandiYard: 'Ludhiana Grain Market' },
  'khanna': { lat: 30.7063, lng: 76.2198, district: 'Ludhiana', state: 'Punjab', townOrMandiYard: 'Khanna Asia Largest Grain Market Yard' },
  'jalandhar': { lat: 31.3260, lng: 75.5762, district: 'Jalandhar', state: 'Punjab', townOrMandiYard: 'Maqsudan APMC Mandi' },
  'patiala': { lat: 30.3398, lng: 76.3869, district: 'Patiala', state: 'Punjab', townOrMandiYard: 'Patiala Grain Mandi' },
  'bathinda': { lat: 30.2110, lng: 74.9455, district: 'Bathinda', state: 'Punjab', townOrMandiYard: 'Bathinda Cotton & Wheat Yard' },
  'amritsar': { lat: 31.6340, lng: 74.8723, district: 'Amritsar', state: 'Punjab', townOrMandiYard: 'Bhagtanwala Grain Market' },

  // Rajasthan
  'alwar': { lat: 27.5530, lng: 76.6346, district: 'Alwar', state: 'Rajasthan', townOrMandiYard: 'Alwar Krishi Upaj Mandi (MIA)' },
  'khairthal': { lat: 27.9300, lng: 76.6500, district: 'Kotputli-Behror / Alwar', state: 'Rajasthan', townOrMandiYard: 'Khairthal Mustard & Grain Mandi' },
  'jaipur': { lat: 26.9124, lng: 75.7873, district: 'Jaipur', state: 'Rajasthan', townOrMandiYard: 'Muhana Terminal Mandi' },
  'bharatpur': { lat: 27.2152, lng: 77.5030, district: 'Bharatpur', state: 'Rajasthan', townOrMandiYard: 'Bharatpur Mustard Mandi Yard' },
  'kota': { lat: 25.2138, lng: 75.8648, district: 'Kota', state: 'Rajasthan', townOrMandiYard: 'Bhamashah Krishi Upaj Mandi' },
  'sriganganagar': { lat: 29.9038, lng: 73.8772, district: 'Sri Ganganagar', state: 'Rajasthan', townOrMandiYard: 'Sri Ganganagar Grain Mandi' },

  // Andhra Pradesh & Telangana
  'guntur': { lat: 16.3067, lng: 80.4365, district: 'Guntur', state: 'Andhra Pradesh', townOrMandiYard: 'Guntur Asia Largest Chilli Yard' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, district: 'Krishna', state: 'Andhra Pradesh', townOrMandiYard: 'Gollapudi Wholesale Market' },
  'kurnool': { lat: 15.8281, lng: 78.0373, district: 'Kurnool', state: 'Andhra Pradesh', townOrMandiYard: 'Kurnool APMC Market' },
  'warangal': { lat: 17.9784, lng: 79.5941, district: 'Warangal', state: 'Telangana', townOrMandiYard: 'Enumamula Grain & Chilli Market' },
  'nizamabad': { lat: 18.6725, lng: 78.0941, district: 'Nizamabad', state: 'Telangana', townOrMandiYard: 'Nizamabad Turmeric Market' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, district: 'Hyderabad', state: 'Telangana', townOrMandiYard: 'Bowenpally / Malakpet APMC' },

  // Gujarat
  'rajkot': { lat: 22.3039, lng: 70.8022, district: 'Rajkot', state: 'Gujarat', townOrMandiYard: 'Bedi APMC Market Yard' },
  'unjha': { lat: 23.8042, lng: 72.3925, district: 'Mehsana', state: 'Gujarat', townOrMandiYard: 'Unjha Spices & Cumin Mandi Yard' },
  'gondal': { lat: 21.9619, lng: 70.7933, district: 'Rajkot', state: 'Gujarat', townOrMandiYard: 'Gondal APMC Market Yard' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, district: 'Ahmedabad', state: 'Gujarat', townOrMandiYard: 'Jamalpur / Naroda APMC' },

  // Uttar Pradesh & Haryana
  'varanasi': { lat: 25.3176, lng: 82.9739, district: 'Varanasi', state: 'Uttar Pradesh', townOrMandiYard: 'Paharia Mandi Yard' },
  'agra': { lat: 27.1767, lng: 78.0081, district: 'Agra', state: 'Uttar Pradesh', townOrMandiYard: 'Fatehabad Road Mandi' },
  'meerut': { lat: 28.9845, lng: 77.7064, district: 'Meerut', state: 'Uttar Pradesh', townOrMandiYard: 'Delhi Road APMC Mandi' },
  'karnal': { lat: 29.6857, lng: 76.9905, district: 'Karnal', state: 'Haryana', townOrMandiYard: 'Karnal Basmati Rice Yard' },
  'kurukshetra': { lat: 29.9695, lng: 76.8783, district: 'Kurukshetra', state: 'Haryana', townOrMandiYard: 'Thanesar Grain Mandi' },

  // Tamil Nadu, Kerala, West Bengal, Bihar, Odisha
  'coimbatore': { lat: 11.0168, lng: 76.9558, district: 'Coimbatore', state: 'Tamil Nadu', townOrMandiYard: 'Ukkadam Regulated Market' },
  'madurai': { lat: 9.9252, lng: 78.1198, district: 'Madurai', state: 'Tamil Nadu', townOrMandiYard: 'Mattuthavani Central Market' },
  'thanjavur': { lat: 10.7870, lng: 79.1378, district: 'Thanjavur', state: 'Tamil Nadu', townOrMandiYard: 'Thanjavur Delta Paddy Regulated Market' },
  'patna': { lat: 25.5941, lng: 85.1376, district: 'Patna', state: 'Bihar', townOrMandiYard: 'Bazar Samiti APMC Yard' },
  'burdwan': { lat: 23.2324, lng: 87.8615, district: 'Purba Bardhaman', state: 'West Bengal', townOrMandiYard: 'Bardhaman Rice Bowl Mandi' },
  'sambalpur': { lat: 21.4669, lng: 83.9812, district: 'Sambalpur', state: 'Odisha', townOrMandiYard: 'Khetrajpur RMC Market' }
};

/**
 * Searches local verified gazetteer for district, village, or town query.
 */
export function lookupGazetteerCoordinate(text: string): GeoCoordinate | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // Direct match
  if (INDIAN_AGRI_LOCATIONS[clean]) {
    return INDIAN_AGRI_LOCATIONS[clean];
  }

  // Token / Substring match
  const tokens = clean.split(/[\s,/-]+/);
  for (const token of tokens) {
    if (token.length > 2 && INDIAN_AGRI_LOCATIONS[token]) {
      return INDIAN_AGRI_LOCATIONS[token];
    }
  }

  for (const [key, value] of Object.entries(INDIAN_AGRI_LOCATIONS)) {
    if (clean.includes(key) || clean.includes(value.district.toLowerCase())) {
      return value;
    }
  }

  return null;
}

/**
 * Resolves location with verified coordinates.
 * 1. If GPS coordinates already present, respects them!
 * 2. Matches against Indian agricultural gazetteer.
 * 3. Falls back to OpenStreetMap Nominatim for unknown places.
 * 4. NEVER fabricates coordinates or distances. If unresolved, returns lat: null, lng: null.
 */
export async function resolveVerifiedFarmerLocation(
  village: string,
  district: string,
  state: string,
  existingLat?: number | null,
  existingLng?: number | null
): Promise<FarmerLocation> {
  // If valid GPS coordinates already exist
  if (
    existingLat !== null &&
    existingLat !== undefined &&
    existingLng !== null &&
    existingLng !== undefined &&
    !isNaN(existingLat) &&
    !isNaN(existingLng) &&
    existingLat !== 0
  ) {
    return {
      village: village.trim(),
      district: district.trim(),
      state: state.trim(),
      lat: existingLat,
      lng: existingLng,
      isDetected: true
    };
  }

  // Search local gazetteer for village or district
  const query = `${village} ${district} ${state}`.trim();
  const localMatch = lookupGazetteerCoordinate(village) || lookupGazetteerCoordinate(district) || lookupGazetteerCoordinate(query);

  if (localMatch) {
    return {
      village: village.trim() || localMatch.townOrMandiYard || localMatch.district,
      district: district.trim() || localMatch.district,
      state: state.trim() || localMatch.state,
      lat: localMatch.lat,
      lng: localMatch.lng,
      isDetected: false
    };
  }

  // Fallback: Query OpenStreetMap Nominatim API with 2 second timeout
  try {
    const searchQuery = [village, district, state, 'India'].filter(Boolean).join(', ');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'en' }
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            village: village.trim(),
            district: district.trim() || item.display_name.split(',')[0],
            state: state.trim(),
            lat,
            lng,
            isDetected: false
          };
        }
      }
    }
  } catch {
    // Network or timeout: proceed without pretending
  }

  // Unverified: do not invent coordinates!
  return {
    village: village.trim(),
    district: district.trim(),
    state: state.trim(),
    lat: null,
    lng: null,
    isDetected: false
  };
}

/**
 * Formats a clean farmer location label: [Village/Town, District, State]
 */
export function formatFarmerLocationDisplay(loc: FarmerLocation): string {
  const parts: string[] = [];
  if (loc.village && loc.village.trim() && loc.village !== loc.district) {
    parts.push(loc.village.trim());
  }
  if (loc.district && loc.district.trim()) {
    parts.push(loc.district.trim());
  }
  if (loc.state && loc.state.trim()) {
    parts.push(loc.state.trim());
  }

  return parts.length > 0 ? parts.join(', ') : 'Location not selected';
}
