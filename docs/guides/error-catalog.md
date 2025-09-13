# API Error Catalog

Centralized reference of standardized error responses exposed by the EnvoyOU API.

## Error Envelope Conventions

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Stable machine-readable code (snake_case). |
| `message` | string | Human friendly description; not for parsing. |
| `status` | integer | HTTP status code mirrored for convenience. |
| `request_id` | string | Correlates with `X-Request-ID` header. |
| `fields` | array | (Validation only) Field-level issues. |

All errors also include the tracing header `X-Request-ID` and (when rate limiting) rate headers.

## Standard Error Schemas

### Generic Error (`ErrorResponse`)

```json
{
  "error": "invalid_request",
  "message": "Invalid metric parameter",
  "request_id": "req_8f3a92",
  "status": 400
}
```text

### Validation Error (`ValidationError`)

```json
{
  "error": "validation_error",
  "message": "One or more fields failed validation",
  "status": 400,
  "fields": [
    { "field": "company_ids[2]", "issue": "must be a valid UUID" }
  ],
  "request_id": "req_5310de"
}
```text

### Rate Limit Exceeded (`TooManyRequestsError`)

Returned with HTTP `429` when quota is exhausted.

Headers:

```text
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1731532800
X-RateLimit-Retry-After: 42
X-Request-ID: req_912ab3
```text

Example body (shares `ErrorResponse` schema):

```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Retry after 42 seconds.",
  "status": 429,
  "request_id": "req_912ab3"
}
```text

## Error Response Components

| Component | HTTP | Description | Schema |
|-----------|------|-------------|--------|
| `UnauthorizedError` | 401 | Missing/invalid API key or token | `ErrorResponse` |
| `NotFoundError` | 404 | Resource not found | `ErrorResponse` |
| `ValidationErrorResponse` | 400 | Input validation failed | `ValidationError` |
| `TooManyRequestsError` | 429 | Rate limit exceeded | `ErrorResponse` |

## Field-Level Validation Strategy

- Validate all inputs server-side; never rely solely on client checks.
- Aggregate all field errors into a single `ValidationError` response when practical.
- Use stable field paths (array indices, dot or bracket notation) to aid client mapping.

## Client Handling Patterns

### 1. Unified Error Parser (TypeScript)

```ts
interface BaseError { error: string; message: string; status?: number; request_id?: string; }
interface ValidationIssue { field: string; issue: string; }
interface ValidationError extends BaseError { fields?: ValidationIssue[]; }

function parseError(res: Response, body: any): ValidationError | BaseError {
  return body && body.error ? body : { error: 'unknown_error', message: `HTTP ${res.status}`, status: res.status };
}
```text

### 2. Retry Logic (429)

```ts
if (err.error === 'rate_limit_exceeded') {
  const retryAfter = Number(response.headers.get('X-RateLimit-Retry-After')) || 5;
  await new Promise(r => setTimeout(r, retryAfter * 1000));
  // retry request...
}
```text

### 3. Validation Rendering

```ts
for (const issue of (err.fields || [])) {
  highlightField(issue.field, issue.issue);
}
```text

## Evolution & Extension

When adding a new error type:

1. Prefer extending existing schemas unless a fundamentally different structure is needed.
2. Add a reusable response component if widely reused (e.g., authentication, throttling).
3. Update this catalog & OpenAPI examples.

## Related Documents

- Rate Limiting: `guides/rate-limiting.md`
- Observability & Tracing (forthcoming)
