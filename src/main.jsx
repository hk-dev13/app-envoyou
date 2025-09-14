import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import App from './App.jsx';
import { UpgradeProvider } from './components/UpgradeProvider.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Core Services Integration
import { APP_CONFIG, EXTERNAL_SERVICES } from './config/index.js';
import logger from './services/logger';
// import { initializePerformanceMonitoring } from './services/performance';
import { initializeGlobalErrorHandler } from './services/errorHandler';

// --- Sentry + AOS dynamic bootstrap to trim initial bundle ---
async function bootstrapSidecar() {
  // Dynamic Sentry load
  if (EXTERNAL_SERVICES.sentry.enabled && EXTERNAL_SERVICES.sentry.dsn) {
    try {
      const SentryMod = await import(/* webpackChunkName: "sentry" */ '@sentry/react');
      const { browserTracingIntegration, replayIntegration } = await import('@sentry/react');
      SentryMod.init({
        dsn: EXTERNAL_SERVICES.sentry.dsn,
        environment: APP_CONFIG.environment,
        sendDefaultPii: true,
        integrations: [
          browserTracingIntegration(),
          replayIntegration({ maskAllText: true, blockAllMedia: true }),
        ],
        tracesSampleRate: APP_CONFIG.isProduction ? 0.1 : 1.0,
        replaysSessionSampleRate: APP_CONFIG.isProduction ? 0.1 : 1.0,
        replaysOnErrorSampleRate: 1.0,
      });
      logger.info('Sentry dynamically initialized.');
    } catch (e) {
      logger.warn('Sentry dynamic import failed', { error: e });
    }
  } else {
    logger.info('Sentry disabled or missing DSN (skipped).');
  }

  // Dynamic AOS load
  try {
    const AOSMod = await import('aos');
    await import('aos/dist/aos.css');
    AOSMod.default.init({ duration: 1200, once: true, offset: 100 });
    logger.info('AOS dynamically initialized.');
  } catch (e) {
    logger.warn('AOS dynamic import failed', { error: e });
  }
}

// --- Service Initialization ---
logger.info('Application starting...', { environment: APP_CONFIG.environment });
// Expose limited env diagnostics (non-secret) for debugging
try {
  window.__envoyouEnv = {
    env: APP_CONFIG.environment,
    hasSupabaseUrl: !!EXTERNAL_SERVICES.supabase.url,
    hasSupabaseAnon: !!EXTERNAL_SERVICES.supabase.anonKey,
    sentryEnabled: EXTERNAL_SERVICES.sentry.enabled && !!EXTERNAL_SERVICES.sentry.dsn,
    build: import.meta?.env?.VITE_COMMIT_HASH || 'unknown'
  };
} catch (_) {}

// Initialize Global Error Handler
initializeGlobalErrorHandler();
logger.info('Global error handler initialized.');

// Initialize Performance Monitoring
// initializePerformanceMonitoring();
// logger.info('Performance monitoring initialized.');

bootstrapSidecar();

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
        <UpgradeProvider>
          <App />
        </UpgradeProvider>
      </ErrorBoundary>
    </StrictMode>
  );

  createRoot(rootElement).render(app);
  logger.info('React application rendered successfully.');
} else {
  logger.error("Fatal: Root element with id 'root' not found in the document.");
}
