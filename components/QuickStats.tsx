import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface QuickStatProps {
  title: string;
  state: string;
  value: string;
  icon: string;
  gradient: string;
  delay: number;
}

const QuickStatCard: React.FC<QuickStatProps> = ({ title, state, value, icon, gradient, delay }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onClick={() => navigate(`/analysis/${state}`)}
      className={`relative bg-gradient-to-br ${gradient} backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 overflow-hidden cursor-pointer group`}
    >
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-fortis-primary/10 to-transparent opacity-0 group-hover:opacity-100 animate-pulse transition-opacity"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-3">{icon}</div>
        <h3 className="text-fortis-primary font-semibold text-sm mb-2">{title}</h3>
        <p className="text-white text-2xl font-bold mb-1">{state}</p>
        <p className="text-slate-300 text-lg">{value}</p>
        
        {/* Click indicator */}
        <motion.div
          className="mt-3 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ y: 5 }}
          whileHover={{ y: 0 }}
        >
          Click to view details →
        </motion.div>
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-fortis-primary/20 to-transparent rounded-bl-full"></div>
    </motion.div>
  );
};

export const QuickStats: React.FC = () => {
  return (
    <div className="mt-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-6 text-center"
      >
        <span className="bg-gradient-to-r from-fortis-primary to-blue-400 bg-clip-text text-transparent">
          Today's Highlights
        </span>
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          title="HOTTEST"
          state="Rajasthan"
          value="42°C"
          icon="🔥"
          gradient="from-orange-500/30 to-red-500/20"
          delay={0}
        />
        <QuickStatCard
          title="COLDEST"
          state="Himachal Pradesh"
          value="-2°C"
          icon="❄️"
          gradient="from-cyan-500/30 to-blue-500/20"
          delay={0.1}
        />
        <QuickStatCard
          title="HIGHEST RAINFALL"
          state="Assam"
          value="150mm"
          icon="🌧️"
          gradient="from-blue-500/30 to-indigo-500/20"
          delay={0.2}
        />
        <QuickStatCard
          title="MOST ALERTS"
          state="Bihar"
          value="8 Active"
          icon="⚠️"
          gradient="from-amber-500/30 to-orange-500/20"
          delay={0.3}
        />
      </div>
    </div>
  );
};
