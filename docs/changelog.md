# Changelog

All notable changes to the EnvoyOU API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New webhook events for user profile updates
- Enhanced rate limiting with burst allowance
- Improved error messages with detailed context
- New SDK versions for Python and Go with async support

### Changed

- Updated authentication flow to support OAuth 2.0 PKCE
- Modified rate limit headers to include more detailed information
- Enhanced webhook retry logic with exponential backoff

### Deprecated

- Legacy authentication endpoints (use new OAuth flow)
- Old webhook payload format (migrate to new structured format)

## [1.2.0] - 2024-01-15

### Added

- Webhook signature verification for enhanced security
- Bulk user import API for enterprise customers
- Advanced filtering options for user search endpoints
- Real-time usage metrics in dashboard
- Support for custom user metadata fields

### Changed

- Improved error response format with consistent structure
- Updated rate limiting algorithm to sliding window
- Enhanced API documentation with interactive examples

### Fixed

- Race condition in concurrent user creation
- Memory leak in webhook processing
- Incorrect rate limit calculations under high load

## [1.1.5] - 2024-01-01

### Fixed

- Security vulnerability in JWT token validation (CVE-2024-001)
- Incorrect handling of special characters in user names
- Timeout issues with large bulk operations
- Webhook delivery failures under high load

### Security

- Updated dependencies to address security vulnerabilities
- Enhanced input validation for all endpoints
- Improved encryption for sensitive data storage

## [1.1.0] - 2023-12-15

### Added

- New user management endpoints for enterprise features
- Support for SAML authentication
- Advanced audit logging capabilities
- API usage analytics and reporting
- Custom domain support for enterprise accounts

### Changed

- Updated SDK versions across all supported languages
- Improved performance for bulk operations
- Enhanced error handling with more descriptive messages

### Deprecated

- Legacy bulk import format (use new JSON format)

## [1.0.5] - 2023-12-01

### Fixed

- Incorrect pagination in user list endpoints
- Missing CORS headers for web applications
- Database connection pool exhaustion under load
- Incorrect timezone handling in timestamps

### Security

- Fixed potential information disclosure in error messages
- Updated SSL/TLS configuration for better security

## [1.0.0] - 2023-11-15

### Added

- Initial release of EnvoyOU API
- User authentication and management
- JWT token-based authorization
- Rate limiting and quota management
- Webhook notifications
- Official SDKs for JavaScript, Python, and Go
- Comprehensive API documentation
- Developer dashboard and analytics

### Changed

- N/A (initial release)

### Deprecated

- N/A (initial release)

### Removed

- N/A (initial release)

### Fixed

- N/A (initial release)

### Security

- Implemented comprehensive security measures
- SOC 2 Type II compliance
- GDPR compliance features
- End-to-end encryption for sensitive data

---

## Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Support Policy

- **Current version** (1.x): Full support and bug fixes
- **Previous major version** (deprecated): Security updates only
- **Older versions**: No longer supported

## Migration Guides

### Migrating from 1.1.x to 1.2.x

#### Authentication Changes

- OAuth 2.0 PKCE is now required for public clients
- Legacy authentication endpoints are deprecated
- New token refresh flow implemented

```javascript
// Old way (deprecated)
const token = await client.auth.login({ email, password });

// New way (recommended)
const authCode = await client.auth.authorize({
  client_id: 'your-client-id',
  scope: 'read write',
  code_challenge: generateCodeChallenge()
});
```text

#### Webhook Payload Changes

- New structured payload format
- Enhanced event types
- Signature verification required

```json
// Old format (deprecated)
{
  "event": "user.created",
  "user": { "id": "123", "email": "user@example.com" }
}

// New format (current)
{
  "id": "evt_1234567890",
  "type": "user.created",
  "created": 1640995200,
  "data": {
    "object": {
      "id": "user_123",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```text

### Migrating from 1.0.x to 1.1.x

#### Bulk Operations

- New bulk import format required
- Enhanced error reporting for failed operations

```javascript
// Old bulk import (deprecated)
await client.users.bulkCreate([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' }
]);

// New bulk import (current)
const result = await client.users.bulkImport({
  users: [
    { email: 'user1@example.com', name: 'User 1', metadata: {} },
    { email: 'user2@example.com', name: 'User 2', metadata: {} }
  ],
  options: {
    skip_duplicates: true,
    send_welcome_email: false
  }
});
```text

## Upcoming Changes

### Version 2.0.0 (Q2 2024)

- GraphQL API support
- Enhanced real-time capabilities
- Advanced user segmentation
- Machine learning-powered analytics

### Version 1.3.0 (Q1 2024)

- Mobile SDK improvements
- Enhanced security features
- Performance optimizations
- New integration options

## Feedback

We welcome feedback on our changelog and release process. Please open an issue on our [GitHub repository](https://github.com/envoyou/api) if you have suggestions for improvement.

## Security Advisories

For security-related updates and advisories, please visit our [security page](https://envoyou.com/security) or subscribe to our security mailing list.

---

*This changelog is maintained by the EnvoyOU team and is updated with each release. For the latest changes, please check the [GitHub repository](https://github.com/envoyou/api/releases).*
