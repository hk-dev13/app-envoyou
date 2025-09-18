import { API_CONFIG, EXTERNAL_SERVICES } from '../config/index.js';
import logger from './logger.js';
import { handleError } from './errorHandler.js';

// Import Sentry conditionally for ESM compatibility
let Sentry = null;
if (EXTERNAL_SERVICES.sentry.enabled && EXTERNAL_SERVICES.sentry.dsn) {
  try {
    // For browser environment, we'll use a different approach
    // Sentry will be available globally if loaded
    if (typeof window !== 'undefined' && window.Sentry) {
      Sentry = window.Sentry;
    }
  } catch (e) {
    console.warn('Sentry not available:', e);
  }
}

class APIService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.retryAttempts = API_CONFIG.retryAttempts;
    this.retryDelay = API_CONFIG.retryDelay;
  }

  getAuthHeaders() {
    let token = null;
    try {
        token = localStorage.getItem('envoyou_token');
    } catch (error) {
        console.warn('localStorage not available (incognito mode):', error);
    }
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  createAbortSignal() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller.signal;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    let lastError = null;

    // Using retry logic from config, defaulting to 1 attempt for non-GET requests
    const maxAttempts = (method === 'GET' ? this.retryAttempts : 1);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const startTime = Date.now();
      try {
        logger.apiRequest(method, url, options.body);

        const response = await fetch(url, {
          ...options,
          signal: this.createAbortSignal(),
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...options.headers,
          },
        });

        const duration = Date.now() - startTime;
        // Try to parse JSON, but don't fail if body is empty (e.g., 204 No Content)
        const responseData = response.status !== 204 ? await response.json().catch(() => null) : null;

        if (!response.ok) {
          const error = new Error(responseData?.message || `HTTP Error: ${response.status}`);
          error.response = {
            status: response.status,
            data: responseData,
          };
          throw error;
        }

        logger.apiResponse(method, url, response.status, responseData, duration);
        return responseData;

      } catch (error) {
        const duration = Date.now() - startTime;
        lastError = error;
        logger.apiResponse(method, url, error.response?.status || 0, { message: error.message }, duration);

        const handledError = handleError(error, {
          operation: 'apiRequest',
          url,
          method,
          attempt,
        });

        // Send error to Sentry if available
        if (Sentry) {
          Sentry.withScope((scope) => {
            scope.setTag('operation', 'apiRequest');
            scope.setTag('method', method);
            scope.setTag('url', url);
            scope.setTag('attempt', attempt);
            scope.setContext('api_error', {
              status: error.response?.status,
              message: error.message,
              duration,
              retryAttempt: attempt,
              maxAttempts,
            });
            Sentry.captureException(error);
          });
        }

        if (handledError.shouldRetry && attempt < maxAttempts) {
          logger.info(`Retrying API request`, { method, url, attempt: attempt + 1, delay: handledError.delay });
          await new Promise(resolve => setTimeout(resolve, handledError.delay));
          continue;
        }
        // Throw a proper Error instance with message for consumers
        const err = new Error(handledError.message || handledError.userMessage || error.message || 'Request failed');
        // Preserve useful fields from handledError
        Object.assign(err, handledError);
        throw err;
      }
    }

    // Send final error to Sentry if available
    if (Sentry && lastError) {
      Sentry.withScope((scope) => {
        scope.setTag('operation', 'apiRequest');
        scope.setTag('method', method);
        scope.setTag('url', url);
        scope.setTag('final_attempt', 'true');
        scope.setContext('final_api_error', {
          message: lastError.message,
          status: lastError.response?.status,
          maxAttempts,
        });
        Sentry.captureException(lastError);
      });
    }

    // If we get here, all attempts failed
    if (!lastError) {
      lastError = new Error('Request failed after all retry attempts');
    }

    throw lastError;
  }

  // --- Standard HTTP Methods ---

  async get(endpoint, options = {}) {
    const { params, ...otherOptions } = options;
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET', ...otherOptions });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // --- Authentication Methods ---

  async register(userData) {
    return this.post('/v1/auth/register', userData);
  }

  async login(credentials) {
    return this.post('/v1/auth/login', credentials);
  }

  async logout() {
    return this.post('/v1/auth/logout');
  }

  async refreshToken() {
    return this.post('/v1/auth/refresh');
  }

  async sendVerificationEmail(email) {
    return this.post('/v1/auth/send-verification', { email });
  }

  async verifyEmail(tokenData) {
    return this.post('/v1/auth/verify-email', tokenData);
  }

  async setPassword(email, password) {
    return this.post('/v1/auth/set-password', { email, password });
  }

  async setLocalPassword(password) {
    return this.post('/v1/auth/set-local-password', { password });
  }

  async forgotPassword(email) {
    return this.post('/v1/auth/forgot-password', { email });
  }

  async resetPassword(token, newPassword) {
    return this.post('/v1/auth/reset-password', { token, password: newPassword });
  }

  async changePassword(currentPassword, newPassword) {
    return this.post('/v1/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  // Social Login Methods
  async googleLogin(code) {
    return this.post('/v1/auth/google/token', { code });
  }

  async githubLogin(code) {
    return this.post('/v1/auth/github/token', { code });
  }

  async getOAuthUrl(provider) {
    throw new Error('getOAuthUrl is no longer used; OAuth handled by Supabase');
  }

  // --- User Profile Methods ---

  async getUserProfile() {
    return this.get('/v1/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.put('/v1/user/profile', profileData);
  }

  async uploadAvatar(formData) {
    return this.request('/v1/user/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    });
  }

  // --- API Keys Methods ---

  async getApiKeys() {
    return this.get('/v1/user/api-keys');
  }

  async createApiKey(data) {
    if (typeof data === 'string') {
      // Backward compatibility: if data is just a string, treat it as name
      return this.post('/v1/user/api-keys', { name: data });
    } else {
      // New format: data is an object with name and environment
      return this.post('/v1/user/api-keys', data);
    }
  }

  async deleteApiKey(keyId) {
    return this.delete(`/v1/user/api-keys/${keyId}`);
  }

  // --- Sessions Methods ---

  async getUserSessions() {
    return this.get('/v1/user/sessions');
  }

  async deleteUserSession(sessionId) {
    return this.delete(`/v1/user/sessions/${sessionId}`);
  }

  // --- 2FA Methods ---

  async setup2FA() {
    return this.post('/v1/auth/2fa/setup');
  }

  async verify2FA(code) {
    return this.post('/v1/auth/2fa/verify', { code });
  }

  async disable2FA() {
    return this.post('/v1/auth/2fa/disable');
  }

  // --- Environmental Data Methods ---

  async getPermits(params = {}) {
    return this.get('/v1/permits', { params });
  }

  async searchPermits(query, params = {}) {
    return this.get('/v1/permits/search', { params: { q: query, ...params } });
  }

  async getActivePermits() {
    return this.get('/v1/permits/active');
  }

  async getPermitsByCompany(companyName) {
    return this.get(`/v1/permits/company/${encodeURIComponent(companyName)}`);
  }

  async getPermitsByType(permitType) {
    return this.get(`/v1/permits/type/${encodeURIComponent(permitType)}`);
  }

  async getPermitStats() {
    return this.get('/v1/permits/stats');
  }

  async getUserStats() {
    return this.get('/v1/user/stats');
  }

  async getDeveloperStats() {
    return this.get('/v1/developer/stats');
  }

  async getUsageAnalytics(params = {}) {
    return this.get('/v1/developer/usage-analytics', { params });
  }

  async getRateLimits() {
    return this.get('/v1/developer/rate-limits');
  }

  async getCEVSData(companyName, country = null, apiKey = null) {
    if (!companyName) throw new Error('Company name is required for CEVS lookup');
    
    const params = {};
    if (country) params.country = country;

    const headers = apiKey ? { 'X-API-Key': apiKey } : {};
    return this.get(`/v1/global/cevs/${encodeURIComponent(companyName)}`, { params, headers });
  }

  async getEmissionsData(state = null, year = null, page = 1, limit = 50) {
    const params = { state, year, page, limit };
    Object.keys(params).forEach(key => params[key] == null && delete params[key]);
    return this.get('/v1/global/emissions', { params });
  }

  async getCountries(country = null, limit = 50) {
    const params = { country, limit };
    Object.keys(params).forEach(key => params[key] == null && delete params[key]);
    return this.get('/v1/global/iso', { params });
  }

  async submitAPIKeyRequest(formData) {
    // Use the correct backend endpoint for free API key requests
    return this.post('/v1/auth/request-free-api-key', formData);
  }

  async testAPIKey(apiKey) {
    // Call a protected endpoint to actually validate API key
    return this.get('/v1/global/iso', {
      params: { limit: 1 },
      headers: { 'X-API-Key': apiKey },
    });
  }

  async requestDemoKey(clientName = "Demo User") {
    // Use the free API key endpoint for demo requests
    const data = await this.post('/v1/auth/request-free-api-key', {
      name: clientName,
      email: 'demo@example.com',
      purpose: 'Demo testing'
    });
    if (data && data.api_key) {
        const apiKey = data.api_key;
        logger.info('Demo API Key obtained and stored.');
        try {
            localStorage.setItem('envoyou_demo_api_key', apiKey);
        } catch (error) {
            console.warn('localStorage not available (incognito mode):', error);
        }
        return apiKey;
    } else {
        throw new Error(data?.message || 'Failed to get demo API key');
    }
  }

  getStoredApiKey() {
    try {
        return localStorage.getItem('envoyou_demo_api_key');
    } catch (error) {
        console.warn('localStorage not available (incognito mode):', error);
        return null;
    }
  }

  clearStoredApiKey() {
    try {
        localStorage.removeItem('envoyou_demo_api_key');
    } catch (error) {
        console.warn('localStorage not available (incognito mode):', error);
    }
    logger.info('Stored Demo API Key cleared.');
  }
}

const apiService = new APIService();
export default apiService;
