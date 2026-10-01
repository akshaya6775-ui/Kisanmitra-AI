import React from 'react';
import { WeatherAdvisory, Crop } from '../types';
import { useApp } from '../context/AppContext';
import {
  CloudRain,
  Sun,
  CloudSun,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  Volume2
} from 'lucide-react';

interface Props {
  weather: WeatherAdvisory;
  crop: Crop;
}

export const WeatherAdvisoryCard: React.FC<Props> = ({ weather, crop }) => {
  const { playAudio, language, t } = useApp();

  const handleSpeakWeather = () => {
    let msg = '';
    if (language === 'hi') {
      msg = `${weather.district} में मौसम: अगले 3 दिनों में बारिश की संभावना ${weather.rainProbabilityNext3Days}% है। ${weather.recommendedAction}`;
    } else if (language === 'kn') {
      msg = `${weather.district} ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ: ಮುಂದಿನ 3 ದಿನಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ${weather.rainProbabilityNext3Days}%. ${weather.recommendedAction}`;
    } else {
      msg = `Weather advisory for ${weather.district}: Rain probability is ${weather.rainProbabilityNext3Days}%. ${weather.recommendedAction}`;
    }
    playAudio(msg, 'weather-advisory');
  };

  const getRiskTheme = () => {
    switch (weather.riskLevel) {
      case 'danger':
        return {
          bg: 'bg-rose-50/90 border-rose-300',
          badgeBg: 'bg-rose-600 text-white',
          badgeText: 'Rain & Moisture Risk Alert',
          icon: <CloudRain className="w-5 h-5 text-rose-600" />
        };
      case 'caution':
        return {
          bg: 'bg-amber-50/90 border-amber-300',
          badgeBg: 'bg-amber-600 text-white',
          badgeText: 'Moderate Weather Caution',
          icon: <CloudSun className="w-5 h-5 text-amber-600" />
        };
      default:
        return {
          bg: 'bg-emerald-50/90 border-emerald-300',
          badgeBg: 'bg-emerald-700 text-white',
          badgeText: 'Favorable Harvest Weather',
          icon: <Sun className="w-5 h-5 text-emerald-600" />
        };
    }
  };

  const theme = getRiskTheme();

  return (
    <div className={`p-4 rounded-2xl border ${theme.bg} shadow-xs transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {theme.icon}
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
              {theme.badgeText}
            </span>
            <h4 className="font-extrabold text-stone-900 text-sm mt-1">
              {weather.district} Weather & Harvest Conditions
            </h4>
          </div>
        </div>

        <button
          onClick={handleSpeakWeather}
          className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-stone-700 shadow-xs transition active:scale-95"
          title="Listen in audio"
        >
          <Volume2 className="w-4 h-4 text-emerald-800" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 my-3 text-center">
        <div className="bg-white/80 p-2 rounded-xl border border-stone-200/60">
          <span className="text-[10px] text-stone-500 font-semibold block">Condition</span>
          <span className="text-xs font-black text-stone-800">{weather.condition}</span>
        </div>
        <div className="bg-white/80 p-2 rounded-xl border border-stone-200/60">
          <span className="text-[10px] text-stone-500 font-semibold block">Rain Forecast (3-Day)</span>
          <span className={`text-xs font-black ${weather.rainProbabilityNext3Days > 40 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {weather.rainProbabilityNext3Days}%
          </span>
        </div>
        <div className="bg-white/80 p-2 rounded-xl border border-stone-200/60">
          <span className="text-[10px] text-stone-500 font-semibold block">Relative Humidity</span>
          <span className="text-xs font-black text-stone-800">{weather.humidity}%</span>
        </div>
      </div>

      {/* Actionable Agro-Advisory Note */}
      <div className="text-xs text-stone-800 font-medium bg-white/90 p-3 rounded-xl border border-stone-200/70">
        <p className="leading-relaxed">
          <strong>Advisory: </strong>{weather.recommendedAction}
        </p>
      </div>

      {/* Reference label */}
      <div className="mt-2 text-[10px] text-stone-400 text-right italic">
        {weather.dataSourceLabel}
      </div>
    </div>
  );
};
