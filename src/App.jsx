import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
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
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
      <p className="text-slate-300">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
            <div className="min-h-screen flex flex-col bg-background">
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
            
            {/* Handle production domain verification links */}
            <Route path="/auth/verify/:token" element={<EmailVerificationPage />} />
            <Route path="/auth/confirm" element={<EmailVerificationPage />} />
            
            {/* Catch-all route for production domain redirects */}
            <Route path="*" element={
              window.location.hostname === 'envoyou.com' ? (
                <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
                  <div className="max-w-md w-full space-y-6 text-center">
                    <div className="bg-red-600 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-primary-foreground">Wrong Domain</h1>
                    <p className="text-muted-foreground">
                      You&apos;re on the production domain. Please use your local development server instead.
                    </p>
                    <div className="bg-card p-4 rounded-lg border border-border text-left">
                      <p className="text-slate-300 text-sm mb-2">To access the application:</p>
                      <ol className="text-muted-foreground text-sm space-y-1 list-decimal list-inside">
                        <li>Go to: <code className="bg-slate-700 px-2 py-1 rounded text-xs">http://localhost:5173</code></li>
                        <li>If you&apos;re verifying email, use: <code className="bg-slate-700 px-2 py-1 rounded text-xs">http://localhost:5173/verify/[token]</code></li>
                      </ol>
                    </div>
                    <button
                      onClick={() => window.location.href = 'http://localhost:5173'}
                      className="bg-blue-600 hover:bg-blue-700 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Go to Local Development
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-screen bg-background flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-primary-foreground mb-4">Page Not Found</h1>
                    <p className="text-muted-foreground mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
                    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
                      Go Home
                    </Link>
                  </div>
                </div>
              )
            } />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardHome /></AppLayout></ProtectedRoute>} />
            {/* Legacy redirects */}
            <Route path="/dashboard/usage" element={<Navigate to="/developer/analytics" replace />} />
            <Route path="/dashboard/monitoring" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/analytics" element={<Navigate to="/developer/analytics" replace />} />
            <Route path="/dashboard/reporting" element={<Navigate to="/dashboard" replace />} />
            
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
