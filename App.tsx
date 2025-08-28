import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AlertPage } from './pages/AlertPage';
import { fetchWeatherData, MockLocation } from './services/weatherService';
import type { WeatherData } from './types';
import { FloodIcon, EarthquakeIcon, AvalancheIcon } from './components/icons';

// A simple custom hook for hash-based routing
const useHashNavigation = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  return route;
};

const App: React.FC = () => {
  const [location, setLocation] = useState<MockLocation>('San Francisco');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const route = useHashNavigation();

  const loadWeatherData = useCallback(async (loc: MockLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(location);
  }, [location, loadWeatherData]);

  const renderContent = () => {
    if (!weatherData) return null;

    switch (route) {
      case '#/flood':
        return <AlertPage weatherData={weatherData} alertType="Flood" Icon={FloodIcon} title="Flood Alerts" />;
      case '#/earthquake':
        return <AlertPage weatherData={weatherData} alertType="Earthquake" Icon={EarthquakeIcon} title="Earthquake Alerts" />;
      case '#/avalanche':
        return <AlertPage weatherData={weatherData} alertType="Avalanche" Icon={AvalancheIcon} title="Avalanche Alerts" />;
      case '#/':
      default:
        return <HomePage weatherData={weatherData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black font-sans text-slate-200">
      <Header selectedLocation={location} onLocationChange={setLocation} />
      <Navbar route={route} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-rose-300 bg-rose-900/50 p-6 rounded-lg">
            <p className="text-xl font-semibold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default App;