# Error Handling Guide

This guide covers common errors you might encounter when using the EnvoyOU API and how to handle them effectively.

## Common HTTP Status Codes

### 4xx Client Errors

#### 400 Bad Request
**Cause**: Invalid or missing parameters in your request.
**Solution**:
- Check all required parameters are included
- Verify parameter types match API specifications
- Ensure JSON payload is properly formatted

#### 401 Unauthorized
**Cause**: Invalid, expired, or missing authentication credentials.
**Solution**:
- Verify your API key is correct and active
- Check JWT token hasn't expired
- Ensure proper `Authorization: Bearer <token>` header format

#### 403 Forbidden
**Cause**: Access denied due to insufficient permissions or unverified account.
**Solution**:
- Verify your email address is confirmed
- Check your account has appropriate permissions
- Contact support if you believe this is an error

#### 404 Not Found
**Cause**: The requested endpoint or resource doesn't exist.
**Solution**:
- Verify the endpoint URL is correct
- Check HTTP method (GET, POST, etc.) matches the API
- Ensure resource IDs are valid

#### 429 Too Many Requests
**Cause**: Rate limit exceeded for your account tier.
**Solution**:
- Implement exponential backoff retry logic
- Upgrade to a higher tier for increased limits
- Check rate limit headers in responses

### 5xx Server Errors

#### 500 Internal Server Error
**Cause**: Unexpected server-side error.
**Solution**:
- Retry the request after a short delay
- Check API status page for outages
- Contact support if error persists

## Error Response Format

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {
      "field": "specific_field_name",
      "issue": "detailed explanation"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "request_id": "unique-request-identifier"
}
```text

## Best Practices for Error Handling

### 1. Implement Proper Retry Logic

```javascript
async function apiRequest(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Handle other errors
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error.message}`);

    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff for network errors
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```text

### 2. Log Errors Appropriately

```javascript
function handleApiError(error, context) {
  console.error('API Error:', {
    error: error.message,
    context: context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });

  // Send to error tracking service
  errorTrackingService.captureException(error, {
    tags: { api_error: true },
    extra: context
  });
}
```text

### 3. Provide User-Friendly Messages

```javascript
function getUserFriendlyErrorMessage(statusCode, errorCode) {
  const errorMessages = {
    400: 'Please check your input and try again.',
    401: 'Your session has expired. Please log in again.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'Something went wrong on our end. Please try again later.'
  };

  return errorMessages[statusCode] || 'An unexpected error occurred. Please try again.';
}
```text

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Free Tier**: 100 requests per hour
- **Basic Tier**: 1,000 requests per hour
- **Pro Tier**: 10,000 requests per hour
- **Enterprise Tier**: Custom limits

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests per hour
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the limit resets (Unix timestamp)

## Monitoring and Alerts

Set up monitoring for:
- Increased error rates
- Rate limit hits
- Authentication failures
- Slow response times

Consider implementing health checks to monitor API availability.