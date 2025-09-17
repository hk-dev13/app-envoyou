import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const APIKeyManager = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    environment: 'development',
    rateLimit: 1000
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiService.getAPIKeys();
      setApiKeys(keys || []);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      // Mock data for demonstration
      setApiKeys([
        {
          id: 'key_1',
          name: 'Production API Key',
          prefix: 'sk_live_abc123',
          environment: 'production',
          status: 'active',
          createdAt: '2025-09-01T10:00:00Z',
          lastUsed: '2025-09-13T14:30:00Z',
          rateLimit: 10000,
          usage: { current: 1250, limit: 10000 }
        },
        {
          id: 'key_2',
          name: 'Development API Key',
          prefix: 'sk_test_xyz789',
          environment: 'development',
          status: 'active',
          createdAt: '2025-09-05T08:15:00Z',
          lastUsed: '2025-09-13T12:45:00Z',
          rateLimit: 1000,
          usage: { current: 89, limit: 1000 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      const newKey = await apiService.createAPIKey(newKeyData);
      setApiKeys([...apiKeys, newKey]);
      setShowCreateForm(false);
      setNewKeyData({ name: '', environment: 'development', rateLimit: 1000 });
      setMessage('API key created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to create API key:', err);
      setMessage('Failed to create API key. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.deleteAPIKey(keyId);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setMessage('API key deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete API key:', err);
      setMessage('Failed to delete API key. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getEnvironmentColor = (env) => {
    return env === 'production' ? 'text-green-400 bg-green-400/10' : 'text-blue-400 bg-blue-400/10';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-muted-foreground bg-slate-400/10';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground">API Key Management</h2>
          <p className="text-muted-foreground mt-1">Create and manage your API keys for accessing Envoyou services</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary hover:bg-emerald-700 text-primary-foreground text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Key</span>
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-primary/20 border border-emerald-600/50 text-emerald-400' : 'bg-red-600/20 border border-red-600/50 text-red-400'}`}>
          {message}
        </div>
      )}

      {/* Create Key Form */}
      {showCreateForm && (
        <div className="bg-card/50 border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-primary-foreground mb-4">Create New API Key</h3>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Key Name</label>
              <input
                type="text"
                value={newKeyData.name}
                onChange={(e) => setNewKeyData({...newKeyData, name: e.target.value})}
                placeholder="e.g., Production API Key"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-primary-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Environment</label>
              <select
                value={newKeyData.environment}
                onChange={(e) => setNewKeyData({...newKeyData, environment: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-primary-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rate Limit (requests/hour)</label>
              <input
                type="number"
                value={newKeyData.rateLimit}
                onChange={(e) => setNewKeyData({...newKeyData, rateLimit: parseInt(e.target.value)})}
                min="100"
                max="100000"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-primary-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-emerald-700 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
              >
                Create Key
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-card/50 border border-border rounded-lg p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-slate-700 rounded w-48"></div>
                <div className="h-6 bg-slate-700 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : apiKeys.length > 0 ? (
          apiKeys.map((key) => (
            <div key={key.id} className="bg-card/50 border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-primary-foreground">{key.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(key.environment)}`}>
                    {key.environment}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                    {key.status}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteKey(key.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Delete API Key"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">API Key</p>
                  <p className="text-sm font-mono text-slate-300">{key.prefix}****</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="text-sm text-slate-300">{formatDate(key.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Used</p>
                  <p className="text-sm text-slate-300">
                    {key.lastUsed ? formatDate(key.lastUsed) : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Rate Limit</p>
                  <p className="text-sm text-slate-300">{key.rateLimit.toLocaleString()}/hour</p>
                </div>
              </div>

              {/* Usage Progress */}
              {key.usage && (
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Usage this hour</span>
                    <span className="text-sm text-muted-foreground">
                      {key.usage.current} / {key.usage.limit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((key.usage.current / key.usage.limit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card/50 border border-border rounded-lg">
            <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">Create your first API key to start using the Envoyou API</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-primary hover:bg-emerald-700 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
            >
              Create Your First API Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIKeyManager;