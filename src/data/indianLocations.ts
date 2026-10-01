export interface LocationCoordinates {
  district: string;
  state: string;
  lat: number;
  lng: number;
}

// Verified coordinate database for Indian agricultural districts
export const INDIAN_DISTRICT_COORDINATES: Record<string, LocationCoordinates> = {
  // Karnataka
  kolar: { district: 'Kolar', state: 'Karnataka', lat: 13.1362, lng: 78.1291 },
  bengaluru: { district: 'Bangalore Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  bangalore: { district: 'Bangalore Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  'bangalore rural': { district: 'Bangalore Rural', state: 'Karnataka', lat: 13.2384, lng: 77.5684 },
  mysore: { district: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  mysuru: { district: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  mandya: { district: 'Mandya', state: 'Karnataka', lat: 12.5242, lng: 76.8958 },
  hassan: { district: 'Hassan', state: 'Karnataka', lat: 13.0033, lng: 76.1004 },
  chikkaballapur: { district: 'Chikkaballapur', state: 'Karnataka', lat: 13.4325, lng: 77.7275 },
  ramanagara: { district: 'Ramanagara', state: 'Karnataka', lat: 12.7209, lng: 77.2799 },
  raichur: { district: 'Raichur', state: 'Karnataka', lat: 16.2076, lng: 77.3463 },
  belgaum: { district: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
  belagavi: { district: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
  davanagere: { district: 'Davanagere', state: 'Karnataka', lat: 14.4644, lng: 75.9218 },
  shimoga: { district: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lng: 75.5681 },
  shivamogga: { district: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lng: 75.5681 },
  bellary: { district: 'Ballari', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },
  ballari: { district: 'Ballari', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },
  koppal: { district: 'Koppal', state: 'Karnataka', lat: 15.3456, lng: 76.1548 },
  tumkur: { district: 'Tumakuru', state: 'Karnataka', lat: 13.3379, lng: 77.1010 },

  // Maharashtra
  nashik: { district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  lasalgaon: { district: 'Nashik', state: 'Maharashtra', lat: 20.1472, lng: 74.2255 },
  pune: { district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  latur: { district: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604 },
  solapur: { district: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
  barshi: { district: 'Solapur', state: 'Maharashtra', lat: 18.2333, lng: 75.6947 },
  ahmednagar: { district: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lng: 74.7480 },
  nagpur: { district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  amravati: { district: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796 },
  akola: { district: 'Akola', state: 'Maharashtra', lat: 20.7002, lng: 77.0082 },
  jalgaon: { district: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lng: 75.5626 },

  // Madhya Pradesh
  sehore: { district: 'Sehore', state: 'Madhya Pradesh', lat: 23.2032, lng: 77.0844 },
  bhopal: { district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  indore: { district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  ujjain: { district: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  dewas: { district: 'Dewas', state: 'Madhya Pradesh', lat: 22.9676, lng: 76.0534 },
  hoshangabad: { district: 'Narmadapuram', state: 'Madhya Pradesh', lat: 22.7519, lng: 77.7289 },
  vidisha: { district: 'Vidisha', state: 'Madhya Pradesh', lat: 23.5251, lng: 77.8081 },
  mandsaur: { district: 'Mandsaur', state: 'Madhya Pradesh', lat: 24.0722, lng: 75.0684 },

  // Rajasthan
  alwar: { district: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346 },
  jaipur: { district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  bharatpur: { district: 'Bharatpur', state: 'Rajasthan', lat: 27.2152, lng: 77.5030 },
  kota: { district: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
  bikaner: { district: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
  'sri ganganagar': { district: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9038, lng: 73.8772 },

  // Gujarat
  rajkot: { district: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  surendranagar: { district: 'Surendranagar', state: 'Gujarat', lat: 22.7278, lng: 71.6370 },
  ahmedabad: { district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  junagadh: { district: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
  surat: { district: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },

  // Punjab & Haryana
  khanna: { district: 'Ludhiana', state: 'Punjab', lat: 30.7071, lng: 76.2168 },
  ludhiana: { district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  karnal: { district: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
  bathinda: { district: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },
  ambala: { district: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767 },

  // Andhra Pradesh & Telangana
  guntur: { district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  kurnool: { district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
  warangal: { district: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
  nizamabad: { district: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
  madanapalle: { district: 'Annamayya', state: 'Andhra Pradesh', lat: 13.5560, lng: 78.5010 },

  // Tamil Nadu
  salem: { district: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  coimbatore: { district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  madurai: { district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  dindigul: { district: 'Dindigul', state: 'Tamil Nadu', lat: 10.3673, lng: 77.9803 }
};

export function lookupDistrictCoordinates(text: string): LocationCoordinates | null {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  // Direct match
  if (INDIAN_DISTRICT_COORDINATES[t]) {
    return INDIAN_DISTRICT_COORDINATES[t];
  }

  // Partial match
  for (const key of Object.keys(INDIAN_DISTRICT_COORDINATES)) {
    if (t.includes(key)) {
      return INDIAN_DISTRICT_COORDINATES[key];
    }
  }

  return null;
}

// Geocode any custom address using OpenStreetMap Nominatim with cache
const geocodeCache: Record<string, LocationCoordinates | null> = {};

export async function geocodeLocationOnline(query: string): Promise<LocationCoordinates | null> {
  const clean = query.trim().toLowerCase();
  if (geocodeCache[clean] !== undefined) {
    return geocodeCache[clean];
  }

  // Check offline district table first
  const offlineMatch = lookupDistrictCoordinates(clean);
  if (offlineMatch) {
    geocodeCache[clean] = offlineMatch;
    return offlineMatch;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'KisanMitra-AgriRouting/1.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const result: LocationCoordinates = {
          district: query.split(',')[0].trim(),
          state: query.split(',')[1]?.trim() || 'India',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        };
        geocodeCache[clean] = result;
        return result;
      }
    }
  } catch (err) {
    console.warn('Online geocoding unavailable:', err);
  }

  geocodeCache[clean] = null;
  return null;
}
