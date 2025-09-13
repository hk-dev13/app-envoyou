# Rate Limiting Guide

This guide explains how rate limiting works in the EnvoyOU API and best practices for handling rate limits effectively.

## Rate Limit Tiers

The API implements different rate limits based on your subscription tier:

| Tier | Requests per Hour | Requests per Minute | Burst Limit |
|------|------------------|-------------------|-------------|
| Free | 100 | 10 | 20 |
| Basic | 1,000 | 100 | 200 |
| Pro | 10,000 | 1,000 | 2,000 |
| Enterprise | Custom | Custom | Custom |

## Rate Limit & Observability Headers

Each API response includes rate limit and tracing headers. List endpoints also return pagination headers when more results exist.

```text
X-RateLimit-Limit: 1000               # Max requests in current window
X-RateLimit-Remaining: 999            # Remaining requests before throttling
X-RateLimit-Reset: 1640995200         # Unix epoch seconds when window resets
X-RateLimit-Retry-After: 3600         # Seconds until retry (429 responses only)
X-Request-ID: req_8f3a92              # Unique request correlation ID
X-Pagination-Limit: 50                # Effective page size (list endpoints)
X-Pagination-Next: eyJvZmZzZXQiOjE1MH0  # Opaque cursor for next page (if present)
```text

### Header Reference

| Header | Purpose | Notes |
|--------|---------|-------|
| `X-RateLimit-Limit` | Quota ceiling for your tier/window | May be contract-specific for Enterprise |
| `X-RateLimit-Remaining` | Calls left before 429 | At 0 the next call is throttled |
| `X-RateLimit-Reset` | Absolute reset time (epoch seconds) | Prefer over guessing retry intervals |
| `X-RateLimit-Retry-After` | Retry delay in seconds | Only appears on 429 responses |
| `X-Request-ID` | Trace/log correlation ID | Provide when opening support tickets |
| `X-Pagination-Limit` | Effective per-page limit | May be lower than requested if capped |
| `X-Pagination-Next` | Cursor for next page | Omitted when no more pages |

All headers are defined once in the OpenAPI spec (`components.headers`) and reused via `$ref` to ensure consistency across endpoints.

## Understanding Rate Limiting

### Sliding Window Algorithm

The API uses a sliding window algorithm that tracks requests over a rolling time period. This provides more fairness compared to fixed time windows.

### Burst Handling

Each tier includes a burst allowance that allows temporary spikes in traffic beyond the sustained rate limit.

## Best Practices

### 1. Implement Exponential Backoff

```javascript
class RateLimitHandler {
  constructor() {
    this.baseDelay = 1000; // 1 second
    this.maxDelay = 300000; // 5 minutes
    this.backoffFactor = 2;
  }

  async handle429(response) {
    const retryAfter = response.headers.get('X-RateLimit-Retry-After');
    const delay = retryAfter
      ? parseInt(retryAfter) * 1000
      : Math.min(this.baseDelay * Math.pow(this.backoffFactor, this.attempts), this.maxDelay);

    console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
```text

### 2. Monitor Rate Limit Usage

```javascript
class ApiClient {
  constructor() {
    this.rateLimitInfo = {
      limit: null,
      remaining: null,
      reset: null
    };
  }

  updateRateLimitInfo(headers) {
    this.rateLimitInfo = {
      limit: parseInt(headers.get('X-RateLimit-Limit')),
      remaining: parseInt(headers.get('X-RateLimit-Remaining')),
      reset: parseInt(headers.get('X-RateLimit-Reset'))
    };

    // Log warning when approaching limit
    if (this.rateLimitInfo.remaining < this.rateLimitInfo.limit * 0.1) {
      console.warn('Approaching rate limit:', this.rateLimitInfo);
    }
  }

  async request(url, options) {
    const response = await fetch(url, options);
    this.updateRateLimitInfo(response.headers);

    if (response.status === 429) {
      await this.handleRateLimit(response);
      return this.request(url, options); // Retry
    }

    return response;
  }
}
```text

### 3. Implement Request Queuing

```javascript
class RequestQueue {
  constructor(rateLimitPerSecond = 10) {
    this.queue = [];
    this.processing = false;
    this.rateLimit = rateLimitPerSecond;
    this.lastRequestTime = 0;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minInterval = 1000 / this.rateLimit;

      if (timeSinceLastRequest < minInterval) {
        await new Promise(resolve =>
          setTimeout(resolve, minInterval - timeSinceLastRequest)
        );
      }

      const { request, resolve, reject } = this.queue.shift();
      this.lastRequestTime = Date.now();

      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}
```text

### 4. Use Request Batching

For operations that support it, batch multiple requests into a single API call:

```javascript
// Instead of multiple individual requests:
const user1 = await api.getUser(1);
const user2 = await api.getUser(2);
const user3 = await api.getUser(3);

// Use batch endpoint:
const users = await api.getUsers([1, 2, 3]);
```text

## Rate Limit Exceeded Response

When you exceed the rate limit, you'll receive:

**Status Code**: `429 Too Many Requests`

**Response Body**:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "reset": 1640995200,
      "retry_after": 3600
    }
  }
}
```text

## Upgrading Your Plan

If you're consistently hitting rate limits, consider upgrading:

1. **Basic Tier**: 10x the free tier limits
2. **Pro Tier**: 100x the free tier limits
3. **Enterprise Tier**: Custom limits based on your needs

Contact our sales team for enterprise pricing and custom rate limits.

## Monitoring Rate Limits

### Dashboard Metrics

Monitor your API usage through the developer dashboard:

- Current usage vs. limits
- Historical usage patterns
- Rate limit violations
- Projected usage

### Alerts

Set up alerts for:

- 80% of rate limit reached
- Rate limit exceeded
- Consistent high usage patterns

### Logging

Log rate limit information for analysis:

```javascript
function logRateLimitInfo(headers, requestContext) {
  const rateLimitData = {
    limit: headers.get('X-RateLimit-Limit'),
    remaining: headers.get('X-RateLimit-Remaining'),
    reset: parseInt(headers.get('X-RateLimit-Reset')), // epoch seconds
    request_id: headers.get('X-Request-ID'),
    pagination_limit: headers.get('X-Pagination-Limit'),
    pagination_next: headers.get('X-Pagination-Next'),
    timestamp: new Date().toISOString(),
    endpoint: requestContext.endpoint,
    method: requestContext.method,
    user_id: requestContext.userId
  };

  analytics.track('api_rate_limit', rateLimitData);
}
```text

## Common Rate Limiting Mistakes

### 1. Not Handling 429 Responses

Many developers don't properly handle rate limit responses, leading to failed requests.

### 2. Hammering the API

Making requests as fast as possible without respecting rate limits.

### 3. Not Monitoring Usage

Not tracking your API usage can lead to unexpected rate limit hits.

### 4. Ignoring Retry-After Headers

The `Retry-After` header provides the exact time to wait before retrying.

## Testing Rate Limits

### Development Environment

Use the development environment to test rate limiting behavior without affecting production limits.

### Load Testing

When load testing, ensure your tests respect rate limits:

```javascript
// Example load test with rate limiting
async function loadTest(apiEndpoint, totalRequests = 1000, concurrent = 10) {
  const queue = new RequestQueue(10); // 10 requests per second

  const results = [];
  for (let i = 0; i < totalRequests; i++) {
    queue.add(() => apiCall(apiEndpoint))
      .then(result => results.push(result))
      .catch(error => {
        if (error.status === 429) {
          console.log('Rate limited during test');
        }
        results.push(error);
      });
  }

  await queue.waitForCompletion();
  return results;
}
```text

Remember: Rate limiting is designed to protect the API and ensure fair access for all users. Proper implementation will result in more reliable integrations.
