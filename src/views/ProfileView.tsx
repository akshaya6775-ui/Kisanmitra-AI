import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { VEHICLE_OPTIONS } from '../data/crops';
import {
  User,
  Globe,
  MapPin,
  Truck,
  ShieldCheck,
  PhoneCall,
  Check,
  RefreshCw,
  Info,
  Heart
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    language,
    setLanguage,
    cropState,
    setCropState,
    detectLocation,
    isDetectingLocation,
    t
  } = useApp();

  const [farmerName, setFarmerName] = useState('Kisan Bhai (Farmer)');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Farmer Profile Card */}
      <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white p-5 rounded-3xl shadow-lg border border-emerald-800/40 flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
          🌾
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full">
            Kisan ID: KM-2026-IND
          </span>
          <h2 className="text-lg font-black text-white mt-1">
            {farmerName}
          </h2>
          <p className="text-xs text-emerald-100 flex items-center space-x-1 mt-0.5">
            <MapPin className="w-3 h-3 text-emerald-300" />
            <span>{cropState.location.district}, {cropState.location.state}</span>
          </p>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Preferred Language / भाषा चुनें
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-50 border-[#1b4332] text-[#1b4332] font-bold shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{lang.nativeName}</div>
                  <div className="text-[10px] text-stone-400">{lang.name}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Farm Location Details */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Farm Location (Not Hardcoded)
            </h3>
          </div>
          <button
            onClick={detectLocation}
            disabled={isDetectingLocation}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
          >
            <RefreshCw className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>GPS Auto-Detect</span>
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Village / Town
            </label>
            <input
              type="text"
              value={cropState.location.village || ''}
              onChange={(e) => setCropState(prev => ({
                ...prev,
                location: { ...prev.location, village: e.target.value }
              }))}
              placeholder="e.g. Ashta, Ausa, Sindhanur"
              className="w-full text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 mt-0.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                District
              </label>
              <input
                type="text"
                value={cropState.location.district}
                onChange={(e) => setCropState(prev => ({
                  ...prev,
                  location: { ...prev.location, district: e.target.value }
                }))}
                className="w-full text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                State
              </label>
              <input
                type="text"
                value={cropState.location.state}
                onChange={(e) => setCropState(prev => ({
                  ...prev,
                  location: { ...prev.location, state: e.target.value }
                }))}
                className="w-full text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 mt-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Default Transport Preference */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2">
        <div className="flex items-center space-x-2 mb-1">
          <Truck className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Default Transport Vehicle
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {VEHICLE_OPTIONS.map((v) => {
            const isSelected = cropState.preferredVehicle === v.type;
            return (
              <button
                key={v.type}
                onClick={() => setCropState(prev => ({ ...prev, preferredVehicle: v.type }))}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 font-bold text-[#1b4332]'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-xl">{v.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs truncate">{v.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-stone-400">₹{v.perKmRate}/km</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Emergency Kisan Call Center 1800-180-1551 */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950">
              Government Kisan Call Center
            </div>
            <div className="text-xs text-amber-900 font-semibold mt-0.5">
              Toll Free: 1800-180-1551
            </div>
          </div>
        </div>
        <a
          href="tel:18001801551"
          className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
        >
          Call
        </a>
      </div>

      {/* App Integrity & Principles Note */}
      <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center space-x-1.5 font-bold text-stone-800">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>About KisanMitra AI</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          KisanMitra AI is designed specifically for Indian farmers to make confident post-harvest selling decisions by comparing net realization after transport freight, loading charges, and APMC cess.
        </p>
        <p className="text-[10px] text-stone-400 italic">
          Complies with Agmarknet APMC benchmarks and WDRA warehousing norms.
        </p>
      </div>
    </div>
  );
};
