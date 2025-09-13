# Data Model Overview

This section describes the core data entities exposed by the EnvoyOU API.

## Core Entities
| Entity | Description |
|--------|-------------|
| Station | Physical sensor location collecting measurements. |
| Measurement | A single pollutant or weather observation with timestamp. |
| Region | Geographic grouping (city, province, country). |
| Pollutant | Defined contaminant type (PM2.5, PM10, NO2, etc.). |

## Conventions
- All timestamps are ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`).
- Numeric concentrations use SI units unless specified.
- Pagination uses `page` and `limit`.

## Example Measurement Object
```json
{
  "station_id": "STN_9823",
  "pollutant": "pm25",
  "value": 43.2,
  "unit": "µg/m³",
  "captured_at": "2025-09-13T07:15:00Z",
  "city": "Jakarta",
  "quality_index": 112
}
```text

## Next Topics
- Field reference (coming soon)
- Units & Normalization
