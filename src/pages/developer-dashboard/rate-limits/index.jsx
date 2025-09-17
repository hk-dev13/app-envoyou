import React from 'react';
import RateLimitMonitor from '../../../components/developer/RateLimitMonitor';

const RateLimitsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rate Limits</h1>
        <p className="text-muted-foreground mt-2">Monitor your API usage and rate limit status</p>
      </div>
      <RateLimitMonitor />
    </div>
  );
};

export default RateLimitsPage;