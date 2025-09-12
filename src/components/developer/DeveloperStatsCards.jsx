import React from 'react';
import StatCard from '../StatCard';

const DeveloperStatsCards = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Endpoints */}
      <StatCard
        title="Total Endpoints"
        value={stats.totalEndpoints}
        change="+2"
        changeType="positive"
        loading={loading}
        icon={(props) => (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      />

      {/* Active API Keys */}
      <StatCard
        title="Active API Keys"
        value={stats.activeKeys}
        change="0"
        changeType="neutral"
        loading={loading}
        icon={(props) => (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        )}
      />

      {/* Total Requests */}
      <StatCard
        title="Total Requests"
        value={stats.totalRequests.toLocaleString()}
        change="+12.5%"
        changeType="positive"
        loading={loading}
        icon={(props) => (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )}
      />

      {/* Error Rate */}
      <StatCard
        title="Error Rate"
        value={`${(stats.errorRate * 100).toFixed(2)}%`}
        change="-0.5%"
        changeType="positive"
        loading={loading}
        icon={(props) => (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
      />
    </div>
  );
};

export default DeveloperStatsCards;