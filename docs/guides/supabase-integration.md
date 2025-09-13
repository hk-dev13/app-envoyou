# Supabase Integration Guide

This guide shows how to pair EnvoyOU API data with Supabase for storage, auth, and real-time features.

## Use Cases
- Persist selected measurements for historical analytics.
- Combine user control (Supabase Auth) with API key access policies.
- Trigger edge functions on new environmental data.

## Architecture Overview
```text
EnvoyOU API --> Worker/CRON --> Supabase (tables, auth, functions) --> Dashboard
```text

## Table Schema Example
```sql
create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  station_id text not null,
  pollutant text not null,
  value numeric not null,
  unit text not null,
  captured_at timestamptz not null,
  inserted_at timestamptz default now()
);
create index on measurements (captured_at);
```text

## Fetch + Store Script (Node)
```javascript
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ENVOYOU_KEY = process.env.ENVOYOU_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncLatest() {
  const r = await fetch('https://api.envoyou.com/v1/measurements?limit=50', {
    headers: { Authorization: `Bearer ${ENVOYOU_KEY}` }
  });
  const data = await r.json();
  const rows = data.items.map(m => ({
    station_id: m.station_id,
    pollutant: m.pollutant,
    value: m.value,
    unit: m.unit,
    captured_at: m.captured_at
  }));
  const { error } = await supabase.from('measurements').upsert(rows, { onConflict: 'station_id,captured_at,pollutant' });
  if (error) console.error(error);
}

syncLatest();
```text

## Security Notes
- Use service role key only in secure server environment (not frontend).
- Rotate EnvoyOU API keys quarterly.

## Next Steps
- Add CRON (GitHub Actions / Supabase Scheduled Functions)
- Build dashboard queries (materialized views)
