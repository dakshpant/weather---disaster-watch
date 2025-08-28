import React from 'react';
import type { Forecast } from '../types';
import { SunnyIcon, CloudyIcon, RainyIcon, SnowyIcon, PartlyCloudyIcon, ThunderstormIcon } from './icons';

interface ForecastPanelProps {
  forecast: Forecast[];
}

const ForecastIcon: React.FC<{ condition: string, className: string }> = ({ condition, className }) => {
    switch (condition) {
        case 'Sunny': return <SunnyIcon className={className} />;
        case 'Cloudy': return <CloudyIcon className={className} />;
        case 'Rainy': return <RainyIcon className={className} />;
        case 'Snowy': return <SnowyIcon className={className} />;
        case 'Thunderstorm': return <ThunderstormIcon className={className} />;
        case 'Partly Cloudy': return <PartlyCloudyIcon className={className} />;
        default: return <CloudyIcon className={className} />;
    }
};

export const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecast }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg h-full border border-slate-700">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center bg-slate-700/50 p-4 rounded-lg space-y-2 text-center">
            <p className="font-bold text-lg">{day.day}</p>
            <ForecastIcon condition={day.condition} className="w-12 h-12 text-amber-300" />
            <div>
              <span className="font-semibold">{day.high}°</span>
              <span className="text-slate-400"> / {day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};