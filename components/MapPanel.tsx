import React from 'react';
import type { Alert, AlertType, AlertSeverity } from '../types';
import { FloodIcon, EarthquakeIcon, AvalancheIcon, HeatwaveIcon, CycloneIcon, DroughtIcon, LandslideIcon } from './icons';
import { motion } from 'motion/react';

interface MapPanelProps {
  location: string;
  alerts: Alert[];
}

const getAlertColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'Warning': return {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      text: 'text-rose-400',
      icon: 'text-rose-400',
      glow: 'shadow-rose-500/20'
    };
    case 'Watch': return {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      icon: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    };
    case 'Advisory': return {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      icon: 'text-blue-400',
      glow: 'shadow-blue-500/20'
    };
    default: return {
      bg: 'bg-slate-500/20',
      border: 'border-slate-500/50',
      text: 'text-slate-400',
      icon: 'text-slate-400',
      glow: 'shadow-slate-500/20'
    };
  }
};

const AlertIcon: React.FC<{ type: AlertType, className?: string }> = ({ type, className }) => {
  switch(type) {
    case 'Flood': return <FloodIcon className={className} />;
    case 'Earthquake': return <EarthquakeIcon className={className} />;
    case 'Avalanche': return <AvalancheIcon className={className} />;
    case 'Heatwave': return <HeatwaveIcon className={className} />;
    case 'Cyclone': return <CycloneIcon className={className} />;
    case 'Drought': return <DroughtIcon className={className} />;
    case 'Landslide': return <LandslideIcon className={className} />;
    default: return null;
  }
};

export const MapPanel: React.FC<MapPanelProps> = ({ location, alerts }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg h-full border border-slate-700 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-fortis-primary/5 to-transparent opacity-50 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <span className="text-fortis-primary">🚨</span>
            Active Alerts
          </h2>
          <span className="text-sm text-fortis-muted">
            {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        </div>

        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-lg font-medium text-green-400">All Clear</p>
            <p className="text-sm text-slate-400 mt-1">No active weather alerts</p>
          </motion.div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {alerts.map((alert, index) => {
              const colors = getAlertColor(alert.severity);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`${colors.bg} ${colors.border} border backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:${colors.glow} shadow-lg cursor-pointer group`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center ${colors.icon}`}>
                      <AlertIcon type={alert.type} className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm truncate">{alert.title}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border} whitespace-nowrap`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          📍 {alert.area}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expand indicator */}
                  <div className="mt-2 pt-2 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-slate-400 text-center">Click for more details →</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
};