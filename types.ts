export type WeatherCondition =
  | 'Sunny'
  | 'Cloudy'
  | 'Rainy'
  | 'Snowy'
  | 'Thunderstorm'
  | 'Partly Cloudy'
  | 'Humid' // Added for Mumbai
  | 'Snowfall'
  | 'Foggy'; // Added for Mumbai

export interface CurrentWeather {
  location: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export interface Forecast {
  day: string;
  high: number;
  low: number;
  condition: WeatherCondition;
}

export type AlertType = 'Flood' | 'Earthquake' | 'Avalanche' | 'Heatwave' | 'Cyclone' | 'Drought' | 'Landslide';

export type AlertSeverity = 'Watch' | 'Warning' | 'Advisory';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  area: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: Forecast[];
  alerts: Alert[];
}

// API-related types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface OpenMeteoCurrentData {
  time: string;
  temperature_2m: number;
  relativehumidity_2m: number;
  precipitation: number;
  windspeed_10m: number;
  weathercode: number;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  precipitation: number[];
  windspeed_10m: number[];
  weathercode: number[];
}

export interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current?: OpenMeteoCurrentData;
  hourly?: OpenMeteoHourly;
  daily?: OpenMeteoDaily;
}

