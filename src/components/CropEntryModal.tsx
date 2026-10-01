import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_DATA, VEHICLE_OPTIONS } from '../data/crops';
import { Crop, VehicleType } from '../types';
import { resolveVerifiedFarmerLocation } from '../services/geocodingService';
import {
  X,
  Plus,
  Minus,
  MapPin,
  ChevronRight,
  Droplets,
  Truck,
  Sparkles,
  Compass
} from 'lucide-react';

export const CropEntryModal: React.FC = () => {
  const {
    isEntryModalOpen,
    setIsEntryModalOpen,
    cropState,
    setCropState,
    setActiveTab,
    detectLocation,
    isDetectingLocation,
    language,
    t
  } = useApp();

  const [selectedCrop, setSelectedCrop] = useState<Crop>(cropState.crop);
  const [selectedVariety, setSelectedVariety] = useState<string>(cropState.variety);
  const [quantity, setQuantity] = useState<number>(cropState.quantityQuintals);
  const [moisture, setMoisture] = useState<number>(cropState.moisturePercentage);
  const [vehicle, setVehicle] = useState<VehicleType>(cropState.preferredVehicle);
  const [village, setVillage] = useState<string>(cropState.location.village || '');
  const [district, setDistrict] = useState<string>(cropState.location.district || '');
  const [state, setState] = useState<string>(cropState.location.state || '');

  // Synchronize with cropState whenever modal opens
  useEffect(() => {
    if (isEntryModalOpen) {
      setSelectedCrop(cropState.crop);
      setSelectedVariety(cropState.variety);
      setQuantity(cropState.quantityQuintals);
      setMoisture(cropState.moisturePercentage);
      setVehicle(cropState.preferredVehicle);
      setVillage(cropState.location.village || '');
      setDistrict(cropState.location.district || '');
      setState(cropState.location.state || '');
    }
  }, [isEntryModalOpen, cropState]);

  if (!isEntryModalOpen) return null;

  const handleApply = async () => {
    // Resolve verified location coordinates
    const resolvedLoc = await resolveVerifiedFarmerLocation(
      village,
      district,
      state,
      cropState.location.isDetected ? cropState.location.lat : null,
      cropState.location.isDetected ? cropState.location.lng : null
    );

    setCropState(prev => ({
      ...prev,
      crop: selectedCrop,
      variety: selectedVariety || selectedCrop.varieties[0] || 'Standard Grade',
      quantityQuintals: Math.max(1, quantity),
      quantityKg: Math.max(1, quantity) * 100,
      moisturePercentage: moisture,
      preferredVehicle: vehicle,
      location: resolvedLoc
    }));

    setIsEntryModalOpen(false);
    setActiveTab('markets');
  };

  const handlePresetLocation = (v: string, d: string, s: string) => {
    setVillage(v);
    setDistrict(d);
    setState(s);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#faf8f2] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1b4332] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white">
              {t.enterDetailsButton}
            </h3>
            <p className="text-[11px] text-emerald-200">
              {t.shortDesc}
            </p>
          </div>
          <button
            onClick={() => setIsEntryModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Step 1: Crop Selection Visual Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              1. {t.selectCrop}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {CROPS_DATA.map((crop) => {
                const isSelected = selectedCrop.id === crop.id;
                const cropName = crop.localNames[language] || crop.name;

                return (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setSelectedCrop(crop);
                      setSelectedVariety(crop.varieties[0] || 'Standard');
                      setMoisture(crop.standardMoisture);
                    }}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-100 border-[#1b4332] text-[#1b4332] shadow-xs font-bold ring-2 ring-emerald-500/20'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{crop.emoji}</span>
                    <span className="text-xs leading-tight line-clamp-1">{cropName}</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">MSP ₹{crop.baseMsp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Quantity Counter */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                2. {t.quantityLabel}
              </label>
              <span className="text-xs text-stone-500 font-medium">
                ≈ {Math.round(quantity * 2)} Bags (50kg) • {quantity * 100} kg
              </span>
            </div>

            <div className="flex items-center justify-between space-x-3">
              <button
                onClick={() => setQuantity(Math.max(5, quantity - 10))}
                className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 flex items-center justify-center text-stone-800 font-bold transition"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-2xl font-black text-[#1b4332] bg-emerald-50/50 py-1.5 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mt-1">
                  Quintals (क्विंटल)
                </span>
              </div>

              <button
                onClick={() => setQuantity(quantity + 10)}
                className="w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 flex items-center justify-center text-white font-bold transition shadow-xs"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Increment Chips */}
            <div className="flex items-center justify-center space-x-2 mt-3 pt-3 border-t border-stone-100">
              {[20, 50, 80, 100, 150].map((val) => (
                <button
                  key={val}
                  onClick={() => setQuantity(val)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    quantity === val
                      ? 'bg-[#1b4332] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {val} Q
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Moisture Percentage Slider */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>3. {t.moistureLabel}</span>
              </label>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                moisture <= selectedCrop.standardMoisture
                  ? 'bg-emerald-100 text-emerald-800'
                  : moisture <= selectedCrop.standardMoisture + 2
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {moisture}% ({moisture <= selectedCrop.standardMoisture ? 'Optimal Dry' : 'Moist / Cut Risk'})
              </span>
            </div>

            <input
              type="range"
              min="8"
              max="22"
              step="0.5"
              value={moisture}
              onChange={(e) => setMoisture(parseFloat(e.target.value))}
              className="w-full accent-[#1b4332] h-2 bg-stone-200 rounded-lg cursor-pointer my-2"
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>8% (Dry)</span>
              <span className="text-emerald-700 font-bold">Standard: {selectedCrop.standardMoisture}%</span>
              <span>22% (Wet)</span>
            </div>
          </div>

          {/* Step 4: Transport Vehicle */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>4. {t.vehicleLabel}</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_OPTIONS.map((v) => {
                const isSelected = vehicle === v.type;
                return (
                  <button
                    key={v.type}
                    onClick={() => setVehicle(v.type)}
                    className={`p-3 rounded-xl border text-left transition flex items-start space-x-2 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xl">{v.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-stone-800 line-clamp-1">{v.name}</div>
                      <div className="text-[10px] text-stone-500">
                        Cap: {v.capacityQuintals} Q • ₹{v.perKmRate}/km
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Farm Location (Village/Town + District + State) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>5. Farm Location (Village/Town + District + State)</span>
              </label>
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center space-x-1"
              >
                <Compass className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span>{isDetectingLocation ? 'Locating...' : '📍 GPS Auto-Detect'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                  Village / Town
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Ashta, Ausa, Sindhanur, Khairthal"
                  className="w-full text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Sehore, Latur, Raichur"
                    className="w-full text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Madhya Pradesh, Maharashtra"
                    className="w-full text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Sample Region Quick Chips */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-stone-400 block mb-1">
                  Or select a verified agricultural region:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Sehore / Ashta (MP)', v: 'Ashta', d: 'Sehore', s: 'Madhya Pradesh' },
                    { label: 'Latur / Ausa (MH)', v: 'Ausa', d: 'Latur', s: 'Maharashtra' },
                    { label: 'Raichur / Sindhanur (KA)', v: 'Sindhanur', d: 'Raichur', s: 'Karnataka' },
                    { label: 'Ludhiana / Khanna (PB)', v: 'Khanna', d: 'Ludhiana', s: 'Punjab' },
                    { label: 'Alwar / Khairthal (RJ)', v: 'Khairthal', d: 'Alwar', s: 'Rajasthan' },
                    { label: 'Guntur (AP)', v: 'Guntur Rural', d: 'Guntur', s: 'Andhra Pradesh' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetLocation(preset.v, preset.d, preset.s)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition ${
                        district === preset.d && village === preset.v
                          ? 'bg-[#1b4332] text-white border-[#1b4332] font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="p-4 bg-white border-t border-stone-200">
          <button
            onClick={handleApply}
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-emerald-950/20 flex items-center justify-center space-x-2 transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Calculate Best Market Net Realization</span>
            <ChevronRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
