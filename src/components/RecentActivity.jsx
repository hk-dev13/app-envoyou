import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivity = ({ activities = [], loading = false }) => {
  // Mock data for demonstration - in real app this would come from API
  const mockActivities = [
    {
      id: 1,
      method: 'POST',
      endpoint: '/v1/verify',
      status: 200,
      timestamp: '2025-09-13T14:30:15Z',
      responseTime: 245
    },
    {
      id: 2,
      method: 'GET',
      endpoint: '/v1/data',
      status: 401,
      timestamp: '2025-09-13T14:25:30Z',
      responseTime: 89
    },
    {
      id: 3,
      method: 'POST',
      endpoint: '/v1/auth/login',
      status: 200,
      timestamp: '2025-09-13T14:20:45Z',
      responseTime: 156
    },
    {
      id: 4,
      method: 'GET',
      endpoint: '/v1/user/profile',
      status: 200,
      timestamp: '2025-09-13T14:15:22Z',
      responseTime: 134
    },
    {
      id: 5,
      method: 'POST',
      endpoint: '/v1/verify',
      status: 429,
      timestamp: '2025-09-13T14:10:18Z',
      responseTime: 23
    }
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-400/10';
    if (status >= 400 && status < 500) return 'text-red-400 bg-red-400/10';
    if (status >= 500) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-muted-foreground bg-slate-400/10';
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'text-blue-400 bg-blue-400/10';
      case 'POST': return 'text-emerald-400 bg-emerald-400/10';
      case 'PUT': return 'text-yellow-400 bg-yellow-400/10';
      case 'DELETE': return 'text-red-400 bg-red-400/10';
      default: return 'text-muted-foreground bg-slate-400/10';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card/50 border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-primary-foreground">Recent API Calls</h3>
        <Link
          to="/developer/analytics"
          className="text-muted-foreground hover:text-slate-300 text-sm font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-12 h-6 bg-slate-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-600 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-6 bg-slate-600 rounded"></div>
              </div>
            </div>
          ))
        ) : displayActivities.length > 0 ? (
          displayActivities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              {/* Method */}
              <div className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(activity.method)}`}>
                {activity.method}
              </div>

              {/* Endpoint & Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-primary-foreground truncate">
                    {activity.endpoint}
                  </p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(activity.timestamp)} • {activity.responseTime}ms
                </p>
              </div>

              {/* Response time indicator */}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  activity.responseTime < 100 ? 'bg-emerald-400' :
                  activity.responseTime < 500 ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs text-muted-foreground">{activity.responseTime}ms</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-muted-foreground text-sm">No recent activity</p>
            <p className="text-slate-500 text-xs mt-1">API calls will appear here</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {displayActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-emerald-400">
                {displayActivities.filter(a => a.status >= 200 && a.status < 300).length}
              </p>
              <p className="text-xs text-muted-foreground">Success</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-400">
                {displayActivities.filter(a => a.status >= 400).length}
              </p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-400">
                {Math.round(displayActivities.reduce((sum, a) => sum + a.responseTime, 0) / displayActivities.length)}ms
              </p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;