import React from 'react';
import type { Alert, AlertSeverity, AlertType } from '../types';
import { FloodIcon, EarthquakeIcon, AvalancheIcon } from './icons';

interface AlertPanelProps {
  alerts: Alert[];
}

const getAlertStyles = (severity: AlertSeverity) => {
  switch (severity) {
    case 'Warning':
      return {
        bg: 'bg-rose-900/50 border-rose-500',
        iconColor: 'text-rose-400',
        titleColor: 'text-rose-300',
      };
    case 'Watch':
      return {
        bg: 'bg-amber-900/50 border-amber-500',
        iconColor: 'text-amber-400',
        titleColor: 'text-amber-300',
      };
    case 'Advisory':
      return {
        bg: 'bg-indigo-900/50 border-indigo-500',
        iconColor: 'text-indigo-400',
        titleColor: 'text-indigo-300',
      };
    default:
      return {
        bg: 'bg-slate-700/50 border-slate-500',
        iconColor: 'text-slate-400',
        titleColor: 'text-slate-300',
      };
  }
};

const AlertIcon: React.FC<{ type: AlertType, className: string }> = ({ type, className }) => {
    switch(type) {
        case 'Flood': return <FloodIcon className={className} />;
        case 'Earthquake': return <EarthquakeIcon className={className} />;
        case 'Avalanche': return <AvalancheIcon className={className} />;
        default: return null;
    }
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
    if (alerts.length === 0) {
        return (
            <div className="bg-emerald-900/50 border border-emerald-500 rounded-lg p-4 text-center">
                <p className="font-semibold text-emerald-300">All Clear: No active warnings or watches.</p>
            </div>
        );
    }

  return (
    <div className="space-y-4">
      {alerts.map(alert => {
        const styles = getAlertStyles(alert.severity);
        return (
          <div key={alert.id} className={`flex items-start p-4 rounded-lg border-l-4 ${styles.bg}`}>
            <div className={`flex-shrink-0 mr-4 ${styles.iconColor}`}>
              <AlertIcon type={alert.type} className="w-8 h-8"/>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${styles.titleColor}`}>{alert.title}</h3>
              <p className="text-slate-300 text-sm mt-1">{alert.description}</p>
              <p className="text-xs text-slate-400 mt-2">Area: {alert.area}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};