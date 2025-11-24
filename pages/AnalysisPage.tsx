import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastPanel } from '../components/ForecastPanel';
import { AlertPanel } from '../components/AlertPanel';
import { MapPanel } from '../components/MapPanel';
import { fetchWeatherData, MockLocation, AVAILABLE_LOCATIONS } from '../services/weatherService';
import { WeatherData, Forecast } from '../types';
import { motion } from 'motion/react';

export const AnalysisPage: React.FC = () => {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForecast, setSelectedForecast] = useState<Forecast | null>(null);

  const loadWeatherData = useCallback(async (loc: string) => {
    setLoading(true);
    setError(null);
    
    // Validate location
    if (!AVAILABLE_LOCATIONS.includes(loc as MockLocation)) {
        setError(`Location "${loc}" not found.`);
        setLoading(false);
        return;
    }

    try {
      const data = await fetchWeatherData(loc as MockLocation);
      setWeatherData(data);
      setSelectedForecast(null); // Reset selection when new data loads
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state) {
      loadWeatherData(state);
    }
  }, [state, loadWeatherData]);

  const handleForecastSelect = (forecast: Forecast) => {
    setSelectedForecast(forecast);
  };

  const handleResetToCurrentWeather = () => {
    setSelectedForecast(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-fortis-primary"></div>
            <p className="text-fortis-muted animate-pulse">Analyzing satellite data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !weatherData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center max-w-md p-8 border border-red-900/50 bg-red-950/10">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Analysis Failed</h2>
            <p className="text-fortis-muted mb-6">{error || "Unknown error occurred."}</p>
            <button 
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-fortis-surface hover:bg-fortis-primary hover:text-black transition-colors border border-fortis-surface"
            >
                Return to Base
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end border-b border-fortis-surface pb-6"
        >
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">{weatherData.current.location}</h1>
                <p className="text-fortis-primary font-mono text-sm">LAT: 28.61° N | LONG: 77.20° E | LIVE FEED</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
                <p className="text-fortis-muted text-sm">Last Updated</p>
                <p className="text-white font-mono">{new Date().toLocaleTimeString()}</p>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <WeatherCard 
              current={weatherData.current} 
              selectedForecast={selectedForecast}
              onResetToCurrentWeather={handleResetToCurrentWeather}
            />
          </motion.div>

          {/* Map Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <MapPanel location={weatherData.current.location} alerts={weatherData.alerts} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forecast Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <ForecastPanel 
              forecast={weatherData.forecast} 
              onForecastSelect={handleForecastSelect}
              selectedForecast={selectedForecast}
            />
          </motion.div>

          {/* Alerts Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <AlertPanel alerts={weatherData.alerts} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
