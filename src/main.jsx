import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Core Services Integration
import { APP_CONFIG, EXTERNAL_SERVICES } from './config/index.js';
import logger from './services/logger';
// import { initializePerformanceMonitoring } from './services/performance';
import { initializeGlobalErrorHandler } from './services/errorHandler';

// --- Sentry Error Monitoring ---
import * as Sentry from "@sentry/react";
import { browserTracingIntegration, replayIntegration } from "@sentry/react";

// Initialize Sentry if enabled and DSN is available
if (EXTERNAL_SERVICES.sentry.enabled && EXTERNAL_SERVICES.sentry.dsn) {
  Sentry.init({
    dsn: EXTERNAL_SERVICES.sentry.dsn,
    environment: APP_CONFIG.environment,
    // Setting this option to true will send default PII data to Sentry
    sendDefaultPii: true,
    // Enable performance monitoring
    integrations: [
      browserTracingIntegration(),
      replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance monitoring
    tracesSampleRate: APP_CONFIG.isProduction ? 0.1 : 1.0,
    // Session replay
    replaysSessionSampleRate: APP_CONFIG.isProduction ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
  });

  logger.info('Sentry error monitoring initialized.');
} else {
  logger.info('Sentry not enabled or DSN not configured.');
}

// --- Service Initialization ---
logger.info('Application starting...', { environment: APP_CONFIG.environment });

// Initialize Global Error Handler
initializeGlobalErrorHandler();
logger.info('Global error handler initialized.');

// Initialize Performance Monitoring
// initializePerformanceMonitoring();
// logger.info('Performance monitoring initialized.');

// Initialize AOS Animation Library
AOS.init({
  duration: 1200,
  once: true,
  offset: 100,
});
logger.info('AOS animation library initialized.');

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator && (APP_CONFIG.isProduction || APP_CONFIG.isDevelopment)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.info('Service Worker registered successfully.', { scope: registration.scope });
      })
      .catch((registrationError) => {
        logger.warn('Service Worker registration failed (possibly incognito mode).', { error: registrationError });
        // Don't throw error, app should still work without service worker
      });
  });
}

// --- React App Rendering ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const app = (
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );

  createRoot(rootElement).render(app);
  logger.info('React application rendered successfully.');
} else {
  logger.error("Fatal: Root element with id 'root' not found in the document.");
}
