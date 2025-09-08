import React from 'react';
import { useAuth } from '../hooks/useAuth';

const EmailVerificationBanner = () => {
  const { user } = useAuth();

  // Only show if user exists and email is not verified
  if (!user || user.email_verified) {
    return null;
  }

  const handleResendVerification = () => {
    // TODO: Implement resend verification email
    alert('Fitur kirim ulang email verifikasi akan segera hadir.');
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
              Harap verifikasi email terlebih dahulu
            </h3>
            <div className="mt-2 text-sm text-yellow-300">
              <p>
                Kami telah mengirim email verifikasi ke{' '}
                <span className="font-medium">{user.email}</span>.
                Silakan klik link di email untuk mengaktifkan akun Anda.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={handleResendVerification}
            className="bg-yellow-800 hover:bg-yellow-700 text-yellow-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Kirim Ulang
          </button>
        </div>
      </div>
      <div className="mt-3 text-sm text-yellow-300">
        <p>
          Belum menerima email? Periksa folder spam atau{' '}
          <button
            onClick={handleResendVerification}
            className="font-medium underline hover:text-yellow-200"
          >
            klik di sini untuk kirim ulang
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
