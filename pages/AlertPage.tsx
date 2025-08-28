import React from 'react';
import { AlertPanel } from '../components/AlertPanel';
import type { WeatherData, AlertType } from '../types';

interface AlertPageProps {
  weatherData: WeatherData;
  alertType: AlertType;
  Icon: React.FC<{className?: string}>;
  title: string;
}

export const AlertPage: React.FC<AlertPageProps> = ({ weatherData, alertType, Icon, title }) => {
  const filteredAlerts = weatherData.alerts.filter(alert => alert.type === alertType);
  
  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-4">
          <Icon className="w-10 h-10 text-cyan-400" />
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
       </div>
       {filteredAlerts.length > 0 ? (
          <AlertPanel alerts={filteredAlerts} />
       ) : (
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 text-center">
            <p className="font-semibold text-slate-300">No active {alertType.toLowerCase()} alerts for {weatherData.current.location}.</p>
          </div>
       )}
    </div>
  );
};