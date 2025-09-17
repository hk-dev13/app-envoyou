import React, { useState, useEffect } from 'react';

function NotificationsSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [notificationSettings, setNotificationSettings] = useState({
        // Email Notifications
        email_weekly_summary: true,
        email_api_usage_alerts: true,
        email_product_updates: false,
        email_security_alerts: true,
        email_billing_notifications: true,

        // In-App Notifications
        in_app_api_limit_warnings: true,
        in_app_system_maintenance: true,
        in_app_new_features: false,
        in_app_account_activity: true,

        // Push Notifications (if supported)
        push_critical_alerts: true,
        push_system_downtime: true
    });

    // Load notification preferences
    useEffect(() => {
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        try {
            // In a real app, this would fetch from the API
            // For now, we'll use localStorage or default values
            const savedSettings = localStorage.getItem('notification_settings');
            if (savedSettings) {
                setNotificationSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Failed to load notification settings:', error);
        }
    };

    const handleSettingChange = (settingKey, value) => {
        setNotificationSettings(prev => ({
            ...prev,
            [settingKey]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');

        try {
            // Save to localStorage (in real app, this would be an API call)
            localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));

            // In a real app, you would call:
            // await apiService.updateNotificationSettings(notificationSettings);

            setMessage('Notification preferences saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save notification settings:', error);
            setMessage('Failed to save notification preferences. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const NotificationSection = ({ title, description, children }) => (
        <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    const NotificationToggle = ({ label, description, checked, onChange, disabled = false }) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <div className="text-primary-foreground font-medium">{label}</div>
                {description && (
                    <div className="text-muted-foreground text-sm mt-1">{description}</div>
                )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div className={`w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
            </label>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="max-w-4xl space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-primary-foreground mb-2">Notifications</h2>
                    <p className="text-muted-foreground">
                        Choose how you want to be notified about important updates and activities.
                    </p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg border ${
                        message.includes('successfully')
                            ? 'bg-green-600/20 border-green-600/30 text-green-400'
                            : 'bg-red-600/20 border-red-600/30 text-red-400'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Email Notifications */}
                <NotificationSection
                    title="Email Notifications"
                    description="Receive important updates and alerts via email"
                >
                    <NotificationToggle
                        label="Weekly Summary"
                        description="Get a weekly summary of your API usage and account activity"
                        checked={notificationSettings.email_weekly_summary}
                        onChange={(value) => handleSettingChange('email_weekly_summary', value)}
                    />

                    <NotificationToggle
                        label="API Usage Alerts"
                        description="Get notified when you're approaching API rate limits"
                        checked={notificationSettings.email_api_usage_alerts}
                        onChange={(value) => handleSettingChange('email_api_usage_alerts', value)}
                    />

                    <NotificationToggle
                        label="Product Updates"
                        description="Receive news about new features and product improvements"
                        checked={notificationSettings.email_product_updates}
                        onChange={(value) => handleSettingChange('email_product_updates', value)}
                    />

                    <NotificationToggle
                        label="Security Alerts"
                        description="Important security notifications and account changes"
                        checked={notificationSettings.email_security_alerts}
                        onChange={(value) => handleSettingChange('email_security_alerts', value)}
                    />

                    <NotificationToggle
                        label="Billing Notifications"
                        description="Payment confirmations, invoice receipts, and billing updates"
                        checked={notificationSettings.email_billing_notifications}
                        onChange={(value) => handleSettingChange('email_billing_notifications', value)}
                    />
                </NotificationSection>

                {/* In-App Notifications */}
                <NotificationSection
                    title="In-App Notifications"
                    description="Receive notifications within the application"
                >
                    <NotificationToggle
                        label="API Limit Warnings"
                        description="Get warned when approaching API usage limits"
                        checked={notificationSettings.in_app_api_limit_warnings}
                        onChange={(value) => handleSettingChange('in_app_api_limit_warnings', value)}
                    />

                    <NotificationToggle
                        label="System Maintenance"
                        description="Notifications about scheduled maintenance and system updates"
                        checked={notificationSettings.in_app_system_maintenance}
                        onChange={(value) => handleSettingChange('in_app_system_maintenance', value)}
                    />

                    <NotificationToggle
                        label="New Features"
                        description="Announcements about new features and capabilities"
                        checked={notificationSettings.in_app_new_features}
                        onChange={(value) => handleSettingChange('in_app_new_features', value)}
                    />

                    <NotificationToggle
                        label="Account Activity"
                        description="Notifications about login attempts and account changes"
                        checked={notificationSettings.in_app_account_activity}
                        onChange={(value) => handleSettingChange('in_app_account_activity', value)}
                    />
                </NotificationSection>

                {/* Push Notifications (Future) */}
                <NotificationSection
                    title="Push Notifications"
                    description="Receive push notifications on your devices (coming soon)"
                >
                    <NotificationToggle
                        label="Critical Alerts"
                        description="Emergency notifications and critical system alerts"
                        checked={notificationSettings.push_critical_alerts}
                        onChange={(value) => handleSettingChange('push_critical_alerts', value)}
                        disabled={true}
                    />

                    <NotificationToggle
                        label="System Downtime"
                        description="Notifications when services are experiencing downtime"
                        checked={notificationSettings.push_system_downtime}
                        onChange={(value) => handleSettingChange('push_system_downtime', value)}
                        disabled={true}
                    />

                    <div className="mt-4 p-3 bg-card/50 rounded-lg border border-border">
                        <p className="text-muted-foreground text-sm">
                            Push notifications are currently in development and will be available in a future update.
                        </p>
                    </div>
                </NotificationSection>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-border">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-primary hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        {isSaving ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Preferences'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotificationsSettingsPage;