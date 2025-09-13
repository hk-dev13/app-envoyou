import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback, error } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        navigate('/auth/login', {
          state: { error: `Authentication failed: ${errorDescription || error}` }
        });
        return;
      }

      try {
        const result = await handleAuthCallback();

        if (result.success) {
          console.log('OAuth authentication successful');
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error(result.error || 'Authentication failed');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        navigate('/auth/login', {
          state: {
            error: err.message || 'Social login failed. Please try again or use email and password.'
          }
        });
      }
    };

    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(handleCallback, 100);

    return () => clearTimeout(timeoutId);
  }, [searchParams, navigate, handleAuthCallback]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">
            Completing Authentication...
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Please wait while we verify your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
