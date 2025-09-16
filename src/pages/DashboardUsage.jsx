import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import apiService from '../services/apiService';

const DashboardUsage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    apiCalls: 0,
    thisMonth: 0,
    quota: 5000,
    activeKeys: 0
  });
  const [loading, setLoading] = useState(true);
  // const [fetchError, setFetchError] = useState(null); // Not displayed yet

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const userStats = await apiService.getUserStats();
        const apiKeys = await apiService.getApiKeys();
        
        setStats({
          apiCalls: userStats.total_calls || 0,
          thisMonth: userStats.monthly_calls || 0,
          quota: userStats.quota || 5000,
          activeKeys: apiKeys.length || 0
        });
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
        
        // Check if it's an authentication error
        if (err?.type === 'authentication_error' || err?.code === 'AUTH_REQUIRED') {
          // TODO: Surface session expiry to user
          // Don't auto-redirect from dashboard, let user handle it
        } else if (err?.code === 'ACCESS_DENIED') {
          // TODO: Surface missing API key message
        } else {
          // TODO: Surface generic error message
        }
        
        // Keep dummy data as fallback
        setStats({
          apiCalls: 1247,
          thisMonth: 89,
          quota: 5000,
          activeKeys: 2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const quotaPercentage = (stats.thisMonth / stats.quota) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">API Usage</h1>
          <p className="text-slate-400 mt-2">Monitor your API usage and manage your quota</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total API Calls */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total API Calls</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-700 rounded w-20"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-white">{stats.apiCalls.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">This Month</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-700 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quota Usage */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Quota Used</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-700 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-white">{quotaPercentage.toFixed(1)}%</p>
                )}
              </div>
            </div>
          </div>

          {/* Active Keys */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Active Keys</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-700 rounded w-8"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-white">{stats.activeKeys}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Usage chart placeholder */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h3 className="text-lg font-medium text-white mb-4">Usage Overview</h3>
          <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center">
            <p className="text-slate-400">Usage chart will be displayed here</p>
          </div>
        </div>
    </div>
  );
};

export default DashboardUsage;
