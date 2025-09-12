# Envoyou App Dashboard

User dashboard for Envoyou API management and analytics platform.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-Latest-green.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-blue.svg)


## Features

- User authentication and email verification
- API key management
- Usage analytics and monitoring
- Profile and settings management
- Real-time notifications

## Tech Stack

- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API communication

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file with:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.envoyou.com
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Envoyou Dashboard
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=User Dashboard for Envoyou API Management
VITE_APP_ENV=development

# Supabase Configuration (Required for Authentication)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Authentication
VITE_JWT_EXPIRES_IN=7d
VITE_SESSION_TIMEOUT=3600000

# External Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

## Supabase Authentication Setup

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Authentication:**
   - In Supabase Dashboard → Authentication → Settings
   - Set Site URL: `https://app.envoyou.com`
   - Add Redirect URLs:
     - `http://localhost:3000/*` (development)
     - `http://localhost:5173/*` (Vite dev)
     - `https://app.envoyou.com/*` (production)

3. **Enable OAuth Providers:**
   - Go to Authentication → Providers
   - Enable Google and GitHub OAuth
   - Configure your OAuth credentials

4. **Update Environment Variables:**
   - Add your Supabase URL and anon key to `.env`
   - Restart your development server

## Authentication Flow

The app uses Supabase Auth with the following features:
- Google and GitHub OAuth login
- Automatic session management
- JWT token handling
- Protected routes
- User profile management

## Deployment

This app is configured for deployment on Netlify at app.envoyou.com subdomain.

## Contact
Maintained by [Husni Kusuma](https://github.com/hk-dev13)  
🌐 Website: [envoyou.com](https://envoyou.com)  
📧 More info: [info@envoyou.com](mailto:info@envoyou.com)  

---
> <p style="text-align: center;">© 2025 <a href="https://envoyou.com">Envoyou</a> | All Rights Reserved</p>
> <p style="text-align: center;">Empowering Global Environmental Transparency</p>

