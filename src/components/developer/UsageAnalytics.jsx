import React, { useState, useEffect, useCallback } from 'react';
import UsageChart from '../UsageChart';
import DateRangePicker from '../DateRangePicker';
import apiService from '../../services/apiService';

const UsageAnalytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    avgResponseTime: 0,
    errorRate: 0,
    topEndpoints: []
  });

  const fetchUsageData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch real data from API with date range
      const params = { range: dateRange };
      const analyticsData = await apiService.getUsageAnalytics(params);

      setUsageData(analyticsData.usage_data || generateMockUsageData(dateRange));
      setStats({
        totalRequests: analyticsData.total_requests || 0,
        avgResponseTime: analyticsData.avg_response_time || 245,
        errorRate: analyticsData.error_rate || 0.023,
        topEndpoints: analyticsData.top_endpoints || [
          { endpoint: '/v1/verify', requests: 4520, percentage: 35.2 },
          { endpoint: '/v1/data', requests: 3210, percentage: 25.0 },
          { endpoint: '/v1/auth/login', requests: 2890, percentage: 22.5 },
          { endpoint: '/v1/user/profile', requests: 1780, percentage: 13.8 },
          { endpoint: '/v1/auth/register', requests: 520, percentage: 4.0 }
        ]
      });
    } catch (err) {
      console.error('Failed to fetch usage data:', err);
      // Fallback to mock data
      const mockData = generateMockUsageData(dateRange);
      setUsageData(mockData);
      setStats({
        totalRequests: mockData.reduce((sum, d) => sum + d.value, 0),
        avgResponseTime: 245,
        errorRate: 0.023,
        topEndpoints: [
          { endpoint: '/v1/verify', requests: 4520, percentage: 35.2 },
          { endpoint: '/v1/data', requests: 3210, percentage: 25.0 },
          { endpoint: '/v1/auth/login', requests: 2890, percentage: 22.5 },
          { endpoint: '/v1/user/profile', requests: 1780, percentage: 13.8 },
          { endpoint: '/v1/auth/register', requests: 520, percentage: 4.0 }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  const generateMockUsageData = (range) => {
    const days = range === '7days' ? 7 : range === '30days' ? 30 : 90;
    const data = [];

    for (let i = days; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const value = Math.floor(Math.random() * 200) + 50; // Random between 50-250

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value
      });
    }

    return data;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Usage Analytics</h2>
          <p className="text-slate-400 mt-1">Monitor your API usage patterns and performance metrics</p>
        </div>
        <DateRangePicker
          selectedRange={dateRange}
          onRangeChange={setDateRange}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Requests</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : `${stats.avgResponseTime}ms`}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Error Rate</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : `${(stats.errorRate * 100).toFixed(1)}%`}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : `${((1 - stats.errorRate) * 100).toFixed(1)}%`}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Chart */}
      <UsageChart
        data={usageData}
        title="API Requests Over Time"
        height={350}
      />

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Top Endpoints</h3>
          <div className="space-y-4">
            {stats.topEndpoints.map((endpoint, index) => (
              <div key={endpoint.endpoint} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-medium text-slate-300">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{endpoint.endpoint}</p>
                    <p className="text-slate-400 text-xs">{endpoint.requests.toLocaleString()} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{endpoint.percentage}%</p>
                  <div className="w-20 bg-slate-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${endpoint.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Response Time Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">0-100ms</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                </div>
                <span className="text-slate-400 text-sm w-12 text-right">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">100-500ms</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-1/2"></div>
                </div>
                <span className="text-slate-400 text-sm w-12 text-right">50%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">500ms+</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-1/4"></div>
                </div>
                <span className="text-slate-400 text-sm w-12 text-right">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Log */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Errors</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">POST /v1/verify - Invalid API Key</p>
              <p className="text-slate-400 text-xs">2 hours ago • 401 Unauthorized</p>
            </div>
            <span className="text-red-400 text-xs">High Priority</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">GET /v1/data - Rate Limit Exceeded</p>
              <p className="text-slate-400 text-xs">4 hours ago • 429 Too Many Requests</p>
            </div>
            <span className="text-yellow-400 text-xs">Medium Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;