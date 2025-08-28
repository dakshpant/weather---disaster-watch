import React from 'react';
import type { Alert, AlertType, AlertSeverity } from '../types';
import { FloodIcon, EarthquakeIcon, AvalancheIcon } from './icons';

interface MapPanelProps {
  location: string;
  alerts: Alert[];
}

const getAlertPinColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Warning': return 'bg-rose-500 ring-rose-300';
      case 'Watch': return 'bg-amber-400 ring-amber-200';
      case 'Advisory': return 'bg-indigo-500 ring-indigo-300';
      default: return 'bg-slate-500 ring-slate-300';
    }
};

const AlertPin: React.FC<{ type: AlertType, className?: string }> = ({ type, className }) => {
    switch(type) {
        case 'Flood': return <FloodIcon className={className} />;
        case 'Earthquake': return <EarthquakeIcon className={className} />;
        case 'Avalanche': return <AvalancheIcon className={className} />;
        default: return null;
    }
};

const getPinPosition = (alertType: AlertType, location: string) => {
    if (location.includes('San Francisco')) {
        return { top: '45%', left: '20%' };
    }
    if (location.includes('Denver')) {
        return { top: '40%', left: '45%' };
    }
    if (location.includes('Miami')) {
        return { top: '70%', left: '80%' };
    }
    return { top: '50%', left: '50%' };
}


export const MapPanel: React.FC<MapPanelProps> = ({ location, alerts }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg h-full border border-slate-700">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Disaster Proximity Map</h2>
      <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-cover bg-center rounded-lg overflow-hidden" style={{backgroundImage: "url('https://picsum.photos/seed/map123/1200/600')"}}>
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
          
          {alerts.map(alert => (
            <div key={alert.id} className="absolute group" style={getPinPosition(alert.type, location)}>
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ring-4 ${getAlertPinColor(alert.severity)}`}>
                    <AlertPin type={alert.type} className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950 text-white text-xs rounded py-1 px-2 pointer-events-none">
                    <p className="font-bold">{alert.title}</p>
                    <p>{alert.area}</p>
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};