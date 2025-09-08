/**
 * Logger Service
 * Centralized logging system for EnvoyOU application
 */

import { APP_CONFIG, DEV_CONFIG, EXTERNAL_SERVICES } from '../config';

// Log Levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

// Logger Class
class Logger {
  constructor() {
    this.isEnabled = DEV_CONFIG.enableLogging;
    this.isDevelopment = APP_CONFIG.isDevelopment;
    this.sessionId = this.generateSessionId();
    this.logs = [];
    this.maxLogs = 1000;
    
    // Initialize external error reporting if enabled
    this.initializeErrorReporting();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  initializeErrorReporting() {
    if (EXTERNAL_SERVICES.sentry && !this.isDevelopment) {
      // Initialize Sentry for production error reporting
      this.initSentry();
    }
  }

  initSentry() {
    // Sentry initialization would go here
    // For now, we'll just prepare the structure
    console.info('Sentry error reporting initialized');
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };

    // Store log in memory (for debugging)
    this.storeLogs(logEntry);

    return logEntry;
  }

  storeLogs(logEntry) {
    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence across sessions
    if (this.isDevelopment) {
      try {
        const storedLogs = JSON.parse(localStorage.getItem('envoyou_logs') || '[]');
        storedLogs.push(logEntry);
        localStorage.setItem('envoyou_logs', JSON.stringify(storedLogs.slice(-100)));
      } catch (error) {
        console.warn('Failed to store logs in localStorage:', error);
      }
    }
  }

  log(level, message, context = {}) {
    if (!this.isEnabled && !this.isDevelopment) return;

    const logEntry = this.formatMessage(level, message, context);

    // Console output with appropriate styling
    const style = this.getLogStyle(level);
    const prefix = `[${logEntry.timestamp}] [${level.toUpperCase()}]`;
    
    console.groupCollapsed(`%c${prefix} ${message}`, style);
    if (Object.keys(context).length > 0) {
      console.log('Context:', context);
    }
    console.log('Full Log Entry:', logEntry);
    console.groupEnd();

    // Send to external services in production
    if (!this.isDevelopment) {
      this.sendToExternalServices(logEntry);
    }

    return logEntry;
  }

  getLogStyle(level) {
    const styles = {
      [LOG_LEVELS.ERROR]: 'color: #ef4444; font-weight: bold;',
      [LOG_LEVELS.WARN]: 'color: #f59e0b; font-weight: bold;',
      [LOG_LEVELS.INFO]: 'color: #3b82f6; font-weight: bold;',
      [LOG_LEVELS.DEBUG]: 'color: #6b7280; font-weight: normal;',
    };
    return styles[level] || styles[LOG_LEVELS.INFO];
  }

  sendToExternalServices(logEntry) {
    // Send to external logging services like Sentry, LogRocket, etc.
    if (EXTERNAL_SERVICES.sentry && logEntry.level === LOG_LEVELS.ERROR) {
      // Send error to Sentry
      this.sendToSentry(logEntry);
    }

    // Send to analytics if it's a significant event
    if (logEntry.level === LOG_LEVELS.ERROR || logEntry.context.analytics) {
      this.sendToAnalytics(logEntry);
    }
  }

  sendToSentry(logEntry) {
    // Sentry integration would go here
    console.log('Sending to Sentry:', logEntry);
  }

  sendToAnalytics(logEntry) {
    // Analytics integration would go here
    console.log('Sending to Analytics:', logEntry);
  }

  // Convenience methods
  error(message, context = {}) {
    return this.log(LOG_LEVELS.ERROR, message, context);
  }

  warn(message, context = {}) {
    return this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message, context = {}) {
    return this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message, context = {}) {
    return this.log(LOG_LEVELS.DEBUG, message, context);
  }

  // API specific logging
  apiRequest(method, url, data = null) {
    return this.info(`API Request: ${method} ${url}`, {
      method,
      url,
      data,
      type: 'api_request',
    });
  }

  apiResponse(method, url, status, data = null, duration = null) {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    return this.log(level, `API Response: ${method} ${url} - ${status}`, {
      method,
      url,
      status,
      data,
      duration,
      type: 'api_response',
    });
  }

  // User action logging
  userAction(action, context = {}) {
    return this.info(`User Action: ${action}`, {
      ...context,
      type: 'user_action',
      timestamp: Date.now(),
    });
  }

  // Performance logging
  performance(metric, value, context = {}) {
    return this.info(`Performance: ${metric}`, {
      metric,
      value,
      ...context,
      type: 'performance',
    });
  }

  // Error boundary logging
  errorBoundary(error, errorInfo) {
    return this.error('React Error Boundary Caught Error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo,
      type: 'error_boundary',
    });
  }

  // Get logs for debugging
  getLogs(level = null, limit = 100) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-limit);
  }

  // Export logs for debugging
  exportLogs() {
    const logs = this.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `envoyou-logs-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    this.info('Logs exported', { count: logs.length });
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    if (this.isDevelopment) {
      localStorage.removeItem('envoyou_logs');
    }
    this.info('Logs cleared');
  }
}

// Create singleton instance
const logger = new Logger();

// Global error handling
window.addEventListener('error', (event) => {
  logger.error('Global JavaScript Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error ? {
      message: event.error.message,
      stack: event.error.stack,
    } : null,
    type: 'global_error',
  });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', {
    reason: event.reason,
    promise: event.promise,
    type: 'unhandled_rejection',
  });
});

export default logger;
