import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import apiService from '../../services/apiService';

function ProfileSettingsPage() {
    const { user, checkAuthStatus } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        job_title: '',
        timezone: '',
        language: 'en'
    });

    // Load user profile data
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profileData = await apiService.getUserProfile();
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                company: profileData.company || '',
                job_title: profileData.job_title || '',
                timezone: profileData.timezone || 'UTC',
                language: profileData.language || 'en'
            });
        } catch (error) {
            console.error('Failed to load profile:', error);
            setMessage('Failed to load profile data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        
        try {
            await apiService.updateUserProfile(formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            // Refresh auth context to update user data
            await checkAuthStatus();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage(error.message || 'Failed to update profile. Please try again.');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            company: user?.company || '',
            job_title: user?.job_title || '',
            timezone: user?.timezone || 'UTC',
            language: user?.language || 'en'
        });
        setIsEditing(false);
        setMessage('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Profile Information</h2>
                        <p className="text-muted-foreground">
                            Update your account&apos;s profile information and email address.
                        </p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${
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

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Avatar Section */}
                    <div className="md:col-span-2 mb-6">
                        <label className="block text-sm font-medium text-white mb-2">
                            Profile Picture
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl font-medium">
                                    {formData.name?.[0] || formData.email?.[0] || 'U'}
                                </span>
                            </div>
                            <div>
                                <button className="inline-flex items-center px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Change Avatar
                                </button>
                                <p className="text-muted-foreground text-sm mt-1">
                                    PNG, JPG up to 2MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Company
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter your company name"
                        />
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter your job title"
                        />
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Timezone
                        </label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Asia/Shanghai">Shanghai</option>
                            <option value="Australia/Sydney">Sydney</option>
                        </select>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Language
                        </label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="it">Italiano</option>
                            <option value="pt">Português</option>
                            <option value="ru">Русский</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                            <option value="zh">中文</option>
                            <option value="ar">العربية</option>
                            <option value="hi">हिन्दी</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileSettingsPage;
