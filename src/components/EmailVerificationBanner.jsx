import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/apiService';

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');

  // Only show if user exists and email is not verified
  if (!user || user.email_verified) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsResending(true);
    setMessage('');

    try {
      await apiService.sendVerificationEmail({ email: user.email });
      setMessage('Verification email has been resent!');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setMessage('Failed to resend verification email. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-900/50 border-l-4 border-yellow-500 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-200">
              Please verify your email first
            </h3>
            <div className="mt-2 text-sm text-yellow-300">
              <p>
                We have sent a verification email to{' '}
                <span className="font-medium">{user.email}</span>.
                Please click the link in the email to activate your account.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="bg-yellow-800 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            {isResending ? 'Sending...' : 'Resend'}
          </button>
        </div>
      </div>
      {message && (
        <div className="mt-3 text-sm text-yellow-200">
          <p>{message}</p>
        </div>
      )}
      <div className="mt-3 text-sm text-yellow-300">
        <p>
          Haven't received the email? Check your spam folder or{' '}
          <button
            onClick={handleResendVerification}
            className="font-medium underline hover:text-yellow-200"
          >
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
