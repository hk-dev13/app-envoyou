# SDK and Libraries Guide

This guide covers the official and community SDKs available for integrating with the EnvoyOU API, along with best practices for library usage.

## Official SDKs

### JavaScript/TypeScript SDK

The official EnvoyOU JavaScript SDK provides a complete, type-safe interface for the API.

#### Installation

```bash
npm install @envoyou/sdk
# or
yarn add @envoyou/sdk
```text

#### Basic Usage

```javascript
import { EnvoyOUClient } from '@envoyou/sdk';

const client = new EnvoyOUClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.envoyou.com/v1'
});

// Authenticate user
const authResponse = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Get user profile
const user = await client.users.getCurrentUser();

// Update user profile
const updatedUser = await client.users.update({
  name: 'New Name',
  metadata: { customField: 'value' }
});
```text

#### Advanced Configuration

```javascript
const client = new EnvoyOUClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.envoyou.com/v1',
  timeout: 30000,
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    retryableErrors: [429, 500, 502, 503, 504]
  },
  rateLimitConfig: {
    requestsPerSecond: 10,
    burstLimit: 20
  }
});
```text

### Python SDK

Official Python SDK with async support and comprehensive error handling.

#### Installation

```bash
pip install envoyou-sdk
```text

#### Basic Usage

```python
from envoyou import EnvoyOUClient

client = EnvoyOUClient(api_key='your-api-key')

# Authenticate user
auth_response = client.auth.login(
    email='user@example.com',
    password='password'
)

# Get user profile
user = client.users.get_current_user()

# Update user profile
updated_user = client.users.update(
    name='New Name',
    metadata={'custom_field': 'value'}
)
```text

#### Async Usage

```python
import asyncio
from envoyou import AsyncEnvoyOUClient

async def main():
    client = AsyncEnvoyOUClient(api_key='your-api-key')

    # Authenticate user
    auth_response = await client.auth.login(
        email='user@example.com',
        password='password'
    )

    # Get user profile
    user = await client.users.get_current_user()

asyncio.run(main())
```text

### Go SDK

High-performance Go SDK optimized for concurrent requests.

#### Installation

```bash
go get github.com/envoyou/go-sdk
```text

#### Basic Usage

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/envoyou/go-sdk/envoyou"
)

func main() {
    client := envoyou.NewClient(&envoyou.Config{
        APIKey: "your-api-key",
        BaseURL: "https://api.envoyou.com/v1",
    })

    // Authenticate user
    authResp, err := client.Auth.Login(context.Background(), &envoyou.LoginRequest{
        Email:    "user@example.com",
        Password: "password",
    })
    if err != nil {
        log.Fatal(err)
    }

    // Get user profile
    user, err := client.Users.GetCurrentUser(context.Background())
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("User: %+v\n", user)
}
```text

## Community SDKs

### PHP SDK

```bash
composer require envoyou/php-sdk
```text

```php
use EnvoyOU\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'base_url' => 'https://api.envoyou.com/v1'
]);

// Authenticate user
$authResponse = $client->auth()->login([
    'email' => 'user@example.com',
    'password' => 'password'
]);

// Get user profile
$user = $client->users()->getCurrentUser();
```text

### Ruby SDK

```ruby
# Gemfile
gem 'envoyou-sdk'

# Usage
require 'envoyou'

client = EnvoyOU::Client.new(api_key: 'your-api-key')

# Authenticate user
auth_response = client.auth.login(
  email: 'user@example.com',
  password: 'password'
)

# Get user profile
user = client.users.get_current_user
```text

### .NET SDK

```csharp
using EnvoyOU;

// Install via NuGet: Install-Package EnvoyOU.SDK

var client = new EnvoyOUClient(new EnvoyOUConfig
{
    ApiKey = "your-api-key",
    BaseUrl = "https://api.envoyou.com/v1"
});

// Authenticate user
var authResponse = await client.Auth.LoginAsync(new LoginRequest
{
    Email = "user@example.com",
    Password = "password"
});

// Get user profile
var user = await client.Users.GetCurrentUserAsync();
```text

## HTTP Client Libraries

For languages without official SDKs, use standard HTTP clients with proper authentication.

### cURL Examples

#### Authentication
```bash
# Login
curl -X POST https://api.envoyou.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get user profile (using API key)
curl -X GET https://api.envoyou.com/v1/users/me \
  -H "Authorization: Bearer YOUR_API_KEY"
```text

### Python Requests

```python
import requests

class EnvoyOUAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.envoyou.com/v1'
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def login(self, email, password):
        response = self.session.post(f'{self.base_url}/auth/login', json={
            'email': email,
            'password': password
        })
        return response.json()

    def get_user(self, user_id=None):
        endpoint = f'{self.base_url}/users/me' if user_id is None else f'{self.base_url}/users/{user_id}'
        response = self.session.get(endpoint)
        return response.json()

# Usage
api = EnvoyOUAPI('your-api-key')
user = api.get_user()
```text

### JavaScript Fetch

```javascript
class EnvoyOUAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.envoyou.com/v1';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getUser(userId = null) {
    const endpoint = userId ? `/users/${userId}` : '/users/me';
    return this.request(endpoint);
  }
}

// Usage
const api = new EnvoyOUAPI('your-api-key');
const user = await api.getUser();
```text

## Best Practices

### 1. Error Handling

```javascript
// SDK with built-in error handling
try {
  const user = await client.users.get('invalid-id');
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('User not found');
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log('Rate limit exceeded, retrying...');
    await delay(error.retryAfter);
    return client.users.get('invalid-id');
  } else {
    throw error;
  }
}
```text

### 2. Rate Limiting

```python
from envoyou import EnvoyOUClient
import time

client = EnvoyOUClient(
    api_key='your-api-key',
    rate_limit_requests_per_second=10
)

# SDK handles rate limiting automatically
users = []
for user_id in user_ids:
    try:
        user = client.users.get(user_id)
        users.append(user)
    except RateLimitError as e:
        time.sleep(e.retry_after)
        user = client.users.get(user_id)
        users.append(user)
```text

### 3. Connection Pooling

```go
// Go SDK with connection pooling
client := envoyou.NewClient(&envoyou.Config{
    APIKey: "your-api-key",
    HTTPClient: &http.Client{
        Transport: &http.Transport{
            MaxIdleConns:        100,
            MaxIdleConnsPerHost: 10,
            IdleConnTimeout:     90 * time.Second,
        },
        Timeout: 30 * time.Second,
    },
})
```text

### 4. Logging and Monitoring

```javascript
// Enable detailed logging
const client = new EnvoyOUClient({
  apiKey: 'your-api-key',
  logger: {
    debug: (message, meta) => console.debug(message, meta),
    info: (message, meta) => console.info(message, meta),
    warn: (message, meta) => console.warn(message, meta),
    error: (message, meta) => console.error(message, meta)
  }
});
```text

### 5. Testing

```javascript
// Mock client for testing
const mockClient = {
  users: {
    get: jest.fn().mockResolvedValue({ id: '123', name: 'Test User' }),
    update: jest.fn().mockResolvedValue({ id: '123', name: 'Updated User' })
  }
};

// Use in tests
describe('UserService', () => {
  it('should get user profile', async () => {
    const userService = new UserService(mockClient);
    const user = await userService.getProfile('123');

    expect(mockClient.users.get).toHaveBeenCalledWith('123');
    expect(user.name).toBe('Test User');
  });
});
```text

## SDK Maintenance and Updates

### Version Management

- **Major versions**: Breaking changes, API updates
- **Minor versions**: New features, backwards compatible
- **Patch versions**: Bug fixes, security updates

### Changelog Monitoring

```javascript
// Check SDK version
console.log('SDK Version:', EnvoyOUClient.VERSION);

// Check API compatibility
const compatibility = client.checkCompatibility();
if (!compatibility.supported) {
  console.warn('SDK version may not be compatible with API version');
}
```text

### Migration Guides

When upgrading SDK versions:

1. Check the changelog for breaking changes
2. Update dependencies
3. Run test suite
4. Update configuration if needed
5. Deploy gradually with feature flags

## Contributing to SDKs

### Official SDKs

Contribute to official SDKs through GitHub:

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement the feature
5. Submit a pull request

### Community SDKs

For community SDKs:

1. Follow language-specific best practices
2. Include comprehensive documentation
3. Provide examples and test coverage
4. Keep the SDK up-to-date with API changes

## Support and Resources

- **Documentation**: https://docs.envoyou.com/sdk
- **API Reference**: https://api.envoyou.com/docs
- **GitHub Issues**: Report bugs and request features
- **Community Forum**: Get help from other developers
- **Status Page**: Check SDK and API status

SDKs provide a convenient, reliable way to integrate with the EnvoyOU API. Choose the SDK that best fits your technology stack and development workflow.