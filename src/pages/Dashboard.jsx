import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import EmailVerificationBanner from '../components/EmailVerificationBanner';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats] = useState({
    apiCalls: 1247,
    thisMonth: 89,
    quota: 5000,
    activeKeys: 2
  });

  const quotaPercentage = (stats.thisMonth / stats.quota) * 100;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/svg/logo-full-nb.svg" 
                  alt="Envoyou" 
                  className="h-8 w-auto mr-3"
                />
              </Link>
              <nav className="hidden md:flex space-x-8 ml-10">
                <Link to="/dashboard" className="text-emerald-400 font-medium">Dashboard</Link>
                <Link to="/dashboard/api-keys" className="text-slate-300 hover:text-white transition-colors">API Keys</Link>
                <Link to="/dashboard/usage" className="text-slate-300 hover:text-white transition-colors">Usage</Link>
                <Link to="/dashboard/settings" className="text-slate-300 hover:text-white transition-colors">Settings</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/documentation" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
              
              <div className="relative">
                <button className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-white font-medium hidden md:block">
                    {user?.name}
                  </span>
                </button>
              </div>
              
              <button
                onClick={async () => {
                  try {
                    await logout();
                  } catch (error) {
                    console.error('Logout failed:', error);
                  }
                }}
                className="text-slate-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Here&apos;s what&apos;s happening with your API usage today.
          </p>
        </div>

        {/* Email Verification Banner */}
        <EmailVerificationBanner />

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total API Calls */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total API Calls</p>
                <p className="text-2xl font-bold text-white">{stats.apiCalls.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">This Month</p>
                <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
              </div>
            </div>
          </div>

          {/* Quota Usage */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Quota Used</p>
                <p className="text-2xl font-bold text-white">{quotaPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Active Keys */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Active API Keys</p>
                <p className="text-2xl font-bold text-white">{stats.activeKeys}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* API Keys */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">API Keys</h3>
              <Link
                to="/settings/api-keys"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                Manage Keys
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Production Key</p>
                    <p className="text-xs text-slate-400">envyou_prod_****</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Development Key</p>
                    <p className="text-xs text-slate-400">envyou_dev_****</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Active</span>
              </div>
            </div>
            <Link 
              to="/settings/api-keys"
              className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Manage API Keys
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Recent Activity</h3>
              <Link
                to="/dashboard/usage"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                View details
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">CEVS lookup for Tesla</p>
                  <p className="text-xs text-slate-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Emissions data query</p>
                  <p className="text-xs text-slate-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">ISO certification check</p>
                  <p className="text-xs text-slate-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage chart placeholder */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Usage Overview</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg">
            <div className="text-center">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-slate-400">Usage chart will be displayed here</p>
              <p className="text-sm text-slate-500 mt-1">Coming soon in the next update</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
