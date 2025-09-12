import React, { useState } from 'react';

const APIDocumentation = () => {
  const [viewMode, setViewMode] = useState('swagger'); // 'swagger' or 'manual'
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const swaggerUrl = 'https://api.envoyou.com/docs';

  // Mock API endpoints data - in real app this would come from API
  const endpoints = [
    {
      id: 'auth-register',
      method: 'POST',
      path: '/v1/auth/register',
      category: 'Authentication',
      description: 'Register a new user account',
      parameters: [
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'password', type: 'string', required: true, description: 'User password (min 8 chars)' },
        { name: 'name', type: 'string', required: true, description: 'Full name' }
      ],
      responses: {
        200: 'User registered successfully',
        400: 'Validation error',
        409: 'Email already exists'
      }
    },
    {
      id: 'auth-login',
      method: 'POST',
      path: '/v1/auth/login',
      category: 'Authentication',
      description: 'Authenticate user and get access token',
      parameters: [
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'password', type: 'string', required: true, description: 'User password' }
      ],
      responses: {
        200: 'Login successful',
        401: 'Invalid credentials',
        429: 'Too many attempts'
      }
    },
    {
      id: 'verify-data',
      method: 'POST',
      path: '/v1/verify',
      category: 'Data Verification',
      description: 'Verify environmental data against multiple sources',
      parameters: [
        { name: 'facility_name', type: 'string', required: true, description: 'Facility name to verify' },
        { name: 'location', type: 'object', required: false, description: 'Location coordinates' },
        { name: 'data_type', type: 'string', required: false, description: 'Type of data to verify' }
      ],
      responses: {
        200: 'Verification completed',
        400: 'Invalid parameters',
        403: 'API key required'
      }
    },
    {
      id: 'get-data',
      method: 'GET',
      path: '/v1/data',
      category: 'Data Retrieval',
      description: 'Retrieve environmental data with filters',
      parameters: [
        { name: 'limit', type: 'integer', required: false, description: 'Number of results (max 100)' },
        { name: 'offset', type: 'integer', required: false, description: 'Pagination offset' },
        { name: 'country', type: 'string', required: false, description: 'Filter by country' }
      ],
      responses: {
        200: 'Data retrieved successfully',
        400: 'Invalid parameters',
        403: 'API key required'
      }
    }
  ];

  const categories = [...new Set(endpoints.map(e => e.category))];
  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'text-blue-400 bg-blue-400/10';
      case 'POST': return 'text-emerald-400 bg-emerald-400/10';
      case 'PUT': return 'text-yellow-400 bg-yellow-400/10';
      case 'DELETE': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">API Documentation</h2>
          <p className="text-slate-400 mt-1">Complete API reference with interactive examples</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('swagger')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'swagger'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Docs
          </button>
          <button
            onClick={() => setViewMode('manual')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'manual'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Reference
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'swagger' ? (
        <div className="space-y-4">
          {/* Swagger UI Iframe */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Interactive API Documentation</h3>
                <a
                  href={swaggerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center space-x-1"
                >
                  <span>Open in new tab</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="relative" style={{ height: '600px' }}>
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
                    <p className="text-slate-300">Loading API documentation...</p>
                  </div>
                </div>
              )}

              {iframeError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-slate-300 mb-2">Failed to load interactive documentation</p>
                    <button
                      onClick={() => {
                        setIframeError(false);
                        setIframeLoading(true);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 text-sm"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  src={swaggerUrl}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title="EnvoyOU API Documentation"
                />
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Getting Started</h4>
              <p className="text-slate-400 text-sm mb-3">New to our API? Start here.</p>
              <a
                href={`${swaggerUrl}#/Authentication/post_v1_auth_login`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Authentication →
              </a>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Data Verification</h4>
              <p className="text-slate-400 text-sm mb-3">Verify environmental data.</p>
              <a
                href={`${swaggerUrl}#/Data%20Verification/post_v1_verify`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Verify Data →
              </a>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Data Retrieval</h4>
              <p className="text-slate-400 text-sm mb-3">Fetch environmental data.</p>
              <a
                href={`${swaggerUrl}#/Data%20Retrieval/get_v1_data`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Get Data →
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Manual Documentation View */
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="relative">
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                searchTerm === '' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  searchTerm === category ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Endpoints List */}
          <div className="space-y-4">
            {filteredEndpoints.map(endpoint => (
              <div
                key={endpoint.id}
                className={`bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-colors ${
                  activeEndpoint === endpoint.id ? 'border-emerald-500/50' : ''
                }`}
              >
                <button
                  onClick={() => setActiveEndpoint(activeEndpoint === endpoint.id ? null : endpoint.id)}
                  className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="text-white font-mono text-sm">{endpoint.path}</span>
                    <span className="text-slate-400 text-sm">{endpoint.category}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{endpoint.description}</p>
                </button>

                {activeEndpoint === endpoint.id && (
                  <div className="px-4 pb-4 border-t border-slate-700">
                    {/* Parameters */}
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-2">Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param, index) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <span className="text-emerald-400 font-mono min-w-0 flex-shrink-0">{param.name}</span>
                              <span className={`px-2 py-1 rounded text-xs ${param.required ? 'text-red-400 bg-red-400/10' : 'text-slate-400 bg-slate-400/10'}`}>
                                {param.type}
                              </span>
                              {param.required && <span className="text-red-400 text-xs">required</span>}
                              <span className="text-slate-300 flex-1">{param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Responses</h4>
                      <div className="space-y-1">
                        {Object.entries(endpoint.responses).map(([code, description]) => (
                          <div key={code} className="flex items-center space-x-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              code.startsWith('2') ? 'text-emerald-400 bg-emerald-400/10' :
                              code.startsWith('4') ? 'text-red-400 bg-red-400/10' :
                              'text-yellow-400 bg-yellow-400/10'
                            }`}>
                              {code}
                            </span>
                            <span className="text-slate-300">{description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredEndpoints.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.5-2.5m-.5 5.5v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <p className="text-slate-400">No endpoints found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APIDocumentation;