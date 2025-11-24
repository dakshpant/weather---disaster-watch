# Architecture Documentation

## File Structure

```mermaid
graph TD
    Root["/"]
    Root --> Src["src"]
    Root --> Public["public"]

    Src --> Components["components"]
    Src --> Pages["pages"]
    Src --> Services["services"]
    Src --> Types["types.ts"]
    Src --> App["App.tsx"]
    Src --> Main["main.tsx"]

    Components --> Navbar["Navbar.tsx"]
    Components --> Layout["Layout.tsx"]
    Components --> Hero["Hero.tsx"]

    Pages --> HomePage["HomePage.tsx"]

    Services --> WeatherService["weatherService.ts"]
```

## Call Flow: Weather Data Fetching

```mermaid
sequenceDiagram
    participant User
    participant HomePage
    participant WeatherService
    participant API

    User->>HomePage: Visits Home Page
    HomePage->>WeatherService: fetchWeatherData(location)

    alt Mock Data Available
        WeatherService-->>HomePage: Returns Mock Data (Immediate)
    else API Call (Future)
        WeatherService->>API: GET /weather?q=location
        API-->>WeatherService: JSON Response
        WeatherService-->>HomePage: Returns WeatherData
    end

    HomePage->>User: Displays Weather & Alerts
```

## Data Flow

1.  **User Interaction**: User selects a location or lands on the home page.
2.  **Service Call**: Component calls `weatherService.fetchWeatherData(location)`.
3.  **Data Retrieval**: Service checks `stateData` (mock data) for the location.
4.  **Transformation**: Raw data (rain, temp, hazard) is transformed into `WeatherData` object with `CurrentWeather`, `Forecast`, and `Alert` objects.
5.  **Rendering**: Components receive `WeatherData` and render the UI.
