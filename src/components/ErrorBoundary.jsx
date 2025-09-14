import React from 'react';
import logger from '../services/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log to our logger service
    logger.error('React Error Boundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Expose last error globally for production diagnostics
    try {
      window.__envoyouLastError = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        time: new Date().toISOString()
      };
    } catch (_) { // eslint-disable-line no-unused-vars
      // no-op
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // If this is an auth-related error, try to reset loading state
    if (error.message.includes('Cannot read properties of null') ||
        error.message.includes('response') ||
        error.message.includes('session')) {
      console.warn('Auth-related error detected, attempting to reset auth state');

      // Try to reset any stuck loading states
      try {
        // Force reload if it's an auth error to reset state
        if (window.location.pathname.includes('/auth/') ||
            window.location.pathname.includes('/dashboard')) {
          console.log('Reloading page to reset auth state');
          window.location.reload();
        }
      } catch (reloadError) {
        console.error('Failed to reload page:', reloadError);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const showDebug = typeof window !== 'undefined' && (window.location.search.includes('debug=1') || process.env.NODE_ENV === 'development');
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="text-red-400">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-slate-400">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            {showDebug && (
              <details className="mt-4 text-left">
                <summary className="text-slate-400 cursor-pointer">Error Details (Debug)</summary>
                <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-4 rounded overflow-auto whitespace-pre-wrap break-all">
{this.state.error && this.state.error.toString()}\n\nStack:\n{this.state.error?.stack}\n\nComponent Stack:\n{this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            {showDebug && (
              <p className="text-xs text-slate-500">Append ?debug=1 to URL to view details.</p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;