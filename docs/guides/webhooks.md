# Webhooks Integration Guide

This guide covers how to integrate with EnvoyOU API webhooks for real-time notifications and event-driven workflows.

## What are Webhooks?

Webhooks are HTTP callbacks that notify your application when specific events occur in the EnvoyOU platform. Instead of polling the API for changes, webhooks push data to your endpoints in real-time.

## Supported Events

### User Events

- `user.created` - New user registration
- `user.updated` - User profile changes
- `user.deleted` - User account deletion
- `user.verified` - Email verification completed

### Authentication Events

- `auth.login` - User login successful
- `auth.logout` - User logout
- `auth.failed` - Failed login attempt
- `auth.password_reset` - Password reset requested

### API Usage Events

- `api.rate_limit_exceeded` - Rate limit threshold reached
- `api.quota_exceeded` - Monthly quota exceeded
- `api.key_expired` - API key expiration

### System Events

- `system.maintenance_start` - Maintenance window begins
- `system.maintenance_end` - Maintenance window ends
- `system.incident` - Service incident reported

## Setting Up Webhooks

### 1. Create Webhook Endpoint

Create an HTTPS endpoint in your application to receive webhook payloads:

```javascript
// Express.js example
app.post('/webhooks/envoyou', express.json(), async (req, res) => {
  try {
    const signature = req.headers['x-envoyou-signature'];
    const timestamp = req.headers['x-envoyou-timestamp'];
    const event = req.body;

    // Verify webhook signature
    if (!verifySignature(req.body, signature, timestamp)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process the event
    await processWebhookEvent(event);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```text

### 2. Register Webhook URL

Register your webhook endpoint through the API or dashboard:

```bash
curl -X POST https://api.envoyou.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/envoyou",
    "events": ["user.created", "user.updated", "auth.login"],
    "secret": "your-webhook-secret",
    "active": true
  }'
```text

### 3. Configure Webhook Settings

```json
{
  "url": "https://your-app.com/webhooks/envoyou",
  "events": [
    "user.created",
    "user.updated",
    "auth.login",
    "api.rate_limit_exceeded"
  ],
  "secret": "whsec_your_webhook_secret_key",
  "active": true,
  "retry_policy": {
    "max_attempts": 5,
    "backoff_multiplier": 2,
    "initial_delay": 1000
  },
  "headers": {
    "X-Custom-Header": "your-custom-value"
  }
}
```text

## Webhook Payload Structure

All webhook payloads follow a consistent structure:

```json
{
  "id": "evt_1234567890",
  "type": "user.created",
  "created": 1640995200,
  "data": {
    "object": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z",
      "status": "active"
    }
  },
  "webhook_id": "wh_1234567890"
}
```text

### Event Types and Payloads

#### User Created Event

```json
{
  "id": "evt_1234567890",
  "type": "user.created",
  "created": 1640995200,
  "data": {
    "object": {
      "id": "user_123",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "email_verified": false,
      "created_at": "2024-01-01T00:00:00Z",
      "metadata": {}
    }
  }
}
```text

#### Authentication Events

```json
{
  "id": "evt_1234567891",
  "type": "auth.login",
  "created": 1640995260,
  "data": {
    "object": {
      "user_id": "user_123",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2024-01-01T00:01:00Z",
      "location": {
        "country": "US",
        "city": "New York"
      }
    }
  }
}
```text

## Security and Verification

### Webhook Signature Verification

Always verify webhook signatures to ensure authenticity:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, timestamp, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${JSON.stringify(payload)}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`v1,${expectedSignature}`)
  );
}

// Usage
const isValid = verifySignature(
  req.body,
  req.headers['x-envoyou-signature'],
  req.headers['x-envoyou-timestamp'],
  process.env.ENVOYOU_WEBHOOK_SECRET
);
```text

#### Python Example

```python
import hmac, hashlib, json, time
from fastapi import FastAPI, Request, Header, HTTPException

app = FastAPI()
WEBHOOK_SECRET = b"your_webhook_secret"
ALLOWED_DRIFT = 300  # 5 minutes

def canonical_json(data):
  return json.dumps(data, separators=(',', ':'), sort_keys=True)

def verify_signature(payload: dict, signature: str, timestamp: str) -> bool:
  try:
    ts = int(timestamp)
  except (TypeError, ValueError):
    return False
  now = int(time.time())
  if abs(now - ts) > ALLOWED_DRIFT:
    return False
  body = f"{timestamp}.".encode() + canonical_json(payload).encode()
  digest = hmac.new(WEBHOOK_SECRET, body, hashlib.sha256).hexdigest()
  expected = f"v1,{digest}"
  try:
    return hmac.compare_digest(signature, expected)
  except Exception:
    return False

@app.post('/webhooks/envoyou')
async def receive(request: Request, x_envoyou_signature: str = Header(None), x_envoyou_timestamp: str = Header(None)):
  payload = await request.json()
  if not verify_signature(payload, x_envoyou_signature, x_envoyou_timestamp):
    raise HTTPException(status_code=401, detail='Invalid signature')
  # enqueue task for async processing here
  return {"received": True}
```text

#### Recommended Validation Steps

- Require all security headers present (signature, timestamp, webhook id, event type).
- Enforce timestamp drift (<= 5 minutes) to mitigate replay.
- (Optional) Include a nonce header (`X-EnvoyOU-Nonce`) and store recently seen nonces (Redis TTL 10m) for replay rejection.
- Reject requests with mismatched `Content-Type` or body reserialization differences.
- Use constant-time comparison for signature strings.

### Security Headers

Webhooks include security headers for verification:

```text
X-EnvoyOU-Signature: v1,signature_here
X-EnvoyOU-Timestamp: 1640995200
X-EnvoyOU-Webhook-ID: wh_1234567890
X-EnvoyOU-Event-Type: user.created
X-EnvoyOU-Nonce: 4f2c7a81-bc2a-4c2f-9a3d-91d7fa2d6c55
```text

## Error Handling and Retries

### Retry Policy

Webhooks are retried with exponential backoff:

- **Attempt 1**: Immediate
- **Attempt 2**: 1 second delay
- **Attempt 3**: 2 seconds delay
- **Attempt 4**: 4 seconds delay
- **Attempt 5**: 8 seconds delay

### Handling Failures

```javascript
async function processWebhookEvent(event) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      switch (event.type) {
        case 'user.created':
          await handleUserCreated(event.data.object);
          break;
        case 'auth.login':
          await handleUserLogin(event.data.object);
          break;
        default:
          console.log('Unhandled event type:', event.type);
      }
      break; // Success, exit retry loop
    } catch (error) {
      console.error(`Webhook processing failed (attempt ${attempt}):`, error);

      if (attempt === maxRetries) {
        // Log permanent failure
        await logWebhookFailure(event, error);
        // Send alert to developers
        await alertDevelopers(event, error);
      } else {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
}
```text

## Best Practices

### 1. Idempotency

Ensure your webhook handlers are idempotent:

```javascript
const processedEvents = new Set();

async function processEvent(event) {
  if (processedEvents.has(event.id)) {
    console.log('Event already processed:', event.id);
    return;
  }

  // Process the event
  await handleEvent(event);

  // Mark as processed
  processedEvents.add(event.id);

  // Persist processed event IDs to database
  await saveProcessedEventId(event.id);
}
```text

### 2. Response Time

Respond quickly to webhook requests:

```javascript
app.post('/webhooks/envoyou', async (req, res) => {
  // Respond immediately
  res.status(200).json({ received: true });

  // Process in background
  setImmediate(() => {
    processWebhookEvent(req.body).catch(error => {
      console.error('Async webhook processing error:', error);
    });
  });
});
```text

### 3. Logging and Monitoring

Implement comprehensive logging:

```javascript
function logWebhookEvent(event, status, error = null) {
  const logData = {
    webhook_id: event.webhook_id,
    event_id: event.id,
    event_type: event.type,
    status: status,
    timestamp: new Date().toISOString(),
    error: error ? {
      message: error.message,
      stack: error.stack
    } : null
  };

  // Send to logging service
  logger.info('Webhook processed', logData);

  // Send metrics
  metrics.increment('webhook_processed', {
    event_type: event.type,
    status: status
  });
}
```text

### 4. Testing Webhooks

Test your webhooks using tools like:

```bash
# Using curl to test webhook endpoint
curl -X POST https://your-app.com/webhooks/envoyou \
  -H "Content-Type: application/json" \
  -H "X-EnvoyOU-Signature: v1,test_signature" \
  -H "X-EnvoyOU-Timestamp: 1640995200" \
  -d '{
    "id": "evt_test",
    "type": "user.created",
    "created": 1640995200,
    "data": {
      "object": {
        "id": "user_test",
        "email": "test@example.com"
      }
    }
  }'
```text

### 5. Webhook Management

#### List Webhooks

```bash
curl -X GET https://api.envoyou.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY"
```text

#### Update Webhook

```bash
curl -X PUT https://api.envoyou.com/v1/webhooks/wh_1234567890 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["user.created", "user.updated", "auth.login", "api.rate_limit_exceeded"],
    "active": true
  }'
```text

#### Delete Webhook

```bash
curl -X DELETE https://api.envoyou.com/v1/webhooks/wh_1234567890 \
  -H "Authorization: Bearer YOUR_API_KEY"
```text

## Common Issues and Solutions

### Signature Verification Fails

- Ensure webhook secret is correct
- Check timestamp is within acceptable range (5 minutes)
- Verify JSON payload formatting

### Webhooks Not Being Delivered

- Confirm endpoint is publicly accessible
- Check firewall and security group settings
- Verify SSL certificate is valid

### Duplicate Events

- Implement idempotency checks
- Store processed event IDs
- Handle out-of-order delivery

### Slow Response Times

- Process webhooks asynchronously
- Optimize database queries
- Implement caching where appropriate

## Monitoring and Analytics

Track webhook performance:

- **Delivery Rate**: Percentage of successful deliveries
- **Response Time**: Average processing time
- **Error Rate**: Failed webhook processing
- **Event Volume**: Events per minute/hour/day

Set up alerts for:

- High error rates
- Delivery failures
- Unusual event volumes
- Processing delays

Webhooks are a powerful way to build event-driven integrations with the EnvoyOU platform. Proper implementation ensures reliable, real-time communication between systems.
