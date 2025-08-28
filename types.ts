
export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Thunderstorm' | 'Partly Cloudy';

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

export type AlertType = 'Flood' | 'Earthquake' | 'Avalanche';
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
