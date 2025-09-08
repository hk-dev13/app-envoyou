/**
 * Error Handling Service
 * Centralized error handling and recovery for EnvoyOU application
 */

import logger from './logger';
import { ERROR_MESSAGES } from '../config';

// Error Types
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  API: 'api',
  UNKNOWN: 'unknown',
};

// Error Severity Levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

class ErrorHandler {
  constructor() {
    this.retryAttempts = new Map();
    this.maxRetryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Handle different types of errors
   */
  handleError(error, context = {}) {
    const errorInfo = this.categorizeError(error, context);
    
    // Log the error
    logger.error(`Error handled: ${errorInfo.type}`, {
      ...errorInfo,
      context,
    });

    // Determine recovery strategy
    const recovery = this.getRecoveryStrategy(errorInfo);
    
    // Execute recovery if available
    if (recovery.action) {
      return this.executeRecovery(errorInfo, recovery, context);
    }

    // Return formatted error for UI display
    return this.formatErrorForUI(errorInfo);
  }

  /**
   * Categorize error by type and severity
   */
  categorizeError(error, context = {}) {
    let type = ERROR_TYPES.UNKNOWN;
    let severity = ERROR_SEVERITY.MEDIUM;
    let message = error.message || 'An unknown error occurred';
    let userMessage = ERROR_MESSAGES.GENERIC_ERROR;
    let code = error.code || 'UNKNOWN_ERROR';

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      type = ERROR_TYPES.NETWORK;
      severity = ERROR_SEVERITY.HIGH;
      userMessage = ERROR_MESSAGES.NETWORK_ERROR;
      code = 'NETWORK_ERROR';
    }

    // API errors
    if (error.response) {
      type = ERROR_TYPES.API;
      code = `API_${error.response.status}`;
      
      switch (error.response.status) {
        case 401:
          type = ERROR_TYPES.AUTHENTICATION;
          severity = ERROR_SEVERITY.HIGH;
          userMessage = ERROR_MESSAGES.AUTHENTICATION_ERROR;
          code = 'AUTH_REQUIRED';
          break;
        case 403:
          type = ERROR_TYPES.AUTHORIZATION;
          severity = ERROR_SEVERITY.HIGH;
          userMessage = ERROR_MESSAGES.AUTHORIZATION_ERROR;
          code = 'ACCESS_DENIED';
          break;
        case 422:
          type = ERROR_TYPES.VALIDATION;
          severity = ERROR_SEVERITY.LOW;
          userMessage = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          code = 'VALIDATION_ERROR';
          break;
        case 429:
          type = ERROR_TYPES.API;
          severity = ERROR_SEVERITY.MEDIUM;
          userMessage = ERROR_MESSAGES.RATE_LIMIT_ERROR;
          code = 'RATE_LIMITED';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          type = ERROR_TYPES.API;
          severity = ERROR_SEVERITY.CRITICAL;
          userMessage = ERROR_MESSAGES.SERVER_ERROR;
          code = 'SERVER_ERROR';
          break;
        default:
          userMessage = error.response.data?.message || ERROR_MESSAGES.GENERIC_ERROR;
      }
    }

    // Validation errors
    if (error.name === 'ValidationError' || context.isValidation) {
      type = ERROR_TYPES.VALIDATION;
      severity = ERROR_SEVERITY.LOW;
      userMessage = error.message || ERROR_MESSAGES.VALIDATION_ERROR;
      code = 'VALIDATION_ERROR';
    }

    return {
      type,
      severity,
      message,
      userMessage,
      code,
      originalError: error,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    };
  }

  /**
   * Get recovery strategy based on error type
   */
  getRecoveryStrategy(errorInfo) {
    const strategies = {
      [ERROR_TYPES.NETWORK]: {
        action: 'retry',
        maxAttempts: 3,
        delay: 2000,
        backoff: true,
      },
      [ERROR_TYPES.AUTHENTICATION]: {
        action: 'redirectToLogin',
        clearSession: true,
      },
      [ERROR_TYPES.AUTHORIZATION]: {
        action: 'showError',
        redirect: '/dashboard',
      },
      [ERROR_TYPES.API]: {
        action: errorInfo.code === 'RATE_LIMITED' ? 'retry' : 'showError',
        maxAttempts: errorInfo.code === 'RATE_LIMITED' ? 1 : 0,
        delay: errorInfo.code === 'RATE_LIMITED' ? 5000 : 0,
      },
      [ERROR_TYPES.VALIDATION]: {
        action: 'showError',
      },
      [ERROR_TYPES.UNKNOWN]: {
        action: 'showError',
        fallback: true,
      },
    };

    return strategies[errorInfo.type] || strategies[ERROR_TYPES.UNKNOWN];
  }

  /**
   * Execute recovery strategy
   */
  async executeRecovery(errorInfo, recovery, context) {
    switch (recovery.action) {
      case 'retry':
        return this.handleRetry(errorInfo, recovery, context);
      
      case 'redirectToLogin':
        return this.handleAuthenticationError(errorInfo, recovery);
      
      case 'showError':
        return this.formatErrorForUI(errorInfo);
      
      default:
        return this.formatErrorForUI(errorInfo);
    }
  }

  /**
   * Handle retry logic
   */
  async handleRetry(errorInfo, recovery, context) {
    const retryKey = `${context.operation || 'unknown'}_${Date.now()}`;
    const currentAttempts = this.retryAttempts.get(retryKey) || 0;

    if (currentAttempts >= (recovery.maxAttempts || this.maxRetryAttempts)) {
      this.retryAttempts.delete(retryKey);
      return this.formatErrorForUI({
        ...errorInfo,
        userMessage: 'Operation failed after multiple attempts. Please try again later.',
      });
    }

    // Calculate delay with exponential backoff if enabled
    const delay = recovery.backoff 
      ? recovery.delay * Math.pow(2, currentAttempts)
      : recovery.delay || this.retryDelay;

    this.retryAttempts.set(retryKey, currentAttempts + 1);

    logger.info(`Retrying operation: ${context.operation}`, {
      attempt: currentAttempts + 1,
      maxAttempts: recovery.maxAttempts,
      delay,
    });

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, delay));

    // Return retry signal
    return {
      shouldRetry: true,
      attempt: currentAttempts + 1,
      delay,
    };
  }

  /**
   * Handle authentication errors
   */
  handleAuthenticationError(errorInfo, recovery) {
    if (recovery.clearSession) {
      // Clear user session
      try {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
      } catch (error) {
          console.warn('localStorage not available (incognito mode):', error);
      }
      
      logger.info('Session cleared due to authentication error');
    }

    // Redirect to login
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 1000);
    }

    return {
      type: 'authentication_error',
      message: errorInfo.userMessage,
      action: 'redirect_to_login',
    };
  }

  /**
   * Format error for UI display
   */
  formatErrorForUI(errorInfo) {
    return {
      type: 'error',
      message: errorInfo.userMessage,
      code: errorInfo.code,
      severity: errorInfo.severity,
      timestamp: errorInfo.timestamp,
      canRetry: this.canRetry(errorInfo),
    };
  }

  /**
   * Check if error can be retried
   */
  canRetry(errorInfo) {
    const retryableTypes = [ERROR_TYPES.NETWORK, ERROR_TYPES.API];
    const retryableCodes = ['NETWORK_ERROR', 'SERVER_ERROR', 'RATE_LIMITED'];
    
    return retryableTypes.includes(errorInfo.type) || 
           retryableCodes.includes(errorInfo.code);
  }

  /**
   * Report critical errors
   */
  reportCriticalError(errorInfo, context = {}) {
    if (errorInfo.severity === ERROR_SEVERITY.CRITICAL) {
      logger.error('Critical error reported', {
        ...errorInfo,
        context,
        needsImmediateAttention: true,
      });

      // In production, this would send to external monitoring
      // For now, we'll just log it
      console.error('CRITICAL ERROR:', errorInfo);
    }
  }

  /**
   * Clear retry attempts for a specific operation
   */
  clearRetryAttempts(operation) {
    for (const [key] of this.retryAttempts.entries()) {
      if (key.startsWith(operation)) {
        this.retryAttempts.delete(key);
      }
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const logs = logger.getLogs('error');
    const stats = {
      total: logs.length,
      byType: {},
      bySeverity: {},
      recent: logs.slice(-10),
    };

    logs.forEach(log => {
      const type = log.context?.type || 'unknown';
      const severity = log.context?.severity || 'medium';
      
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

/**
 * Initializes global error handlers to catch unhandled exceptions and promise rejections.
 */
export const initializeGlobalErrorHandler = () => {
  window.onerror = (message, source, lineno, colno, error) => {
    logger.error('Unhandled global error caught by window.onerror', {
      message,
      source,
      lineno,
      colno,
    });
    errorHandler.handleError(error || new Error(String(message)), {
      source: 'window.onerror',
    });
    // Return true to prevent the firing of the default event handler.
    return true;
  };

  window.onunhandledrejection = (event) => {
    logger.error('Unhandled promise rejection caught', {
      reason: event.reason,
    });
    errorHandler.handleError(event.reason, {
      source: 'window.onunhandledrejection',
    });
  };

  logger.info('Global error handlers (onerror, onunhandledrejection) have been initialized.');
};

// Export convenience function
export const handleError = (error, context = {}) => {
  return errorHandler.handleError(error, context);
};

export default errorHandler;
