import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SettingsLayout({ children }) {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navigationItems = [
        {
            name: 'Profile',
            path: '/settings/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            name: 'Security',
            path: '/settings/security',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            name: 'API Keys',
            path: '/settings/api-keys',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header Spacing */}
            <div className="pt-20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
                        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                            Dashboard
                        </Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">Settings</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                            Account Settings
                        </h1>
                        <p className="text-slate-400">
                            Manage your account preferences and security settings
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                                {/* User Info */}
                                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-800">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {user?.name?.[0] || user?.email?.[0] || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">
                                            {user?.name || user?.email}
                                        </div>
                                        <div className="text-slate-400 text-sm">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Menu */}
                                <nav className="space-y-2">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                isActive(item.path)
                                                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsLayout;
