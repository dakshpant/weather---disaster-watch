import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { fetchWeatherData } from "../services/weatherService";
import type { Alert } from "../types";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

// Use this until topojson loads, or replace with your existing list
const AVAILABLE_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Ladakh"
];

const INDIA_TOPO_JSON =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

interface Props {
  className?: string;
}

export const AccurateIndiaMap: React.FC<Props> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [stateAlerts, setStateAlerts] = useState<Record<string, Alert[]>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch alerts for all states
  useEffect(() => {
    const loadAlerts = async () => {
      const alerts: Record<string, Alert[]> = {};

      for (const name of AVAILABLE_STATES) {
        try {
          const data = await fetchWeatherData(name as any);
          if (data.alerts?.length) alerts[name] = data.alerts;
        } catch {
          /* ignore errors */
        }
      }

      setStateAlerts(alerts);
      setLoading(false);
    };

    loadAlerts();
  }, []);

  // Helpers ----------------------------------------------------------

  const getAlertSeverity = (name: string) => {
    const alerts = stateAlerts[name];
    if (!alerts) return null;

    if (alerts.some(a => a.severity === "Warning")) return "Warning";
    if (alerts.some(a => a.severity === "Watch")) return "Watch";
    return "Advisory";
  };

  const getStateColor = (name: string) => {
    if (selected === name) return "#00d9ff";
    if (hovered === name) return "#00d9ff80";

    const sev = getAlertSeverity(name);

    return (
      {
        Warning: "#ff000040",
        Watch: "#ffa50040",
        Advisory: "#ffff0040",
        null: "#1e293b60",
      }[sev ?? "null"]
    );
  };

  const getStrokeColor = (name: string) => {
    const sev = getAlertSeverity(name);
    return (
      {
        Warning: "#ff0000",
        Watch: "#ffa500",
        Advisory: "#ffff00",
        null: "#00d9ff",
      }[sev ?? "null"]
    );
  };

  const alertIndicatorColor = (severity: "Warning" | "Watch" | "Advisory") =>
    ({
      Warning: "#ff0000",
      Watch: "#ffa500",
      Advisory: "#ffff00",
    }[severity]);

  const hasAlerts = (name: string) => !!stateAlerts[name];

  // ------------------------------------------------------------------

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl z-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-fortis-primary mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Loading alert data...</p>
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1000, center: [80, 22] }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.NAME_1;

              return (
                <motion.g
                  key={geo.rsmKey}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    setSelected(name);
                    navigate(`/analysis/${name}`);
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.3)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Geography
                    geography={geo}
                    fill={getStateColor(name)}
                    stroke={getStrokeColor(name)}
                    strokeWidth={hovered === name ? 2.4 : hasAlerts(name) ? 1.5 : 1}
                    style={{ outline: "none" }}
                  />

                  {hovered === name && (
                    <motion.text
                      x={geo.centroid[0]}
                      y={geo.centroid[1]}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-lg"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ textShadow: "0 0 10px rgba(0,217,255,0.8)" }}
                    >
                      {name}
                      {hasAlerts(name) && ` (${stateAlerts[name].length})`}
                    </motion.text>
                  )}
                </motion.g>
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Alert Pulse Effects */}
      {Object.entries(stateAlerts).map(([name, alerts]) => {
        const sev = getAlertSeverity(name);
        if (!sev) return null;

        const color = alertIndicatorColor(sev);

        return (
          <motion.g key={name}>
            <motion.circle
              cx={400}
              cy={300}
              r="6"
              fill="none"
              stroke={color}
              strokeWidth="2"
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx={400}
              cy={300}
              r="4"
              fill={color}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>
        );
      })}

      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-fortis-primary px-6 py-3 rounded-xl backdrop-blur-sm shadow-lg shadow-fortis-primary/20"
        >
          <p className="text-fortis-primary font-bold">{hovered}</p>
          {hasAlerts(hovered) ? (
            <p className="text-amber-400 text-xs mt-1">
              ⚠️ {stateAlerts[hovered].length} Alerts — Click to view
            </p>
          ) : (
            <p className="text-slate-400 text-xs mt-1">Click for details →</p>
          )}
        </motion.div>
      )}
    </div>
  );
};
