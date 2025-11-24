// Configuration for data source
// Set to true to use mock data, false to use Open-Meteo API
export const USE_MOCK_DATA = false;

// API URLs
export const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Alert thresholds
export const ALERT_THRESHOLDS = {
  flood: {
    precipitation24h: 50, // mm
    humidity: 85, // %
  },
  heatwave: {
    temperature: 35, // °C
  },
  cyclone: {
    windSpeed: 60, // km/h
    precipitation: 30, // mm
  },
  drought: {
    precipitation7days: 5, // mm
    temperature: 30, // °C
  },
  landslide: {
    precipitation24h: 100, // mm
  },
};
