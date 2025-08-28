import React from 'react';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastPanel } from '../components/ForecastPanel';
import { AlertPanel } from '../components/AlertPanel';
import { MapPanel } from '../components/MapPanel';
import type { WeatherData } from '../types';

interface HomePageProps {
  weatherData: WeatherData;
}

export const HomePage: React.FC<HomePageProps> = ({ weatherData }) => {
  const activeAlerts = weatherData?.alerts.filter(alert => alert.severity === 'Warning' || alert.severity === 'Watch') || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div className="lg:col-span-3 xl:col-span-4">
        <AlertPanel alerts={activeAlerts} />
      </div>
      <div className="lg:col-span-1 xl:col-span-1">
        <WeatherCard current={weatherData.current} />
      </div>
      <div className="lg:col-span-2 xl:col-span-3">
        <ForecastPanel forecast={weatherData.forecast} />
      </div>
      <div className="lg:col-span-3 xl:col-span-4">
         <MapPanel location={weatherData.current.location} alerts={weatherData.alerts} />
      </div>
    </div>
  );
};
