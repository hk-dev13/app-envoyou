import React, { useState } from 'react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import { useAuth } from '../../hooks/useAuth';

function SecuritySettingsPage() {
    const { logout } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setMessage('');

        // Validation
        if (newPassword.length < 8) {
            setMessage('New password must be at least 8 characters long.');
            setIsChangingPassword(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            setIsChangingPassword(false);
            return;
        }

        try {
            // Here would be API call to change password
            // await changePassword({ currentPassword, newPassword });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to change password:', error);
            setMessage('Failed to change password. Please check your current password.');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        if (confirm('Are you sure you want to log out from all devices? You will need to log in again.')) {
            try {
                // Here would be API call to logout all sessions
                // await logoutAllDevices();
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                await logout();
            } catch (error) {
                console.error('Failed to logout from all devices:', error);
                setMessage('Failed to logout from all devices. Please try again.');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    const toggleTwoFactor = async () => {
        try {
            // Here would be API call to enable/disable 2FA
            // await toggle2FA(!twoFactorEnabled);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setTwoFactorEnabled(!twoFactorEnabled);
            setMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update two-factor authentication:', error);
            setMessage('Failed to update two-factor authentication settings.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <SettingsLayout>
            <div className="space-y-8">
                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${
                        message.includes('successfully') 
                            ? 'bg-emerald-600/20 border border-emerald-600/30 text-emerald-400'
                            : 'bg-red-600/20 border border-red-600/30 text-red-400'
                    }`}>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d={message.includes('successfully') 
                                        ? "M5 13l4 4L19 7" 
                                        : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} 
                                />
                            </svg>
                            {message}
                        </div>
                    </div>
                )}

                {/* Change Password Section */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-white mb-2">Change Password</h2>
                        <p className="text-slate-400">
                            Ensure your account is using a long, random password to stay secure.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                    placeholder="Enter your current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCurrentPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                                        {!showCurrentPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                    placeholder="Enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNewPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                                        {!showNewPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                                        {!showConfirmPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">Password Requirements:</h4>
                            <ul className="text-slate-400 text-sm space-y-1">
                                <li className="flex items-center">
                                    <svg className={`w-4 h-4 mr-2 ${newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    At least 8 characters long
                                </li>
                                <li className="flex items-center">
                                    <svg className={`w-4 h-4 mr-2 ${/[A-Z]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    At least one uppercase letter
                                </li>
                                <li className="flex items-center">
                                    <svg className={`w-4 h-4 mr-2 ${/[a-z]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    At least one lowercase letter
                                </li>
                                <li className="flex items-center">
                                    <svg className={`w-4 h-4 mr-2 ${/\d/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    At least one number
                                </li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isChangingPassword && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-2">Two-Factor Authentication</h2>
                            <p className="text-slate-400">
                                Add an extra layer of security to your account by enabling two-factor authentication.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={toggleTwoFactor}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-emerald-600/20 border border-emerald-600/30 rounded-lg">
                            <div className="flex items-center text-emerald-400">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Two-factor authentication is enabled and protecting your account.
                            </div>
                        </div>
                    )}
                </div>

                {/* Session Management */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-white mb-2">Session Management</h2>
                        <p className="text-slate-400">
                            Manage your active sessions and logout from all devices if needed.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Current Session */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <div>
                                    <div className="text-white font-medium">Current Session</div>
                                    <div className="text-slate-400 text-sm">Browser • Last active now</div>
                                </div>
                            </div>
                            <span className="text-emerald-400 text-sm font-medium">Active</span>
                        </div>

                        {/* Logout All Devices */}
                        <button
                            onClick={handleLogoutAllDevices}
                            className="inline-flex items-center px-4 py-2 border border-red-600 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout from All Devices
                        </button>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}

export default SecuritySettingsPage;
