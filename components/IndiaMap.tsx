import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchWeatherData } from '../services/weatherService';
import type { Alert } from '../types';

interface IndiaMapProps {
  className?: string;
}

interface StateAlerts {
  [key: string]: Alert[];
}

interface StateShape {
  path: string;
  center: { x: number; y: number };
  isIsland?: boolean;
}

// High-level: coordinates are illustrative, not geospatially exact.
// You can tweak them visually in your editor.
const stateData: Record<string, StateShape> = {
  // Existing states
  Kerala: {
    path: 'M 180,450 L 185,445 L 190,448 L 195,455 L 190,465 L 185,470 L 180,465 Z',
    center: { x: 188, y: 456 },
  },
  'Tamil Nadu': {
    path: 'M 195,430 L 210,425 L 225,430 L 235,445 L 230,465 L 215,472 L 200,465 L 195,450 Z',
    center: { x: 215, y: 448 },
  },
  Karnataka: {
    path: 'M 175,400 L 195,395 L 215,400 L 225,418 L 220,435 L 200,442 L 180,435 L 175,415 Z',
    center: { x: 198, y: 418 },
  },
  'Andhra Pradesh': {
    path: 'M 220,390 L 250,386 L 265,395 L 270,412 L 265,430 L 245,438 L 230,432 L 222,415 Z',
    center: { x: 244, y: 409 },
  },
  Telangana: {
    path: 'M 215,365 L 235,360 L 250,368 L 252,384 L 240,395 L 225,392 L 217,378 Z',
    center: { x: 236, y: 377 },
  },
  Maharashtra: {
    path: 'M 150,340 L 182,335 L 210,340 L 225,355 L 222,378 L 200,388 L 175,382 L 158,370 L 150,350 Z',
    center: { x: 188, y: 359 },
  },
  Gujarat: {
    path: 'M 110,280 L 142,275 L 165,285 L 172,305 L 166,326 L 145,334 L 125,328 L 115,312 L 110,295 Z',
    center: { x: 142, y: 305 },
  },
  Rajasthan: {
    path: 'M 125,220 L 170,215 L 198,225 L 210,246 L 205,272 L 185,288 L 155,282 L 135,270 L 127,250 Z',
    center: { x: 170, y: 248 },
  },
  'Madhya Pradesh': {
    path: 'M 185,285 L 215,280 L 248,290 L 265,310 L 260,336 L 235,347 L 208,342 L 190,332 L 185,310 Z',
    center: { x: 225, y: 315 },
  },
  'Uttar Pradesh': {
    path: 'M 205,210 L 250,205 L 282,215 L 298,235 L 294,260 L 275,277 L 248,272 L 220,262 L 208,245 L 205,225 Z',
    center: { x: 252, y: 239 },
  },
  Bihar: {
    path: 'M 280,245 L 312,240 L 332,248 L 338,265 L 332,282 L 312,288 L 292,283 L 280,266 Z',
    center: { x: 309, y: 262 },
  },
  Jharkhand: {
    path: 'M 272,282 L 300,276 L 318,286 L 322,302 L 316,318 L 296,323 L 276,317 L 272,300 Z',
    center: { x: 298, y: 299 },
  },
  'West Bengal': {
    path: 'M 312,264 L 346,260 L 365,268 L 377,288 L 372,312 L 353,322 L 332,318 L 320,302 L 314,284 Z',
    center: { x: 344, y: 292 },
  },
  Odisha: {
    path: 'M 258,336 L 286,332 L 306,341 L 316,362 L 311,388 L 290,398 L 268,392 L 258,372 Z',
    center: { x: 288, y: 364 },
  },
  Assam: {
    path: 'M 374,236 L 408,230 L 432,238 L 438,252 L 432,270 L 408,276 L 384,270 L 374,255 Z',
    center: { x: 406, y: 252 },
  },
  Punjab: {
    path: 'M 160,165 L 188,160 L 204,170 L 204,186 L 194,197 L 176,197 L 166,187 L 160,175 Z',
    center: { x: 184, y: 179 },
  },
  Haryana: {
    path: 'M 186,180 L 214,176 L 230,186 L 230,206 L 218,218 L 196,218 L 186,206 L 186,190 Z',
    center: { x: 208, y: 196 },
  },
  Delhi: {
    path: 'M 201,186 L 211,184 L 218,191 L 218,198 L 210,204 L 201,201 L 199,193 Z',
    center: { x: 210, y: 194 },
  },
  'Himachal Pradesh': {
    path: 'M 166,130 L 198,125 L 220,136 L 224,156 L 214,170 L 188,176 L 172,166 L 166,146 Z',
    center: { x: 196, y: 150 },
  },
  Uttarakhand: {
    path: 'M 216,145 L 244,140 L 262,150 L 266,166 L 256,182 L 234,186 L 222,176 L 216,160 Z',
    center: { x: 241, y: 163 },
  },

  // Newly added mainland states / UTs
  'Jammu & Kashmir': {
    path: 'M 170,95 L 210,90 L 232,96 L 236,112 L 224,128 L 198,132 L 176,126 L 168,110 Z',
    center: { x: 203, y: 110 },
  },
  Ladakh: {
    path: 'M 210,80 L 248,76 L 272,82 L 276,98 L 266,112 L 244,118 L 226,112 L 214,98 Z',
    center: { x: 245, y: 96 },
  },
  Chandigarh: {
    path: 'M 192,172 L 198,171 L 201,174 L 201,178 L 196,180 L 192,178 Z',
    center: { x: 197, y: 176 },
  },
  Goa: {
    path: 'M 170,410 L 177,408 L 181,412 L 181,420 L 176,424 L 170,422 Z',
    center: { x: 176, y: 416 },
  },
  Chhattisgarh: {
    path: 'M 245,310 L 268,305 L 286,314 L 292,335 L 286,356 L 270,364 L 252,360 L 244,342 Z',
    center: { x: 270, y: 335 },
  },
  Sikkim: {
    path: 'M 310,244 L 318,242 L 323,246 L 323,252 L 318,256 L 310,254 Z',
    center: { x: 316, y: 249 },
  },
  'Arunachal Pradesh': {
    path: 'M 390,215 L 426,210 L 452,220 L 460,238 L 452,254 L 430,258 L 400,252 L 390,236 Z',
    center: { x: 429, y: 233 },
  },
  Nagaland: {
    path: 'M 414,252 L 432,250 L 444,258 L 446,270 L 440,282 L 426,284 L 416,276 Z',
    center: { x: 432, y: 268 },
  },
  Manipur: {
    path: 'M 410,280 L 424,280 L 432,286 L 432,296 L 424,304 L 412,304 L 406,295 Z',
    center: { x: 420, y: 292 },
  },
  Mizoram: {
    path: 'M 402,298 L 414,298 L 420,306 L 420,320 L 414,330 L 404,330 L 398,320 Z',
    center: { x: 410, y: 315 },
  },
  Tripura: {
    path: 'M 382,296 L 392,294 L 398,300 L 398,312 L 392,318 L 384,316 Z',
    center: { x: 391, y: 306 },
  },
  Meghalaya: {
    path: 'M 372,270 L 392,268 L 404,272 L 408,280 L 402,288 L 386,290 L 374,286 Z',
    center: { x: 390, y: 279 },
  },

  // Remaining UTs / islands
  'Andaman & Nicobar Islands': {
    path: 'M 420,420 L 424,428 L 422,436 L 418,444 L 420,452 L 426,460 L 430,468 L 428,476 L 422,482 L 416,478 L 412,470 L 410,460 L 408,450 L 410,440 L 414,432 Z',
    center: { x: 420, y: 455 },
    isIsland: true,
  },
  Lakshadweep: {
    path: 'M 120,410 L 124,414 L 122,420 L 118,424 L 114,420 L 114,414 Z',
    center: { x: 119, y: 417 },
    isIsland: true,
  },
  'Dadra & Nagar Haveli and Daman & Diu': {
    path: 'M 132,310 L 138,308 L 142,312 L 142,318 L 138,322 L 132,320 Z',
    center: { x: 137, y: 316 },
  },
  Puducherry: {
    path: 'M 210,440 L 216,438 L 220,442 L 220,448 L 216,452 L 210,450 Z',
    center: { x: 215, y: 446 },
  },
};

export const IndiaMap: React.FC<IndiaMapProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateAlerts, setStateAlerts] = useState<StateAlerts>({});
  const [loading, setLoading] = useState(true);

  const statesEntries = useMemo(() => Object.entries(stateData), []);

  useEffect(() => {
    let mounted = true;

    const fetchAllAlerts = async () => {
      setLoading(true);
      const stateNames = Object.keys(stateData);

      const promises = stateNames.map((name) =>
        fetchWeatherData(name).then(
          (data) => ({ status: 'fulfilled' as const, name, data }),
          (error) => ({ status: 'rejected' as const, name, error })
        )
      );

      const results = await Promise.all(promises);
      if (!mounted) return;

      const alerts: StateAlerts = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          if (r.data?.alerts?.length) {
            alerts[r.name] = r.data.alerts;
          }
        } else {
          console.warn(`Failed to fetch alerts for ${r.name}`, r.error);
        }
      });

      if (mounted) {
        setStateAlerts(alerts);
        setLoading(false);
      }
    };

    fetchAllAlerts();

    return () => {
      mounted = false;
    };
  }, []);

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    navigate(`/analysis/${encodeURIComponent(stateName)}`);
  };

  const handleStateKeyDown = (e: React.KeyboardEvent, stateName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStateClick(stateName);
    }
  };

  const hasAlerts = (stateName: string) =>
    !!(stateAlerts[stateName] && stateAlerts[stateName].length > 0);

  const getAlertSeverity = (
    stateName: string
  ): 'Warning' | 'Watch' | 'Advisory' | null => {
    const alerts = stateAlerts[stateName];
    if (!alerts || !alerts.length) return null;
    if (alerts.some((a) => a.severity === 'Warning')) return 'Warning';
    if (alerts.some((a) => a.severity === 'Watch')) return 'Watch';
    return 'Advisory';
  };

  // more "map-like" palette
  const getStateColor = (stateName: string) => {
    const severity = getAlertSeverity(stateName);
    if (selectedState === stateName) return '#2f7ed8'; // focused blue

    if (severity === 'Warning') return '#c62828'; // deep red
    if (severity === 'Watch') return '#ef6c00'; // orange
    if (severity === 'Advisory') return '#fdd835'; // muted yellow

    // default land color (soft green/earth tone)
    return '#4caf50';
  };

  const getFillOpacity = (stateName: string) => {
    const severity = getAlertSeverity(stateName);
    if (severity) return 0.95;
    return 0.75;
  };

  const getStrokeColor = (stateName: string) => {
    const severity = getAlertSeverity(stateName);
    if (severity === 'Warning') return '#b71c1c';
    if (severity === 'Watch') return '#e65100';
    if (severity === 'Advisory') return '#fbc02d';
    return '#37474f';
  };

  const getAlertColor = (severity: 'Warning' | 'Watch' | 'Advisory') => {
    switch (severity) {
      case 'Warning':
        return '#ff5252';
      case 'Watch':
        return '#ffb74d';
      case 'Advisory':
        return '#fff176';
    }
  };

  const severityCounts = useMemo(() => {
    const counts = { Warning: 0, Watch: 0, Advisory: 0 };
    Object.keys(stateAlerts).forEach((stateName) => {
      const s = getAlertSeverity(stateName);
      if (s) counts[s] += 1;
    });
    return counts;
  }, [stateAlerts]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-xl z-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-fortis-primary mx-auto mb-2 rounded-full" />
            <p className="text-slate-300 text-sm">Loading national alert map…</p>
          </div>
        </div>
      )}

      <div className="relative">
        <svg
          viewBox="0 0 550 550"
          className="w-full h-full rounded-xl"
        >
          <defs>
            {/* Ocean gradient */}
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#022c43" />
              <stop offset="50%" stopColor="#053f5e" />
              <stop offset="100%" stopColor="#115173" />
            </linearGradient>

            {/* Land subtle relief */}
            <radialGradient id="landRelief" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff10" />
              <stop offset="100%" stopColor="#00000040" />
            </radialGradient>

            {/* Soft inner shadow for land bounding box */}
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feOffset dx="0" dy="0" />
              <feGaussianBlur stdDeviation="10" result="offset-blur" />
              <feComposite
                operator="out"
                in="SourceGraphic"
                in2="offset-blur"
                result="inverse"
              />
              <feFlood floodColor="#000000" floodOpacity="0.4" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Background ocean */}
          <rect width="550" height="550" fill="url(#oceanGradient)" />

          {/* Faint world grid lines to feel like a chart */}
          {[...Array(10)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={50 + i * 45}
              y1={40}
              x2={50 + i * 45}
              y2={510}
              stroke="#ffffff0f"
              strokeWidth={0.5}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1={40}
              y1={60 + i * 45}
              x2={510}
              y2={60 + i * 45}
              stroke="#ffffff0f"
              strokeWidth={0.5}
            />
          ))}

          {/* Land bounding box for subtle shadow */}
          <rect
            x="90"
            y="90"
            width="360"
            height="380"
            rx="18"
            fill="#1b4332aa"
            stroke="#d8f3dc60"
            strokeWidth="1.2"
            filter="url(#innerShadow)"
          />

          {/* Slight relief overlay */}
          <rect
            x="90"
            y="90"
            width="360"
            height="380"
            rx="18"
            fill="url(#landRelief)"
            opacity="0.7"
          />

          {/* India states */}
          {statesEntries.map(([stateName, data]) => {
            const severity = getAlertSeverity(stateName);
            const alertColor = severity ? getAlertColor(severity) : undefined;
            const islandScale = data.isIsland ? 0.95 : 1;

            return (
              <motion.g key={stateName}>
                <motion.path
                  d={data.path}
                  fill={getStateColor(stateName)}
                  fillOpacity={getFillOpacity(stateName)}
                  stroke={getStrokeColor(stateName)}
                  strokeWidth={hoveredState === stateName ? 2.2 : 1.1}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(stateName)}
                  onKeyDown={(e) => handleStateKeyDown(e, stateName)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${stateName}${
                    severity ? `, ${severity} level alerts` : ', no active alerts'
                  }`}
                  initial={{ opacity: 0, scale: 0.95 * islandScale }}
                  animate={{ opacity: 1, scale: 1 * islandScale }}
                  transition={{
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 80,
                    damping: 15,
                  }}
                  whileHover={{
                    scale: 1.03 * islandScale,
                  }}
                  whileTap={{ scale: 0.97 * islandScale }}
                />

                {/* Always-visible state label (small, map-style) */}
                <text
                  x={data.center.x}
                  y={data.center.y}
                  textAnchor="middle"
                  fill="#e9ecef"
                  fontSize={stateName.length > 12 ? 7 : 9}
                  fontWeight={hoveredState === stateName ? 'bold' : 'normal'}
                  style={{ pointerEvents: 'none' }}
                >
                  {stateName}
                </text>

                {/* Pulsing indicator only for states with alerts */}
                {severity && alertColor && (
                  <>
                    <motion.circle
                      cx={data.center.x}
                      cy={data.center.y - 12}
                      r="5"
                      fill="none"
                      stroke={alertColor}
                      strokeWidth="1.6"
                      animate={{
                        scale: [1, 1.7, 1],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.circle
                      cx={data.center.x}
                      cy={data.center.y - 12}
                      r="3"
                      fill={alertColor}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </>
                )}
              </motion.g>
            );
          })}

          {/* Simple north arrow & label */}
          <g transform="translate(470,100)">
            <polygon points="0,0 8,20 -8,20" fill="#e9ecef" />
            <line x1="0" y1="20" x2="0" y2="40" stroke="#e9ecef" strokeWidth="1" />
            <text
              x={0}
              y={55}
              textAnchor="middle"
              fontSize="10"
              fill="#e9ecef"
              fontWeight="bold"
            >
              N
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 shadow-lg">
          <p className="font-semibold text-[11px] mb-1">Alert Legend</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-[#c62828]" />
            <span>Warning ({severityCounts.Warning})</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-[#ef6c00]" />
            <span>Watch ({severityCounts.Watch})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fdd835]" />
            <span>Advisory ({severityCounts.Advisory})</span>
          </div>
        </div>
      </div>

      {/* Hover tooltip at bottom center */}
      {hoveredState && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-700 px-6 py-3 rounded-xl backdrop-blur-md shadow-xl"
        >
          <p className="text-slate-50 font-semibold text-sm">{hoveredState}</p>
          {hasAlerts(hoveredState) ? (
            <p className="text-amber-300 text-xs mt-1">
              ⚠ {stateAlerts[hoveredState].length} active alert
              {stateAlerts[hoveredState].length > 1 ? 's' : ''} · Click for full
              analysis →
            </p>
          ) : (
            <p className="text-slate-400 text-xs mt-1">
              No active alerts · Click for detailed weather →
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
