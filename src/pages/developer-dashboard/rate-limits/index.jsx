import React from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import RateLimitMonitor from '../../../components/developer/RateLimitMonitor';

const RateLimitsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Rate Limits</h1>
          <p className="text-slate-400 mt-2">Monitor your API usage and rate limit status</p>
        </div>
        <RateLimitMonitor />
      </div>
    </AppLayout>
  );
};

export default RateLimitsPage;