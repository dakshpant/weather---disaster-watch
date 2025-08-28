
import type { WeatherData } from '../types';

export type MockLocation = 'San Francisco' | 'Denver' | 'Miami';

const mockData: Record<MockLocation, WeatherData> = {
  'San Francisco': {
    current: {
      location: 'San Francisco, CA',
      temperature: 18,
      condition: 'Partly Cloudy',
      humidity: 75,
      windSpeed: 25,
      feelsLike: 17,
    },
    forecast: [
      { day: 'Mon', high: 20, low: 14, condition: 'Sunny' },
      { day: 'Tue', high: 21, low: 15, condition: 'Sunny' },
      { day: 'Wed', high: 19, low: 13, condition: 'Cloudy' },
      { day: 'Thu', high: 18, low: 12, condition: 'Rainy' },
      { day: 'Fri', high: 20, low: 14, condition: 'Partly Cloudy' },
    ],
    alerts: [
      {
        id: 'EQSF2024-1',
        type: 'Earthquake',
        severity: 'Warning',
        title: 'Earthquake Warning: 6.8 Magnitude',
        description: 'A significant seismic event has been predicted for the Bay Area. Prepare for strong shaking. Secure heavy items and have an emergency kit ready.',
        area: 'Bay Area Fault Lines',
      },
       {
        id: 'EQSF2024-2',
        type: 'Earthquake',
        severity: 'Advisory',
        title: 'Minor Tremor Advisory',
        description: 'Increased seismic activity detected. Minor tremors possible over the next 48 hours.',
        area: 'Hayward Fault',
      },
    ],
  },
  'Denver': {
    current: {
      location: 'Denver, CO',
      temperature: -2,
      condition: 'Snowy',
      humidity: 85,
      windSpeed: 15,
      feelsLike: -7,
    },
    forecast: [
      { day: 'Mon', high: 0, low: -8, condition: 'Snowy' },
      { day: 'Tue', high: -3, low: -10, condition: 'Snowy' },
      { day: 'Wed', high: 2, low: -5, condition: 'Cloudy' },
      { day: 'Thu', high: 5, low: -2, condition: 'Sunny' },
      { day: 'Fri', high: 4, low: -3, condition: 'Partly Cloudy' },
    ],
    alerts: [
      {
        id: 'AVDEN2024-1',
        type: 'Avalanche',
        severity: 'Warning',
        title: 'High Avalanche Danger',
        description: 'Extreme avalanche danger in the Rocky Mountains backcountry. All travel in avalanche terrain is discouraged. Natural and human-triggered avalanches are very likely.',
        area: 'Rocky Mountains, CO',
      },
    ],
  },
  'Miami': {
    current: {
      location: 'Miami, FL',
      temperature: 28,
      condition: 'Thunderstorm',
      humidity: 92,
      windSpeed: 30,
      feelsLike: 32,
    },
    forecast: [
      { day: 'Mon', high: 29, low: 24, condition: 'Thunderstorm' },
      { day: 'Tue', high: 30, low: 25, condition: 'Rainy' },
      { day: 'Wed', high: 31, low: 26, condition: 'Partly Cloudy' },
      { day: 'Thu', high: 30, low: 25, condition: 'Sunny' },
      { day: 'Fri', high: 29, low: 24, condition: 'Thunderstorm' },
    ],
    alerts: [
      {
        id: 'FLMIA2024-1',
        type: 'Flood',
        severity: 'Watch',
        title: 'Coastal Flood Watch',
        description: 'A tropical storm system is approaching, bringing potential for significant coastal flooding due to storm surge and heavy rainfall. Secure property in low-lying areas.',
        area: 'Miami-Dade County Coastline',
      },
       {
        id: 'FLMIA2024-2',
        type: 'Flood',
        severity: 'Advisory',
        title: 'Urban Flash Flood Advisory',
        description: 'Heavy downpours may lead to localized flash flooding in urban and poor-drainage areas. Avoid driving through flooded roadways.',
        area: 'Urban Miami',
      },
    ],
  },
};

export const fetchWeatherData = (location: MockLocation): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockData[location]) {
        resolve(mockData[location]);
      } else {
        reject(new Error('Location not found'));
      }
    }, 800); // Simulate network delay
  });
};
