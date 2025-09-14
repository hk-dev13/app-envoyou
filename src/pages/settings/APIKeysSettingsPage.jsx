import React, { useState, useEffect } from 'react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import apiService from '../../services/apiService';

function APIKeysSettingsPage() {
    const [apiKeys, setApiKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingKey, setIsCreatingKey] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyEnvironment, setNewKeyEnvironment] = useState('development');
    const [message, setMessage] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Helper function to calculate usage percentage
    const getUsagePercentage = (usage, limit) => {
        if (!limit || limit === 0) return 0;
        return Math.min((usage / limit) * 100, 100);
    };

    // Load API keys on component mount
    useEffect(() => {
        loadApiKeys();
    }, []);

    const loadApiKeys = async () => {
        try {
            setIsLoading(true);
            const keys = await apiService.getApiKeys();
            setApiKeys(keys);
        } catch (error) {
            console.error('Failed to load API keys:', error);
            setMessage('Failed to load API keys');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        if (!newKeyName.trim()) {
            setMessage('Please enter a name for the API key');
            return;
        }

        setIsCreatingKey(true);
        setMessage('');

        try {
            const newKey = await apiService.createApiKey({
                name: newKeyName.trim(),
                environment: newKeyEnvironment
            });

            setApiKeys(prev => [...prev, newKey]);
            setNewKeyName('');
            setNewKeyEnvironment('development');
            setShowCreateForm(false);
            setMessage('API key created successfully! Make sure to copy it now as you won\'t be able to see it again.');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Failed to create API key:', error);
            setMessage(error.message || 'Failed to create API key. Please try again.');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsCreatingKey(false);
        }
    };

    const handleDeleteKey = async (keyId) => {
        if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
            try {
                await apiService.deleteApiKey(keyId);
                setApiKeys(prev => prev.filter(key => key.id !== keyId));
                setMessage('API key deleted successfully.');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Failed to delete API key:', error);
                setMessage(error.message || 'Failed to delete API key. Please try again.');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setMessage('API key copied to clipboard!');
            setTimeout(() => setMessage(''), 2000);
        });
    };

    return (
        <SettingsLayout>
            <div className="space-y-8">
                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${
                        message.includes('successfully') || message.includes('copied')
                            ? 'bg-emerald-600/20 border border-emerald-600/30 text-emerald-400'
                            : 'bg-red-600/20 border border-red-600/30 text-red-400'
                    }`}>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d={message.includes('successfully') || message.includes('copied')
                                        ? "M5 13l4 4L19 7" 
                                        : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} 
                                />
                            </svg>
                            {message}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-2">API Keys</h2>
                            <p className="text-slate-400">
                                Manage your API keys for accessing Envoyou&apos;s CV Enhancement API.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Key
                        </button>
                    </div>

                    {/* Create New Key Form */}
                    {showCreateForm && (
                        <form onSubmit={handleCreateKey} className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <h3 className="text-lg font-medium text-white mb-4">Create New API Key</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Key Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                        placeholder="e.g., Production API Key"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Environment
                                    </label>
                                    <select
                                        value={newKeyEnvironment}
                                        onChange={(e) => setNewKeyEnvironment(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                    >
                                        <option value="development">Development (1,000 requests/month)</option>
                                        <option value="production">Production (5,000 requests/month)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    type="submit"
                                    disabled={isCreatingKey || !newKeyName.trim()}
                                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreatingKey && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isCreatingKey ? 'Creating...' : 'Create API Key'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* API Keys List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                                <p className="text-slate-300">Loading API keys...</p>
                            </div>
                        ) : apiKeys.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <h3 className="text-lg font-medium text-white mb-2">No API Keys</h3>
                                <p className="text-slate-400 mb-4">
                                    You haven&apos;t created any API keys yet. Create your first key to start using our API.
                                </p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Your First API Key
                                </button>
                            </div>
                        ) : (
                            apiKeys.map((apiKey) => {
                                const usagePercentage = getUsagePercentage(apiKey.usage, apiKey.limit);
                                
                                return (
                                    <div key={apiKey.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-medium text-white">{apiKey.name}</h3>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    apiKey.status === 'active' 
                                                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                                                        : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                                                }`}>
                                                    {apiKey.status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 mb-3">
                                                <code className="text-slate-300 bg-slate-900 px-2 py-1 rounded text-sm font-mono">
                                                    {apiKey.key}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(apiKey.key)}
                                                    className="p-1 text-slate-400 hover:text-white transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-400">Created:</span>
                                                    <span className="text-white ml-2">{new Date(apiKey.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Last Used:</span>
                                                    <span className="text-white ml-2">{apiKey.last_used ? new Date(apiKey.last_used).toLocaleDateString() : 'Never'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Usage Count:</span>
                                                    <span className="text-white ml-2">{apiKey.usage_count}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteKey(apiKey.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                            title="Delete API key"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Usage Bar */}
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-slate-400">Usage</span>
                                            <span className="text-white">
                                                {apiKey.usage_count} requests
                                            </span>
                                        </div>
                                        <div className="text-right text-xs text-slate-500 mt-1">
                                            {usagePercentage.toFixed(1)}% used
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        )}
                    </div>
                </div>

                {/* API Documentation Section */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">Using Your API Keys</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-white mb-2">Authentication</h3>
                            <p className="text-slate-400 mb-3">
                                Include your API key in the Authorization header of your requests:
                            </p>
                            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                                <div className="text-slate-300">
                                    <span className="text-emerald-400">curl</span> -H <span className="text-yellow-400">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span> \<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-H <span className="text-yellow-400">&quot;Content-Type: application/json&quot;</span> \<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">https://api.envoyou.com/v1/cv/enhance</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-white mb-2">Rate Limits</h3>
                            <ul className="text-slate-400 space-y-1">
                                <li>• <strong className="text-white">Development:</strong> 1,000 requests per month</li>
                                <li>• <strong className="text-white">Production:</strong> 5,000 requests per month</li>
                                <li>• <strong className="text-white">Rate limit:</strong> 100 requests per minute</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-white mb-2">Need More?</h3>
                            <p className="text-slate-400 mb-3">
                                If you need higher limits, contact our sales team for enterprise plans.
                            </p>
                            <a
                                href="/contact"
                                className="inline-flex items-center px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.964L3 20l1.964-5.874A8.955 8.955 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
                                </svg>
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}

export default APIKeysSettingsPage;
