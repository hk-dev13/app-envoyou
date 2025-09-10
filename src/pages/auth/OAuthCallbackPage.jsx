import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
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

      try {
        let result;
        if (state === 'google') {
          result = await googleLogin(code);
        } else if (state === 'github') {
          result = await githubLogin(code);
        } else {
          throw new Error('Unknown OAuth provider');
        }

        if (result.success) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/auth/login', {
            state: { error: result.error || 'Authentication failed' }
          });
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        navigate('/auth/login', {
          state: { error: 'Authentication failed. Please try again.' }
        });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, googleLogin, githubLogin]);

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
