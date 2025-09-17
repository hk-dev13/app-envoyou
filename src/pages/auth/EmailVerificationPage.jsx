import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import apiService from '../../services/apiService';

const EmailVerificationPage = () => {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Extract token from URL parameters or route
  const token = routeToken || searchParams.get('token') || searchParams.get('access_token') || searchParams.get('confirmation_token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email for the correct verification link.');
        return;
      }

      try {
        // Call the API to verify email
        const response = await apiService.verifyEmail({ token });

        if (response.message === 'Email verified successfully' || response.success) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in to your account.');
        } else {
          throw new Error('Verification failed');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');

        // Check if this is a production domain issue
        if (window.location.hostname === 'envoyou.com' || window.location.hostname.includes('supabase')) {
          setMessage(
            <div className="text-left space-y-3">
              <p className="text-red-400 mb-3">
                You&apos;re on the production domain. Please use the local development server instead.
              </p>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-slate-300 text-sm mb-2">To verify your email:</p>
                <ol className="text-muted-foreground text-sm space-y-1 list-decimal list-inside">
                  <li>Open your local development server: <code className="bg-slate-700 px-2 py-1 rounded text-xs">http://localhost:5173</code></li>
                  <li>Navigate to: <code className="bg-slate-700 px-2 py-1 rounded text-xs">http://localhost:5173/verify/{token}</code></li>
                  <li>Or click the button below to copy the local URL</li>
                </ol>
              </div>
              <button
                onClick={() => {
                  const localUrl = `http://localhost:5173/verify/${token}`;
                  navigator.clipboard.writeText(localUrl);
                  alert('Local verification URL copied to clipboard!');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Copy Local Verification URL
              </button>
            </div>
          );
        } else {
          setMessage('Verification link is invalid or has expired. Please try again or request a new verification email.');
        }
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async () => {
    if (!userEmail && status !== 'error') {
      setMessage('Please provide your email address to resend verification.');
      return;
    }

    setIsResending(true);
    try {
      // For error state, we need to get email from user input
      let emailToUse = userEmail;

      if (status === 'error' && !emailToUse) {
        // In a real app, you'd show an input field for email
        // For now, we'll use a placeholder approach
        setMessage('Please enter your email address first.');
        setIsResending(false);
        return;
      }

      const response = await apiService.sendVerificationEmail({ email: emailToUse });

      if (response.message === 'Verification email sent successfully') {
        setMessage('Verification email sent successfully! Please check your inbox.');
        setStatus('success');
      } else {
        throw new Error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage('Failed to send verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Status Icon */}
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          {status === 'verifying' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          )}
          {status === 'success' && (
            <div className="bg-green-600 rounded-full p-4">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-600 rounded-full p-4">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && '🎉 Email Verified Successfully!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          <p className="text-muted-foreground">
            {status === 'verifying' && 'Please wait a moment...'}
            {status === 'success' && 'Congratulations! Your account is now active.'}
            {status === 'error' && 'There was an error verifying your email.'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            status === 'success'
              ? 'bg-green-900/50 border border-green-500 text-green-200'
              : status === 'error'
              ? 'bg-red-900/50 border border-red-500 text-red-200'
              : 'bg-card/50 border border-border text-slate-300'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Email Input for Resend (only show when needed) */}
        {status === 'error' && (
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-primary-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {status === 'success' && (
            <Link
              to="/auth/login"
              className="w-full bg-primary hover:bg-emerald-700 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center"
            >
              Login Now
            </Link>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
              <Link
                to="/auth/login"
                className="w-full bg-primary hover:bg-emerald-700 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center"
              >
                Back to Login
              </Link>
            </div>
          )}

          {status === 'verifying' && (
            <div className="text-sm text-muted-foreground">
              <p>Processing your email verification...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500">
          <p>
            Need help?{' '}
            <Link to="/contact" className="text-emerald-400 hover:text-emerald-300">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
