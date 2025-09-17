import React from 'react';
import RateLimitMonitor from '../../../components/developer/RateLimitMonitor';

const RateLimitsPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Rate Limits</h1>
          <p className="text-muted-foreground mt-2">Monitor your API usage and rate limit status</p>
        </div>
      </div>
      <RateLimitMonitor />
    </div>
  );
};

export default RateLimitsPage;