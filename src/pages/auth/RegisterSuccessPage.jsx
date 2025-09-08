import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterSuccessPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated or already verified, redirect appropriately
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (user?.email_verified) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ✅ Account Created Successfully!
          </h2>
          <p className="text-slate-400">
            Welcome to Envoyou, <span className="text-emerald-400 font-medium">{user?.name}</span>!
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="text-left space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Check Your Email</h3>
                <p className="text-slate-400 text-sm">
                  We&apos;ve sent a verification email to{' '}
                  <span className="text-emerald-400 font-medium">{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-medium">2</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Click Verification Link</h3>
                <p className="text-slate-400 text-sm">
                  Click the link in your email to activate your account
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-medium">3</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Login & Get Started</h3>
                <p className="text-slate-400 text-sm">
                  After verification, you can login and start using our services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="text-sm text-slate-400">
            Didn&apos;t receive the email?{' '}
            <button className="text-emerald-400 hover:text-emerald-300 font-medium">
              Resend verification email
            </button>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors border border-slate-700"
            >
              View Dashboard
            </Link>
            <Link
              to="/auth/login"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Login Now
            </Link>
          </div>
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

export default RegisterSuccessPage;
