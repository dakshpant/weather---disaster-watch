import type {
  WeatherData,
  WeatherCondition,
  Alert,
  AlertType,
  AlertSeverity,
  Coordinates,
  GeocodingResult,
  OpenMeteoResponse,
} from '../types';
import { GEO_URL, FORECAST_URL, ALERT_THRESHOLDS } from './apiConfig';
import type { MockLocation } from './weatherService';

// Cache for geocoding results
const geocodingCache: Map<string, Coordinates> = new Map();

// State characteristics (imported from weatherService data)
const stateCharacteristics: Record<MockLocation, { coastal: boolean; mountainous: boolean }> = {
  'Andaman and Nicobar Islands': { coastal: true, mountainous: false },
  'Andhra Pradesh': { coastal: true, mountainous: false },
  'Arunachal Pradesh': { coastal: false, mountainous: true },
  'Assam': { coastal: false, mountainous: true },
  'Bihar': { coastal: false, mountainous: false },
  'Chandigarh': { coastal: false, mountainous: false },
  'Chhattisgarh': { coastal: false, mountainous: false },
  'Dadra and Nagar Haveli and Daman and Diu': { coastal: true, mountainous: false },
  'Delhi': { coastal: false, mountainous: false },
  'Goa': { coastal: true, mountainous: false },
  'Gujarat': { coastal: true, mountainous: false },
  'Haryana': { coastal: false, mountainous: false },
  'Himachal Pradesh': { coastal: false, mountainous: true },
  'Jammu and Kashmir': { coastal: false, mountainous: true },
  'Jharkhand': { coastal: false, mountainous: false },
  'Karnataka': { coastal: true, mountainous: false },
  'Kerala': { coastal: true, mountainous: false },
  'Ladakh': { coastal: false, mountainous: true },
  'Lakshadweep': { coastal: true, mountainous: false },
  'Madhya Pradesh': { coastal: false, mountainous: false },
  'Maharashtra': { coastal: false, mountainous: false },
  'Manipur': { coastal: false, mountainous: true },
  'Meghalaya': { coastal: false, mountainous: true },
  'Mizoram': { coastal: false, mountainous: true },
  'Nagaland': { coastal: false, mountainous: true },
  'Odisha': { coastal: true, mountainous: false },
  'Puducherry': { coastal: true, mountainous: false },
  'Punjab': { coastal: false, mountainous: false },
  'Rajasthan': { coastal: false, mountainous: false },
  'Sikkim': { coastal: false, mountainous: true },
  'Tamil Nadu': { coastal: true, mountainous: false },
  'Telangana': { coastal: false, mountainous: false },
  'Tripura': { coastal: false, mountainous: false },
  'Uttar Pradesh': { coastal: false, mountainous: false },
  'Uttarakhand': { coastal: false, mountainous: true },
  'West Bengal': { coastal: true, mountainous: false },
};

/**
 * Convert WMO weather code to our WeatherCondition type
 */
function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'Sunny';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Rainy';
  if (code >= 85 && code <= 86) return 'Snowy';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Cloudy';
}

/**
 * Geocode a location name to coordinates
 */
// Predefined coordinates for Indian states (more accurate than geocoding API)
const stateCoordinates: Record<MockLocation, Coordinates> = {
  'Andaman and Nicobar Islands': { latitude: 11.7401, longitude: 92.6586 },
  'Andhra Pradesh': { latitude: 15.9129, longitude: 79.7400 },
  'Arunachal Pradesh': { latitude: 28.2180, longitude: 94.7278 },
  'Assam': { latitude: 26.2006, longitude: 92.9376 },
  'Bihar': { latitude: 25.0961, longitude: 85.3131 },
  'Chandigarh': { latitude: 30.7333, longitude: 76.7794 },
  'Chhattisgarh': { latitude: 21.2787, longitude: 81.8661 },
  'Dadra and Nagar Haveli and Daman and Diu': { latitude: 20.1809, longitude: 73.0169 },
  'Delhi': { latitude: 28.7041, longitude: 77.1025 },
  'Goa': { latitude: 15.2993, longitude: 74.1240 },
  'Gujarat': { latitude: 22.2587, longitude: 71.1924 },
  'Haryana': { latitude: 29.0588, longitude: 76.0856 },
  'Himachal Pradesh': { latitude: 31.1048, longitude: 77.1734 },
  'Jammu and Kashmir': { latitude: 33.7782, longitude: 76.5762 },
  'Jharkhand': { latitude: 23.6102, longitude: 85.2799 },
  'Karnataka': { latitude: 15.3173, longitude: 75.7139 },
  'Kerala': { latitude: 10.8505, longitude: 76.2711 },
  'Ladakh': { latitude: 34.1526, longitude: 77.5771 },
  'Lakshadweep': { latitude: 10.5667, longitude: 72.6417 },
  'Madhya Pradesh': { latitude: 22.9734, longitude: 78.6569 },
  'Maharashtra': { latitude: 19.7515, longitude: 75.7139 },
  'Manipur': { latitude: 24.6637, longitude: 93.9063 },
  'Meghalaya': { latitude: 25.4670, longitude: 91.3662 },
  'Mizoram': { latitude: 23.1645, longitude: 92.9376 },
  'Nagaland': { latitude: 26.1584, longitude: 94.5624 },
  'Odisha': { latitude: 20.9517, longitude: 85.0985 },
  'Puducherry': { latitude: 11.9416, longitude: 79.8083 },
  'Punjab': { latitude: 31.1471, longitude: 75.3412 },
  'Rajasthan': { latitude: 27.0238, longitude: 74.2179 },
  'Sikkim': { latitude: 27.5330, longitude: 88.5122 },
  'Tamil Nadu': { latitude: 11.1271, longitude: 78.6569 },
  'Telangana': { latitude: 18.1124, longitude: 79.0193 },
  'Tripura': { latitude: 23.9408, longitude: 91.9882 },
  'Uttar Pradesh': { latitude: 26.8467, longitude: 80.9462 },
  'Uttarakhand': { latitude: 30.0668, longitude: 79.0193 },
  'West Bengal': { latitude: 22.9868, longitude: 87.8550 },
};

/**
 * Get coordinates for a location (using predefined state coordinates)
 */
async function geocodeLocation(location: string): Promise<Coordinates> {
  // Use predefined coordinates for Indian states
  if (stateCoordinates[location as MockLocation]) {
    console.log(`Using predefined coordinates for ${location}:`, stateCoordinates[location as MockLocation]);
    return stateCoordinates[location as MockLocation];
  }

  // Fallback to geocoding API if not in predefined list
  try {
    const response = await fetch(`${GEO_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`Location "${location}" not found`);
    }

    const result: GeocodingResult = data.results[0];
    const coords: Coordinates = {
      latitude: result.latitude,
      longitude: result.longitude,
    };

    console.log(`Geocoded ${location}:`, coords);
    return coords;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode location: ${location}`);
  }
}

/**
 * Fetch weather data from Open-Meteo API
 */
async function fetchOpenMeteoData(coords: Coordinates): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: coords.latitude.toString(),
    longitude: coords.longitude.toString(),
    current: 'temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode',
    hourly: 'temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum',
    timezone: 'auto',
    forecast_days: '7',
  });

  try {
    const response = await fetch(`${FORECAST_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data: OpenMeteoResponse = await response.json();
    console.log('Open-Meteo API Response:', data);
    return data;
  } catch (error) {
    console.error('Open-Meteo API error:', error);
    throw new Error('Failed to fetch weather data from API');
  }
}

/**
 * Generate alerts based on weather conditions and thresholds
 */
function generateAlerts(
  data: OpenMeteoResponse,
  location: MockLocation,
  currentTemp: number,
  currentHumidity: number,
  currentWindSpeed: number
): Alert[] {
  const alerts: Alert[] = [];
  const characteristics = stateCharacteristics[location];

  // Calculate 24h precipitation
  let precipitation24h = 0;
  if (data.hourly && data.hourly.precipitation) {
    precipitation24h = data.hourly.precipitation.slice(0, 24).reduce((sum, val) => sum + val, 0);
  }

  // Calculate 7-day precipitation
  let precipitation7days = 0;
  if (data.daily && data.daily.precipitation_sum) {
    precipitation7days = data.daily.precipitation_sum.slice(0, 7).reduce((sum, val) => sum + val, 0);
  }

  // Flood Alert
  if (precipitation24h > ALERT_THRESHOLDS.flood.precipitation24h || currentHumidity > ALERT_THRESHOLDS.flood.humidity) {
    alerts.push({
      id: `${location.substring(0, 3).toUpperCase()}-FLOOD-${Date.now()}`,
      type: 'Flood',
      severity: precipitation24h > 100 ? 'Warning' : 'Watch',
      title: 'Flood Warning',
      description: `Heavy rainfall detected: ${precipitation24h.toFixed(1)}mm in 24 hours. Humidity at ${currentHumidity}%. Risk of flooding in low-lying areas.`,
      area: location,
    });
  }

  // Heatwave Alert
  if (currentTemp > ALERT_THRESHOLDS.heatwave.temperature) {
    alerts.push({
      id: `${location.substring(0, 3).toUpperCase()}-HEAT-${Date.now()}`,
      type: 'Heatwave',
      severity: currentTemp > 40 ? 'Warning' : 'Advisory',
      title: 'Heatwave Advisory',
      description: `Extreme temperatures detected: ${currentTemp}°C. Stay hydrated and avoid outdoor activities during peak hours.`,
      area: location,
    });
  }

  // Cyclone Alert (coastal areas only)
  if (
    characteristics.coastal &&
    currentWindSpeed > ALERT_THRESHOLDS.cyclone.windSpeed &&
    precipitation24h > ALERT_THRESHOLDS.cyclone.precipitation
  ) {
    alerts.push({
      id: `${location.substring(0, 3).toUpperCase()}-CYCL-${Date.now()}`,
      type: 'Cyclone',
      severity: 'Warning',
      title: 'Cyclone Alert',
      description: `Cyclonic conditions detected. Wind speed: ${currentWindSpeed} km/h, Heavy rainfall: ${precipitation24h.toFixed(1)}mm. Coastal areas at high risk.`,
      area: location,
    });
  }

  // Drought Alert
  if (
    precipitation7days < ALERT_THRESHOLDS.drought.precipitation7days &&
    currentTemp > ALERT_THRESHOLDS.drought.temperature
  ) {
    alerts.push({
      id: `${location.substring(0, 3).toUpperCase()}-DRGT-${Date.now()}`,
      type: 'Drought',
      severity: 'Advisory',
      title: 'Drought Conditions',
      description: `Low rainfall detected: ${precipitation7days.toFixed(1)}mm in 7 days. Temperature: ${currentTemp}°C. Water conservation measures advised.`,
      area: location,
    });
  }

  // Landslide Alert (mountainous areas only)
  if (characteristics.mountainous && precipitation24h > ALERT_THRESHOLDS.landslide.precipitation24h) {
    alerts.push({
      id: `${location.substring(0, 3).toUpperCase()}-LAND-${Date.now()}`,
      type: 'Landslide',
      severity: 'Warning',
      title: 'Landslide Risk',
      description: `Heavy rainfall in mountainous terrain: ${precipitation24h.toFixed(1)}mm in 24 hours. High risk of landslides. Avoid hilly routes.`,
      area: location,
    });
  }

  return alerts;
}

/**
 * Transform Open-Meteo API response to our WeatherData format
 */
function transformToWeatherData(
  data: OpenMeteoResponse,
  location: MockLocation
): WeatherData {
  // Current weather from the new 'current' object
  if (!data.current) {
    throw new Error('No current weather data available from API');
  }

  const currentData = data.current;
  const currentTemp = Math.round(currentData.temperature_2m);
  const currentWindSpeed = Math.round(currentData.windspeed_10m);
  const currentHumidity = Math.round(currentData.relativehumidity_2m);
  const condition = weatherCodeToCondition(currentData.weathercode);

  console.log('Current weather:', {
    temp: currentTemp,
    humidity: currentHumidity,
    windSpeed: currentWindSpeed,
    condition,
  });

  // Generate 5-day forecast from daily data
  if (!data.daily) {
    throw new Error('No daily forecast data available from API');
  }

  const forecast = data.daily.time.slice(0, 5).map((date, i) => {
    const forecastDate = new Date(date);
    // Get actual day name (Mon, Tue, Wed, etc.)
    const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      day: dayName,
      high: Math.round(data.daily!.temperature_2m_max[i]),
      low: Math.round(data.daily!.temperature_2m_min[i]),
      condition: weatherCodeToCondition(data.daily!.weathercode[i]),
    };
  });

  console.log('Generated forecast:', forecast);

  // Generate alerts
  const alerts = generateAlerts(
    data,
    location,
    currentTemp,
    currentHumidity,
    currentWindSpeed
  );

  return {
    current: {
      location: `${location}, IN`,
      temperature: currentTemp,
      condition,
      humidity: currentHumidity,
      windSpeed: currentWindSpeed,
      feelsLike: currentTemp + 2, // Simple approximation
    },
    forecast,
    alerts,
  };
}

/**
 * Main function to fetch weather data from Open-Meteo API
 */
export async function fetchWeatherDataFromAPI(location: MockLocation): Promise<WeatherData> {
  try {
    // Step 1: Geocode the location
    const coords = await geocodeLocation(location);

    // Step 2: Fetch weather data
    const weatherData = await fetchOpenMeteoData(coords);

    // Step 3: Transform to our format
    const transformedData = transformToWeatherData(weatherData, location);

    return transformedData;
  } catch (error) {
    console.error('Error fetching weather data from API:', error);
    throw error;
  }
}
