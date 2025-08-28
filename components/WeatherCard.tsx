import React from 'react';
import type { CurrentWeather } from '../types';
import { SunnyIcon, CloudyIcon, RainyIcon, SnowyIcon, PartlyCloudyIcon, ThunderstormIcon } from './icons';

interface WeatherCardProps {
  current: CurrentWeather;
}

const WeatherIcon: React.FC<{ condition: string; className: string }> = ({ condition, className }) => {
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

export const WeatherCard: React.FC<WeatherCardProps> = ({ current }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg h-full flex flex-col justify-between border border-slate-700">
      <div>
        <h2 className="text-xl font-semibold text-slate-200">Current Weather</h2>
        <p className="text-cyan-400 font-medium">{current.location}</p>
      </div>
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col">
          <span className="text-7xl font-bold tracking-tighter">{current.temperature}°</span>
          <span className="text-lg text-slate-400">Feels like {current.feelsLike}°</span>
        </div>
        <WeatherIcon condition={current.condition} className="w-24 h-24 text-amber-300" />
      </div>
      <div className="text-center font-medium text-xl mb-4">{current.condition}</div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-700/50 p-3 rounded-lg text-center">
          <p className="text-slate-400">Humidity</p>
          <p className="font-bold text-lg">{current.humidity}%</p>
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg text-center">
          <p className="text-slate-400">Wind Speed</p>
          <p className="font-bold text-lg">{current.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};