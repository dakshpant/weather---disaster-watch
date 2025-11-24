# Quick Reference: Switching Between Mock and API Data

## Current Configuration

**Data Source**: Live API (Open-Meteo)  
**File**: `services/apiConfig.ts`

---

## How to Switch Data Sources

### Option 1: Use Live API Data (Current Setting)

```typescript
// In services/apiConfig.ts
export const USE_MOCK_DATA = false;
```

**What happens**:

- ✅ Real-time weather data from Open-Meteo
- ✅ Dynamic alert generation based on actual conditions
- ✅ Live 7-day forecasts
- ✅ Automatic fallback to mock data if API fails

**Best for**: Production, live demos, real-world testing

---

### Option 2: Use Mock Data

```typescript
// In services/apiConfig.ts
export const USE_MOCK_DATA = true;
```

**What happens**:

- ✅ Instant loading (no API calls)
- ✅ Pre-defined weather scenarios
- ✅ Consistent data for testing
- ✅ Works offline

**Best for**: Development, UI testing, offline work

---

## Quick Toggle Steps

1. Open `services/apiConfig.ts`
2. Find line 3: `export const USE_MOCK_DATA = ...`
3. Change to `true` or `false`
4. Save the file
5. Refresh your browser

---

## Alert Threshold Customization

Edit `ALERT_THRESHOLDS` in `services/apiConfig.ts`:

```typescript
export const ALERT_THRESHOLDS = {
  flood: {
    precipitation24h: 50, // mm in 24 hours
    humidity: 85, // percentage
  },
  heatwave: {
    temperature: 35, // °C
  },
  cyclone: {
    windSpeed: 60, // km/h
    precipitation: 30, // mm
  },
  drought: {
    precipitation7days: 5, // mm in 7 days
    temperature: 30, // °C
  },
  landslide: {
    precipitation24h: 100, // mm in 24 hours
  },
};
```

---

## Files You May Need to Edit

| File                           | Purpose                               | When to Edit                    |
| ------------------------------ | ------------------------------------- | ------------------------------- |
| `services/apiConfig.ts`        | Toggle data source, adjust thresholds | Switching modes, tuning alerts  |
| `services/openMeteoService.ts` | API logic, alert generation           | Changing API behavior           |
| `services/weatherService.ts`   | Mock data definitions                 | Adding/modifying mock scenarios |

---

## Verification

After switching, verify by:

1. Selecting a state (e.g., Kerala)
2. Checking browser console for logs:
   - Mock mode: No API calls
   - API mode: See geocoding and weather fetch logs
3. Observing load time:
   - Mock mode: Instant
   - API mode: 1-2 seconds

---

## Troubleshooting

**Problem**: Data not updating after switch  
**Solution**: Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**Problem**: API errors in console  
**Solution**: Check internet connection, or switch to mock mode temporarily

**Problem**: No alerts showing  
**Solution**: Check if weather conditions meet thresholds in `apiConfig.ts`
