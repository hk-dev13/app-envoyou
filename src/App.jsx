import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
// // import ErrorBoundary from './components/ErrorBoundary';
// import ServiceWorkerManager from './components/ServiceWorkerManager';
// import PushNotificationManager from './components/PushNotificationManager';
// import NetworkStatus from './components/NetworkStatus';
// import BackToTop from './components/BackToTop';
// import CookieConsent from './components/CookieConsent';
// import { ToastProvider } from './components/Toast';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardUsage = lazy(() => import('./pages/DashboardUsage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const RegisterSuccessPage = lazy(() => import('./pages/auth/RegisterSuccessPage'));
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallbackPage'));
const EmailVerificationPage = lazy(() => import('./pages/auth/EmailVerificationPage'));
const SetPasswordPage = lazy(() => import('./pages/auth/SetPasswordPage'));
const APIKeysSettingsPage = lazy(() => import('./pages/settings/APIKeysSettingsPage'));
const ProfileSettingsPage = lazy(() => import('./pages/settings/ProfileSettingsPage'));
const SecuritySettingsPage = lazy(() => import('./pages/settings/SecuritySettingsPage'));

// Import ProtectedRoute
import ProtectedRoute from './components/auth/ProtectedRoute';

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
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
            <Route path="/verify/:token" element={<EmailVerificationPage />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/usage" element={<ProtectedRoute><DashboardUsage /></ProtectedRoute>} />
            
            {/* Protected settings routes */}
            <Route path="/settings/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
            <Route path="/settings/api-keys" element={<ProtectedRoute><APIKeysSettingsPage /></ProtectedRoute>} />
            <Route path="/settings/security" element={<ProtectedRoute><SecuritySettingsPage /></ProtectedRoute>} />
            
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
            <AppContent />
          </Router>
        </AuthProvider>
      // </ToastProvider>
    // </ErrorBoundary>
  );
}

export default App;
