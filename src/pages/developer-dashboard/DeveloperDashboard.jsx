import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeveloperLayout from '../../components/developer/DeveloperLayout';
import DeveloperStatsCards from '../../components/developer/DeveloperStatsCards';
import UsageAnalytics from '../../components/developer/UsageAnalytics';
import APIDocumentation from '../../components/developer/APIDocumentation';
import APIKeyManager from '../../components/developer/APIKeyManager';
import CodeSnippets from '../../components/developer/CodeSnippets';
import RateLimitMonitor from '../../components/developer/RateLimitMonitor';
import apiService from '../../services/apiService';

const DeveloperDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEndpoints: 0,
    activeKeys: 0,
    totalRequests: 0,
    errorRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloperStats = async () => {
      try {
        setLoading(true);
        // Fetch real data from API
        const developerStats = await apiService.getDeveloperStats();
        setStats({
          totalEndpoints: developerStats.total_endpoints || 24,
          activeKeys: developerStats.active_keys || 0,
          totalRequests: developerStats.total_requests || 0,
          errorRate: developerStats.error_rate || 0
        });
      } catch (err) {
        console.error('Failed to fetch developer stats:', err);
        // Fallback to demo data
        setStats({
          totalEndpoints: 24,
          activeKeys: 2,
          totalRequests: 15420,
          errorRate: 0.02
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperStats();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'api-docs', label: 'API Docs', icon: '📚' },
    { id: 'api-keys', label: 'API Keys', icon: '🔑' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'snippets', label: 'Code Snippets', icon: '💻' },
    { id: 'rate-limits', label: 'Rate Limits', icon: '⚡' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DeveloperStatsCards stats={stats} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="https://api.envoyou.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">OpenAPI Documentation</p>
                      <p className="text-slate-400 text-sm">Interactive API docs with Swagger UI</p>
                    </div>
                  </a>
                  <Link
                    to="/developer-dashboard/api-keys"
                    className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Manage API Keys</p>
                      <p className="text-slate-400 text-sm">Create and manage your API keys</p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Getting Started</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                    <div>
                      <p className="text-white font-medium">Get API Key</p>
                      <p className="text-slate-400 text-sm">Create your first API key to start integrating</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                    <div>
                      <p className="text-white font-medium">Read Documentation</p>
                      <p className="text-slate-400 text-sm">Explore available endpoints and parameters</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                    <div>
                      <p className="text-white font-medium">Start Building</p>
                      <p className="text-slate-400 text-sm">Use code snippets to integrate quickly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'api-docs':
        return <APIDocumentation />;
      case 'api-keys':
        return <APIKeyManager />;
      case 'analytics':
        return <UsageAnalytics />;
      case 'snippets':
        return <CodeSnippets />;
      case 'rate-limits':
        return <RateLimitMonitor />;
      default:
        return <DeveloperStatsCards stats={stats} loading={loading} />;
    }
  };

  return (
    <DeveloperLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage your API keys, monitor usage, and access documentation</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </DeveloperLayout>
  );
};

export default DeveloperDashboard;