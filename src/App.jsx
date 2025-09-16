import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth.js';
import { UpgradeProvider } from './components/UpgradeProvider.jsx';
// // import ErrorBoundary from './components/ErrorBoundary';
// import ServiceWorkerManager from './components/ServiceWorkerManager';
// import PushNotificationManager from './components/PushNotificationManager';
// import NetworkStatus from './components/NetworkStatus';
// import BackToTop from './components/BackToTop';
// import CookieConsent from './components/CookieConsent';
// import { ToastProvider } from './components/Toast';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MonitoringDashboard = lazy(() => import('./pages/MonitoringDashboard'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const ReportingDashboard = lazy(() => import('./pages/ReportingDashboard'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const RegisterSuccessPage = lazy(() => import('./pages/auth/RegisterSuccessPage'));
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallbackPage'));
const EmailVerificationPage = lazy(() => import('./pages/auth/EmailVerificationPage'));
const SetPasswordPage = lazy(() => import('./pages/auth/SetPasswordPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const ProfileSettingsPage = lazy(() => import('./pages/settings/ProfileSettingsPage'));
const SecuritySettingsPage = lazy(() => import('./pages/settings/SecuritySettingsPage'));
const NotificationsSettingsPage = lazy(() => import('./pages/settings/NotificationsSettingsPage'));

// Developer Dashboard pages
const DeveloperDashboard = lazy(() => import('./pages/developer-dashboard/DeveloperDashboard'));
const APIDocsPage = lazy(() => import('./pages/developer-dashboard/api-docs'));
const APIKeysPage = lazy(() => import('./pages/developer-dashboard/api-keys'));
const AnalyticsPage = lazy(() => import('./pages/developer-dashboard/analytics'));
const SnippetsPage = lazy(() => import('./pages/developer-dashboard/snippets'));
const RateLimitsPage = lazy(() => import('./pages/developer-dashboard/rate-limits'));

// Import ProtectedRoute
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout.jsx';

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
      <p className="text-slate-300">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/auth/login" replace />
              } 
            />
            
            {/* Auth routes - only login for existing users */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/register-success" element={<RegisterSuccessPage />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />
            <Route path="/auth/v1/callback" element={<OAuthCallbackPage />} />
            <Route path="/auth/set-password" element={<SetPasswordPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify/:token" element={<EmailVerificationPage />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/dashboard/usage" element={<Navigate to="/developer/analytics" replace />} />
            <Route path="/dashboard/monitoring" element={<ProtectedRoute><AppLayout><MonitoringDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><AppLayout><AnalyticsDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/dashboard/reporting" element={<ProtectedRoute><AppLayout><ReportingDashboard /></AppLayout></ProtectedRoute>} />
            
            {/* Protected settings routes */}
            <Route path="/settings/profile" element={<ProtectedRoute><AppLayout><ProfileSettingsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><AppLayout><NotificationsSettingsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/settings/api-keys" element={<Navigate to="/developer/api-keys" replace />} />
            <Route path="/settings/security" element={<ProtectedRoute><AppLayout><SecuritySettingsPage /></AppLayout></ProtectedRoute>} />
            
            {/* Developer Dashboard routes */}
            <Route path="/developer" element={<ProtectedRoute><AppLayout><DeveloperDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/developer/api-docs" element={<ProtectedRoute><AppLayout><APIDocsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/developer/api-keys" element={<ProtectedRoute><AppLayout><APIKeysPage /></AppLayout></ProtectedRoute>} />
            <Route path="/developer/analytics" element={<ProtectedRoute><AppLayout><AnalyticsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/developer/snippets" element={<ProtectedRoute><AppLayout><SnippetsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/developer/rate-limits" element={<ProtectedRoute><AppLayout><RateLimitsPage /></AppLayout></ProtectedRoute>} />
            
            {/* Catch all - redirect to dashboard or login */}
            <Route 
              path="*" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/auth/login" replace />
              } 
            />
          </Routes>
        </Suspense>
      </main>
      
      {/* Global components */}
      {/* <ServiceWorkerManager />
      <PushNotificationManager />
      <NetworkStatus />
      <BackToTop />
      <CookieConsent /> */}
    </div>
  );
};

function App() {
  console.log('🚀 Envoyou App - User Dashboard');
  
  return (
    // <ErrorBoundary>
      // <ToastProvider>
        <AuthProvider>
          <Router>
            <UpgradeProvider>
              <AppContent />
            </UpgradeProvider>
          </Router>
        </AuthProvider>
      // </ToastProvider>
    // </ErrorBoundary>
  );
}

export default App;
