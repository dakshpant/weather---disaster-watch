import type { WeatherData, WeatherCondition, AlertType, AlertSeverity } from '../types';

export type MockLocation =
  | 'Andaman and Nicobar Islands'
  | 'Andhra Pradesh'
  | 'Arunachal Pradesh'
  | 'Assam'
  | 'Bihar'
  | 'Chandigarh'
  | 'Chhattisgarh'
  | 'Dadra and Nagar Haveli and Daman and Diu'
  | 'Delhi'
  | 'Goa'
  | 'Gujarat'
  | 'Haryana'
  | 'Himachal Pradesh'
  | 'Jammu and Kashmir'
  | 'Jharkhand'
  | 'Karnataka'
  | 'Kerala'
  | 'Ladakh'
  | 'Lakshadweep'
  | 'Madhya Pradesh'
  | 'Maharashtra'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Odisha'
  | 'Puducherry'
  | 'Punjab'
  | 'Rajasthan'
  | 'Sikkim'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Tripura'
  | 'Uttar Pradesh'
  | 'Uttarakhand'
  | 'West Bengal';

// Helper function to determine weather condition based on rainfall and temperature
const getCondition = (rain: number, temp: number, humidity: number): WeatherCondition => {
  if (rain > 2500) return 'Rainy';
  if (rain > 1500) return 'Cloudy';
  if (temp < 20) return 'Partly Cloudy';
  if (temp > 30 && humidity > 70) return 'Humid';
  if (temp > 30) return 'Sunny';
  return 'Partly Cloudy';
};

// Helper function to map hazard labels to alert types
const getAlertType = (hazard: string): AlertType => {
  if (hazard === 'Flood') return 'Flood';
  if (hazard === 'Heatwave') return 'Heatwave';
  if (hazard === 'Landslide') return 'Landslide';
  if (hazard === 'Cyclone') return 'Cyclone';
  if (hazard === 'Drought') return 'Drought';
  return 'Flood';
};

// Helper function to determine alert severity
const getAlertSeverity = (hazard: string, rain: number, temp: number): AlertSeverity => {
  if (hazard === 'Cyclone' || (hazard === 'Flood' && rain > 2500)) return 'Warning';
  if (hazard === 'Drought' || hazard === 'Heatwave') return 'Advisory';
  if (hazard === 'Landslide') return 'Warning';
  return 'Watch';
};

// Average values calculated from the provided CSV data
const stateData: Record<MockLocation, {
  rain: number;
  temp: number;
  humidity: number;
  coastal: boolean;
  mountainous: boolean;
  hazard: string;
}> = {
  'Andaman and Nicobar Islands': { rain: 3000, temp: 27.0, humidity: 85, coastal: true, mountainous: false, hazard: 'Cyclone' },
  'Andhra Pradesh': { rain: 1107, temp: 30.0, humidity: 74, coastal: true, mountainous: false, hazard: 'Cyclone' },
  'Arunachal Pradesh': { rain: 2800, temp: 20.0, humidity: 75, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Assam': { rain: 2818, temp: 25.9, humidity: 80, coastal: false, mountainous: true, hazard: 'Flood' },
  'Bihar': { rain: 1205, temp: 30.0, humidity: 65, coastal: false, mountainous: false, hazard: 'Flood' },
  'Chandigarh': { rain: 700, temp: 26.0, humidity: 55, coastal: false, mountainous: false, hazard: 'Heatwave' },
  'Chhattisgarh': { rain: 1300, temp: 28.0, humidity: 68, coastal: false, mountainous: false, hazard: 'Flood' },
  'Dadra and Nagar Haveli and Daman and Diu': { rain: 900, temp: 28.0, humidity: 70, coastal: true, mountainous: false, hazard: 'Flood' },
  'Delhi': { rain: 620, temp: 29.1, humidity: 50, coastal: false, mountainous: false, hazard: 'Heatwave' },
  'Goa': { rain: 2900, temp: 27.0, humidity: 80, coastal: true, mountainous: false, hazard: 'Flood' },
  'Gujarat': { rain: 813, temp: 30.0, humidity: 55, coastal: true, mountainous: false, hazard: 'Drought' },
  'Haryana': { rain: 603, temp: 28.0, humidity: 50, coastal: false, mountainous: false, hazard: 'Heatwave' },
  'Himachal Pradesh': { rain: 1240, temp: 18.0, humidity: 60, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Jammu and Kashmir': { rain: 1100, temp: 15.0, humidity: 65, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Jharkhand': { rain: 1292, temp: 27.9, humidity: 69, coastal: false, mountainous: false, hazard: 'Flood' },
  'Karnataka': { rain: 1149, temp: 27.0, humidity: 70, coastal: true, mountainous: false, hazard: 'Flood' },
  'Kerala': { rain: 2924, temp: 28.0, humidity: 81, coastal: true, mountainous: false, hazard: 'Flood' },
  'Ladakh': { rain: 100, temp: 5.0, humidity: 40, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Lakshadweep': { rain: 1600, temp: 28.0, humidity: 80, coastal: true, mountainous: false, hazard: 'Cyclone' },
  'Madhya Pradesh': { rain: 1097, temp: 29.1, humidity: 60, coastal: false, mountainous: false, hazard: 'Heatwave' },
  'Maharashtra': { rain: 1197, temp: 27.9, humidity: 65, coastal: false, mountainous: false, hazard: 'Flood' },
  'Manipur': { rain: 1500, temp: 22.0, humidity: 75, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Meghalaya': { rain: 3500, temp: 20.0, humidity: 85, coastal: false, mountainous: true, hazard: 'Flood' },
  'Mizoram': { rain: 2500, temp: 22.0, humidity: 80, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Nagaland': { rain: 2200, temp: 21.0, humidity: 78, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Odisha': { rain: 1450, temp: 30.0, humidity: 78, coastal: true, mountainous: false, hazard: 'Cyclone' },
  'Puducherry': { rain: 1200, temp: 29.0, humidity: 75, coastal: true, mountainous: false, hazard: 'Cyclone' },
  'Punjab': { rain: 644, temp: 27.0, humidity: 54, coastal: false, mountainous: false, hazard: 'Flood' },
  'Rajasthan': { rain: 554, temp: 32.1, humidity: 45, coastal: false, mountainous: false, hazard: 'Drought' },
  'Sikkim': { rain: 3000, temp: 18.0, humidity: 80, coastal: false, mountainous: true, hazard: 'Landslide' },
  'Tamil Nadu': { rain: 954, temp: 29.9, humidity: 70, coastal: true, mountainous: false, hazard: 'Cyclone' },
  'Telangana': { rain: 905, temp: 29.9, humidity: 54, coastal: false, mountainous: false, hazard: 'Heatwave' },
  'Tripura': { rain: 2100, temp: 24.0, humidity: 78, coastal: false, mountainous: false, hazard: 'Flood' },
  'Uttar Pradesh': { rain: 993, temp: 29.0, humidity: 54, coastal: false, mountainous: false, hazard: 'Heatwave' },
  'Uttarakhand': { rain: 1535, temp: 20.0, humidity: 64, coastal: false, mountainous: true, hazard: 'Landslide' },
  'West Bengal': { rain: 1736, temp: 29.0, humidity: 78, coastal: true, mountainous: false, hazard: 'Flood' },
};

export const AVAILABLE_LOCATIONS = Object.keys(stateData) as MockLocation[];

const mockData: Record<MockLocation, WeatherData> = Object.entries(stateData).reduce((acc, [state, data]) => {
  const location = state as MockLocation;
  const temp = Math.round(data.temp);
  const condition = getCondition(data.rain, data.temp, data.humidity);
  const alertType = getAlertType(data.hazard);
  const severity = getAlertSeverity(data.hazard, data.rain, data.temp);

  // Generate forecast based on current conditions
  const forecast = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => ({
    day,
    high: temp + 2,
    low: temp - 5,
    condition: i % 2 === 0 ? condition : 'Partly Cloudy' as WeatherCondition,
  }));

  // Generate alert description
  let alertTitle = '';
  let alertDescription = '';
  let affectedArea = location;

  switch (data.hazard) {
    case 'Flood':
      alertTitle = 'Flood Warning';
      alertDescription = `Heavy rainfall expected. Average annual rainfall: ${data.rain}mm. Stay alert for flooding in low-lying areas.`;
      break;
    case 'Cyclone':
      alertTitle = 'Cyclone Alert';
      alertDescription = `Cyclonic conditions possible in coastal areas. High humidity (${data.humidity}%) and strong winds expected.`;
      break;
    case 'Heatwave':
      alertTitle = 'Heatwave Advisory';
      alertDescription = `Extreme temperatures (${temp}°C+) expected. Stay hydrated and avoid outdoor activities during peak hours.`;
      break;
    case 'Drought':
      alertTitle = 'Drought Conditions';
      alertDescription = `Low rainfall (${data.rain}mm annually). Water conservation measures advised.`;
      break;
    case 'Landslide':
      alertTitle = 'Landslide Risk';
      alertDescription = `Mountainous terrain with ${data.rain}mm annual rainfall. Risk of landslides during monsoon. Avoid hilly routes.`;
      break;
  }

  acc[location] = {
    current: {
      location: `${location}, IN`,
      temperature: temp,
      condition,
      humidity: data.humidity,
      windSpeed: 15,
      feelsLike: temp + 2,
    },
    forecast,
    alerts: [
      {
        id: `${location.substring(0, 3).toUpperCase()}2024-1`,
        type: alertType,
        severity,
        title: alertTitle,
        description: alertDescription,
        area: affectedArea,
      },
    ],
  };

  return acc;
}, {} as Record<MockLocation, WeatherData>);

// Import API service and config
import { USE_MOCK_DATA } from './apiConfig';
import { fetchWeatherDataFromAPI } from './openMeteoService';

/**
 * Fetch weather data - delegates to mock or API based on configuration
 */
export const fetchWeatherData = async (location: MockLocation): Promise<WeatherData> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockData[location]) {
          resolve(mockData[location]);
        } else {
          reject(new Error('Location not found'));
        }
      }, 800);
    });
  } else {
    // Use API data
    try {
      return await fetchWeatherDataFromAPI(location);
    } catch (error) {
      console.error('API fetch failed, falling back to mock data:', error);
      // Fallback to mock data if API fails
      if (mockData[location]) {
        return mockData[location];
      }
      throw new Error('Location not found and API unavailable');
    }
  }
};