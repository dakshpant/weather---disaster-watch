import React from 'react';
import type { Forecast } from '../types';
import { SunnyIcon, CloudyIcon, RainyIcon, SnowyIcon, PartlyCloudyIcon, ThunderstormIcon } from './icons';
import { motion } from 'motion/react';

interface ForecastPanelProps {
  forecast: Forecast[];
  onForecastSelect?: (forecast: Forecast) => void;
  selectedForecast?: Forecast | null;
}

const getIconColor = (condition: string): string => {
  switch (condition) {
    case 'Sunny': return 'text-amber-400';
    case 'Cloudy': return 'text-slate-400';
    case 'Rainy': return 'text-blue-400';
    case 'Snowy': return 'text-cyan-100';
    case 'Thunderstorm': return 'text-purple-400';
    case 'Partly Cloudy': return 'text-sky-200';
    case 'Humid': return 'text-teal-300';
    case 'Foggy': return 'text-slate-300';
    default: return 'text-slate-400';
  }
};

const getCardGradient = (condition: string): string => {
  switch (condition) {
    case 'Sunny': return 'from-amber-500/20 to-orange-500/10';
    case 'Rainy': return 'from-blue-500/20 to-cyan-500/10';
    case 'Snowy': return 'from-cyan-400/20 to-blue-300/10';
    case 'Thunderstorm': return 'from-purple-500/20 to-indigo-500/10';
    case 'Cloudy': return 'from-slate-500/20 to-gray-500/10';
    case 'Partly Cloudy': return 'from-sky-400/20 to-blue-400/10';
    default: return 'from-slate-600/20 to-slate-700/10';
  }
};

const ForecastIcon: React.FC<{ condition: string, className: string }> = ({ condition, className }) => {
    const colorClass = getIconColor(condition);
    const finalClass = `${className} ${colorClass}`;

    switch (condition) {
        case 'Sunny': return <SunnyIcon className={finalClass} />;
        case 'Cloudy': return <CloudyIcon className={finalClass} />;
        case 'Rainy': return <RainyIcon className={finalClass} />;
        case 'Snowy': return <SnowyIcon className={finalClass} />;
        case 'Thunderstorm': return <ThunderstormIcon className={finalClass} />;
        case 'Partly Cloudy': return <PartlyCloudyIcon className={finalClass} />;
        case 'Humid': return <CloudyIcon className={finalClass} />;
        case 'Foggy': return <CloudyIcon className={finalClass} />;
        default: return <CloudyIcon className={finalClass} />;
    }
};

export const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecast, onForecastSelect, selectedForecast }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg h-full border border-slate-700 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-fortis-primary/5 to-transparent opacity-50 animate-pulse"></div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-fortis-primary">📅</span>
          5-Day Forecast
          <span className="text-sm text-fortis-muted ml-auto">{currentDate}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => {
            const isToday = day.day === today;
            const isSelected = selectedForecast?.day === day.day;
            const gradient = getCardGradient(day.condition);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onForecastSelect?.(day)}
                className={`flex flex-col items-center bg-gradient-to-br ${gradient} backdrop-blur-sm p-4 rounded-xl space-y-2 text-center border ${
                  isSelected 
                    ? 'border-fortis-primary shadow-lg shadow-fortis-primary/30 ring-2 ring-fortis-primary/50' 
                    : isToday 
                      ? 'border-fortis-primary shadow-lg shadow-fortis-primary/20' 
                      : 'border-slate-600/50'
                } transition-all duration-300 hover:border-fortis-primary/50 cursor-pointer relative overflow-hidden group`}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-3 h-3 bg-fortis-primary rounded-full shadow-lg shadow-fortis-primary/50"
                  />
                )}
                
                <div className="relative z-10 w-full">
                  <p className={`font-bold text-lg ${isToday ? 'text-fortis-primary' : isSelected ? 'text-fortis-primary' : 'text-white'}`}>
                    {isToday ? 'Today' : day.day}
                  </p>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <ForecastIcon condition={day.condition} className="w-12 h-12 mx-auto" />
                  </motion.div>
                  <div className="mt-2">
                    <span className="font-semibold text-white text-lg">{day.high}°</span>
                    <span className="text-slate-300"> / {day.low}°</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{day.condition}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};