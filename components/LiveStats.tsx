import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, delay }) => {
  const [count, setCount] = useState(0);
  const targetValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    if (typeof value !== 'number') return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative bg-gradient-to-br ${color} backdrop-blur-md rounded-xl p-6 border border-slate-700/50 overflow-hidden group cursor-pointer`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{icon}</span>
          <div className="w-2 h-2 rounded-full bg-fortis-primary animate-pulse"></div>
        </div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-white text-3xl font-bold">
          {typeof value === 'number' ? count : value}
        </p>
      </div>
    </motion.div>
  );
};

export const LiveStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon="🚨"
        label="Active Alerts"
        value={127}
        color="from-rose-500/20 to-slate-800/60"
        delay={0}
      />
      <StatCard
        icon="⚠️"
        label="Warnings"
        value={12}
        color="from-amber-500/20 to-slate-800/60"
        delay={0.1}
      />
      <StatCard
        icon="🌧️"
        label="Avg Rainfall"
        value="45mm"
        color="from-blue-500/20 to-slate-800/60"
        delay={0.2}
      />
      <StatCard
        icon="🌡️"
        label="Temp Range"
        value="18°-42°C"
        color="from-orange-500/20 to-slate-800/60"
        delay={0.3}
      />
    </div>
  );
};
