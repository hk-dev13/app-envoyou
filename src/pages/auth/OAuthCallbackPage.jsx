import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG } from '../../config';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { googleLogin, githubLogin, error } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/auth/login', {
          state: { error: `Authentication failed: ${error}` }
        });
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        navigate('/auth/login', {
          state: { error: 'No authorization code received' }
        });
        return;
      }

      // Determine provider from URL path
      const pathSegments = location.pathname.split('/');
      const provider = pathSegments[pathSegments.length - 2]; // 'google' or 'github' from /auth/google/callback

      console.log('OAuth callback received:', { provider, code, state });

      try {
        // Call the backend OAuth callback endpoint
        const callbackUrl = `${API_CONFIG.baseURL}/auth/${provider}/callback`;

        const response = await fetch(callbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            state: state
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Authentication failed');
        }

        const result = await response.json();
        console.log('OAuth login result:', result);

        // Store tokens in localStorage
        localStorage.setItem('envoyou_auth_token', result.access_token);
        localStorage.setItem('envoyou_user_data', JSON.stringify(result.user));

        // Navigate to dashboard
        navigate('/dashboard', { replace: true });

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
    const timeoutId = setTimeout(handleOAuthCallback, 100);

    return () => clearTimeout(timeoutId);
  }, [searchParams, location.pathname, navigate]);

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
