import React from 'react';
import DeveloperLayout from '../../../components/developer/DeveloperLayout';
import RateLimitMonitor from '../../../components/developer/RateLimitMonitor';

const RateLimitsPage = () => {
  return (
    <DeveloperLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Rate Limits</h1>
          <p className="text-slate-400 mt-2">Monitor your API usage and rate limit status</p>
        </div>
        <RateLimitMonitor />
      </div>
    </DeveloperLayout>
  );
};

export default RateLimitsPage;