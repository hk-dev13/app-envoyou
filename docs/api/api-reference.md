---
sidebar_position: 5
---

# API Reference

## Endpoint /v1/auth/register

<span className="api-method post">POST</span> `/v1/auth/register`

Register a new user account.

**Authentication**: None required

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "name": "string (required)",
  "company": "string (optional)",
  "job_title": "string (optional)"
}
```text

**Response (200)**:
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "email_sent": true
}
```text

**Response (400)**:
```json
{
  "detail": "Password must be at least 8 characters with uppercase, lowercase, and number"
}
```text

## Endpoint /v1/auth/login

<span className="api-method post">POST</span> `/v1/auth/login`

Authenticate user and get tokens.

**Authentication**: None required

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```text

**Response (200)**:
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "company": "string"
  }
}
```text

**Response (401)**:
```json
{
  "detail": "Invalid email or password"
}
```text

## Other Data Endpoints

### /v1/global/emissions

<span className="api-method get">GET</span> `/v1/global/emissions`

Get US emissions data.

**Authentication**: API Key required

**Query Parameters**:
- `state`: string (optional) - Filter by state
- `year`: integer (optional) - Filter by year
- `pollutant`: string (optional) - Filter by pollutant
- `limit`: integer (default 50, max 100)

**Response (200)**:
```json
{
  "data": [
    {
      "facility_name": "Plant A",
      "state": "CA",
      "year": 2023,
      "pollutant": "CO2",
      "emissions": 1000.5
    }
  ],
  "source": "epa",
  "total": 1
}
```text

### /v1/global/eea/renewables

<span className="api-method get">GET</span> `/v1/global/eea/renewables`

Get EEA renewable energy data.

**Authentication**: API Key required

### /v1/global/iso/certifications

<span className="api-method get">GET</span> `/v1/global/iso/certifications`

Get ISO 14001 certifications.

**Authentication**: API Key required

### /v1/permits/search

<span className="api-method get">GET</span> `/v1/permits/search`

Search Indonesian environmental permits.

**Authentication**: API Key required

## Request & Response Format

All requests use JSON. Responses always in format:
```json
{
  "success": boolean,
  "data": object/array,
  "message": "string (optional)",
  "error": "string (optional)"
}
```text