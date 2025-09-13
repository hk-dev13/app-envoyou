# Observability & Tracing

This guide explains how to correlate API calls with logs, metrics, and traces for effective debugging and SLO tracking.

## Core Concepts

| Aspect | Purpose | Primary Mechanisms |
|--------|---------|--------------------|
| Correlation | Tie client request to server logs | `X-Request-ID` header |
| Latency | Measure end-to-end performance | Client timers + server APM |
| Rate Usage | Track quota consumption | `X-RateLimit-*` headers |
| Pagination State | Preserve traversal position | `X-Pagination-Next` cursor |
| Error Diagnostics | Rapid triage | Standardized error envelope + request ID |

## Request Correlation

Each response includes `X-Request-ID` (also present inside error bodies). Always log this value client-side:

```ts
function logWithRequestId(response: Response) {
  const reqId = response.headers.get('X-Request-ID');
  performance.mark(`api:end:${reqId}`);
  console.debug('[api]', { requestId: reqId, status: response.status });
}
```

When opening a support ticket, include:

- `X-Request-ID`
- HTTP method & path
- Timestamp (UTC)
- Minimal reproduction inputs

## Client Instrumentation Pattern

```ts
async function instrumentedFetch(url: string, init?: RequestInit) {
  const start = performance.now();
  const res = await fetch(url, init);
  const reqId = res.headers.get('X-Request-ID');
  const durationMs = performance.now() - start;
  metrics.emit('api_request_duration_ms', durationMs, {
    path: new URL(url, location.origin).pathname,
    status: res.status,
    request_id: reqId
  });
  return res;
}
```

## Recommended Metrics

| Metric | Type | Tags | Description |
|--------|------|------|-------------|
| `api_request_duration_ms` | histogram | `path`, `status` | End-to-end latency |
| `api_requests_total` | counter | `path`, `status` | Call volume |
| `api_rate_limited_total` | counter | `path` | Count of 429 responses |
| `api_validation_errors_total` | counter | `field` (optional) | Validation failure frequency |
| `api_pagination_page_size` | histogram | `path` | Observed page sizes |

## Handling 429s Observably

```ts
if (response.status === 429) {
  metrics.emit('api_rate_limited_total', 1, { path });
  const retry = Number(response.headers.get('X-RateLimit-Retry-After')) || 1;
  await wait(retry * 1000);
}
```

## Tracing Integration (Example: OpenTelemetry)

```ts
import { trace } from '@opentelemetry/api';
const tracer = trace.getTracer('envoyou-client');

async function tracedCall(url: string, init?: RequestInit) {
  return tracer.startActiveSpan('http.fetch', async span => {
    span.setAttribute('http.url', url);
    span.setAttribute('http.method', init?.method || 'GET');
    try {
      const res = await fetch(url, init);
      span.setAttribute('http.status_code', res.status);
      span.setAttribute('request.id', res.headers.get('X-Request-ID'));
      span.end();
      return res;
    } catch (e) {
      span.recordException(e as Error);
      span.setStatus({ code: 2, message: 'fetch error' });
      span.end();
      throw e;
    }
  });
}
```

## Log Structure Recommendation

| Field | Example | Notes |
|-------|---------|-------|
| `timestamp` | 2025-09-13T10:33:11Z | ISO8601 UTC |
| `level` | info | Trace level gating |
| `request_id` | req_8f3a92 | Correlation key |
| `path` | /v1/measurements | Normalized path template if possible |
| `status` | 200 | HTTP status |
| `duration_ms` | 123.4 | Client or server timing |
| `rate_remaining` | 842 | From header |
| `error` | validation_error | Only on failure |

Consistent structured logs + standardized headers enable rapid root cause isolation and capacity planning.

## Related Documents

- Error Catalog: `guides/error-catalog.md`
- Rate Limiting: `guides/rate-limiting.md`
- Pagination: `guides/pagination.md`
