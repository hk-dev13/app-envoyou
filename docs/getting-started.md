---
sidebar_position: 3
---

# Getting Started

## How to Register, Login, Get API Key

### 1. Register Account
- Visit `https://app.envoyou.com`
- Click "Sign Up"
- Enter email, password (min 8 characters with uppercase, lowercase, numbers), name, company (optional)
- Verify email via sent link

### 2. Login
- Login with email and password
- Receive access token and refresh token

### 3. Get API Key
- After login, go to Developer Dashboard
- Select tier: Basic (free), Premium, Enterprise
- Generate API key for data endpoint authentication

## Quickstart

### Using cURL

**Register**:
```bash
curl -X POST https://api.envoyou.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe",
    "company": "Example Corp"
  }'
```text

**Login**:
```bash
curl -X POST https://api.envoyou.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```text

**Get Data**:
```bash
curl -X GET "https://api.envoyou.com/v1/global/emissions?limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-API-Key: YOUR_API_KEY"
```text

### Using Python

```python
import requests

# Login
response = requests.post('https://api.envoyou.com/v1/auth/login', json={
    'email': 'user@example.com',
    'password': 'Password123'
})
token = response.json()['access_token']

# Get data
headers = {
    'Authorization': f'Bearer {token}',
    'X-API-Key': 'YOUR_API_KEY'
}
data = requests.get('https://api.envoyou.com/v1/global/emissions', headers=headers)
print(data.json())
```text

### Using JavaScript

```javascript
// Login
const loginResponse = await fetch('https://api.envoyou.com/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123'
  })
});
const { access_token } = await loginResponse.json();

// Get data
const dataResponse = await fetch('https://api.envoyou.com/v1/global/emissions', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'X-API-Key': 'YOUR_API_KEY'
  }
});
const data = await dataResponse.json();
console.log(data);
```text