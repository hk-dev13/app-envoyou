/**
 * Environment Configuration
 * Centralized configuration management for EnvoyOU application
 */

// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'EnvoyOU',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Professional CV Enhancement API Service',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  version: import.meta.env.VITE_API_VERSION || 'v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  rateLimit: {
    requests: parseInt(import.meta.env.VITE_API_RATE_LIMIT_REQUESTS) || 100,
    window: parseInt(import.meta.env.VITE_API_RATE_LIMIT_WINDOW) || 60000,
  },
};

// Authentication Configuration
export const AUTH_CONFIG = {
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: import.meta.env.VITE_JWT_EXPIRES_IN || '7d',
  sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000,
  tokenKey: 'envoyou_auth_token',
  userKey: 'envoyou_user_data',
};

// Feature Flags
export const FEATURES = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
  serviceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  devtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  apiMocking: import.meta.env.VITE_ENABLE_API_MOCKING === 'true',
  apiTester: import.meta.env.VITE_SHOW_API_TESTER === 'true',
};

// External Services
// External Services Configuration
export const EXTERNAL_SERVICES = {
  analytics: {
    enabled: !APP_CONFIG.isDevelopment,
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  },
  sentry: {
    enabled: true, // Enable Sentry if DSN is available, regardless of environment
    dsn: import.meta.env.VITE_SENTRY_DSN,
  },
};

// Security Configuration
export const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  csrfProtection: !APP_CONFIG.isDevelopment,
  enforceHttps: !APP_CONFIG.isDevelopment,
  contentSecurityPolicy: {
    enabled: !APP_CONFIG.isDevelopment,
    reportOnly: APP_CONFIG.isDevelopment,
  },
};

// Contact Information
export const CONTACT = {
  support: import.meta.env.VITE_SUPPORT_EMAIL || 'support@envoyou.com',
  contact: import.meta.env.VITE_CONTACT_EMAIL || 'contact@envoyou.com',
  legal: import.meta.env.VITE_LEGAL_EMAIL || 'legal@envoyou.com',
};

// Social Media Links
export const SOCIAL_LINKS = {
  github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/hk-dev13',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/husni-kusuma/',
  twitter: import.meta.env.VITE_TWITTER_URL || 'https://x.com/EnvoyouAPI',
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  user: {
    profile: '/user/profile',
    settings: '/user/settings',
    apiKeys: '/user/api-keys',
    usage: '/user/usage',
  },
  cv: {
    enhance: '/cv/enhance',
    analyze: '/cv/analyze',
    optimize: '/cv/optimize',
  },
  admin: {
    users: '/admin/users',
    analytics: '/admin/analytics',
    system: '/admin/system',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'Your session has expired. Please login again.',
  forbidden: 'You do not have permission to access this resource.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Please check your input and try again.',
  rateLimitExceeded: 'Too many requests. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  loginSuccess: 'Welcome back! Login successful.',
  registerSuccess: 'Account created successfully! Welcome to EnvoyOU.',
  profileUpdated: 'Profile updated successfully.',
  passwordChanged: 'Password changed successfully.',
  apiKeyCreated: 'API key created successfully.',
  apiKeyDeleted: 'API key deleted successfully.',
};

// Validation Rules
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address.',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
  },
  apiKey: {
    pattern: /^envoyou_(pk|sk)_(live|test|dev)_[a-zA-Z0-9]{32,}$/,
    message: 'Invalid API key format.',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: 'envoyou_auth_token',
  userData: 'envoyou_user_data',
  preferences: 'envoyou_preferences',
  apiKeys: 'envoyou_api_keys',
  lastActivity: 'envoyou_last_activity',
};

// Default Values
export const DEFAULTS = {
  pagination: {
    pageSize: 20,
    maxPageSize: 100,
  },
  timeouts: {
    debounce: 300,
    notification: 5000,
    session: 3600000, // 1 hour
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    fileName: 255,
    bioLength: 500,
    nameLength: 100,
  },
};

// Development Configuration
export const DEV_CONFIG = {
  enableLogging: APP_CONFIG.isDevelopment,
  enableDebugging: APP_CONFIG.isDevelopment && FEATURES.devtools,
  mockAPI: APP_CONFIG.isDevelopment && FEATURES.apiMocking,
  showAPITester: APP_CONFIG.isDevelopment && FEATURES.apiTester,
};

// Build Information
export const BUILD_INFO = {
  timestamp: new Date().toISOString(),
  version: APP_CONFIG.version,
  environment: APP_CONFIG.environment,
  commit: import.meta.env.VITE_COMMIT_HASH || 'unknown',
  branch: import.meta.env.VITE_BRANCH || 'unknown',
};

// Export all configurations
export default {
  APP_CONFIG,
  API_CONFIG,
  AUTH_CONFIG,
  FEATURES,
  EXTERNAL_SERVICES,
  CONTACT,
  SOCIAL_LINKS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  STORAGE_KEYS,
  DEFAULTS,
  DEV_CONFIG,
  BUILD_INFO,
};
