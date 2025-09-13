---
sidebar_position: 4
---

# Authentication

## Authentication Scheme

EnvoyOU uses a combination of JWT (JSON Web Token) and API Key for authentication:

- **JWT**: For user authentication (login/register)
  - Access Token: Valid for 15 minutes
  - Refresh Token: To get new access token
- **API Key**: For data endpoint access
  - Tier-based: Basic (1000 requests/day), Premium (10000), Enterprise (unlimited)
  - Rate limiting with Redis

## Request + Response Examples

**Login Request**:
```json
POST /v1/auth/login
{
  "email": "user@example.com",
  "password": "Password123"
}
```text

**Login Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Example Corp"
  }
}
```text