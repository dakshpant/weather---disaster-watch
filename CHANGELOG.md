# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- New `AlertType` definitions: `Cyclone`, `Drought`, `Landslide`.
- `CHANGELOG.md` file.
- `ARCHITECTURE.md` file.

### Changed

- Updated `weatherService.ts` to use specific alert types (`Cyclone`, `Drought`, `Landslide`) instead of mapping them to `Flood` or `Heatwave`.
- Updated `stateData` in `weatherService.ts` with aggregated weather data (Rainfall, Temperature, Humidity) for 21 states.
- Fixed syntax error in `HomePage.tsx` (removed markdown code blocks).
- Updated `tsconfig.json` to use `moduleResolution: "bundler"` for better Vite compatibility.

### Fixed

- Type mismatch in `weatherService.ts` where specific hazards were being mapped to incorrect generic alert types.
