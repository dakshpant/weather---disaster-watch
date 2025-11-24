import React from 'react';
import type { CurrentWeather, Forecast } from '../types';
import { SunnyIcon, CloudyIcon, RainyIcon, SnowyIcon, PartlyCloudyIcon, ThunderstormIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';

interface WeatherCardProps {
  current: CurrentWeather;
  selectedForecast?: Forecast | null;
  onResetToCurrentWeather?: () => void;
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

const getCardBackground = (condition: string): string => {
  switch (condition) {
    case 'Sunny': return 'from-amber-500/30 via-orange-500/20 to-slate-800/60';
    case 'Rainy': return 'from-blue-500/30 via-cyan-500/20 to-slate-800/60';
    case 'Snowy': return 'from-cyan-400/30 via-blue-300/20 to-slate-800/60';
    case 'Thunderstorm': return 'from-purple-500/30 via-indigo-500/20 to-slate-800/60';
    case 'Cloudy': return 'from-slate-500/30 via-gray-500/20 to-slate-800/60';
    case 'Partly Cloudy': return 'from-sky-400/30 via-blue-400/20 to-slate-800/60';
    case 'Humid': return 'from-teal-400/30 via-cyan-400/20 to-slate-800/60';
    default: return 'from-slate-600/30 via-slate-700/20 to-slate-800/60';
  }
};

const WeatherIcon: React.FC<{ condition: string; className: string }> = ({ condition, className }) => {
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

export const WeatherCard: React.FC<WeatherCardProps> = ({ current, selectedForecast, onResetToCurrentWeather }) => {
  const displayData = selectedForecast || current;
  const isForecastView = !!selectedForecast;
  const condition = isForecastView ? selectedForecast.condition : current.condition;
  const backgroundGradient = getCardBackground(condition);
  
  // Calculate estimated values for forecast (since we don't have exact data)
  const temperature = isForecastView ? selectedForecast.high : current.temperature;
  const feelsLike = isForecastView ? selectedForecast.high + 2 : current.feelsLike;
  const humidity = isForecastView ? 65 : current.humidity; // Estimated
  const windSpeed = isForecastView ? 12 : current.windSpeed; // Estimated
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${backgroundGradient} backdrop-blur-md rounded-2xl p-6 shadow-lg h-full flex flex-col justify-between border border-slate-700 relative overflow-hidden`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-fortis-primary/10 to-transparent opacity-50 animate-pulse"></div>
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={isForecastView ? 'forecast' : 'current'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                  <span className="text-fortis-primary">{isForecastView ? '📅' : '🌡️'}</span>
                  {isForecastView ? `Forecast for ${selectedForecast.day}` : 'Current Weather'}
                </h2>
                <p className="text-fortis-primary font-medium">{current.location}</p>
              </div>
              {isForecastView && onResetToCurrentWeather && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onResetToCurrentWeather}
                  className="px-3 py-1 bg-fortis-primary/20 hover:bg-fortis-primary/30 text-fortis-primary rounded-lg text-sm font-medium transition-colors border border-fortis-primary/30"
                >
                  ← Current
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={isForecastView ? selectedForecast.day : 'current'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between my-4"
          >
            <div className="flex flex-col">
              <motion.span 
                className="text-7xl font-bold tracking-tighter bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                {temperature}°
              </motion.span>
              <span className="text-lg text-slate-400">
                {isForecastView ? `Low ${selectedForecast.low}°` : `Feels like ${feelsLike}°`}
              </span>
            </div>
            
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <WeatherIcon condition={condition} className="w-24 h-24" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="text-center font-medium text-xl mb-4 text-white"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {condition}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 gap-4 text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="bg-slate-700/50 p-3 rounded-lg text-center backdrop-blur-sm border border-slate-600/50 hover:border-fortis-primary/50 transition-all cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <p className="text-slate-400">💧 Humidity</p>
            <p className="font-bold text-lg text-white">
              {humidity}%
              {isForecastView && <span className="text-xs text-slate-400 ml-1">est.</span>}
            </p>
          </motion.div>
          <motion.div 
            className="bg-slate-700/50 p-3 rounded-lg text-center backdrop-blur-sm border border-slate-600/50 hover:border-fortis-primary/50 transition-all cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <p className="text-slate-400">💨 Wind Speed</p>
            <p className="font-bold text-lg text-white">
              {windSpeed} km/h
              {isForecastView && <span className="text-xs text-slate-400 ml-1">est.</span>}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};