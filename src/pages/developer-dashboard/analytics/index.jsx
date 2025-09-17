import React from 'react';
import UsageAnalytics from '../../../components/developer/UsageAnalytics';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-foreground">Usage Analytics</h1>
        <p className="text-muted-foreground mt-2">Monitor your API usage and performance metrics</p>
      </div>
      <UsageAnalytics />
    </div>
  );
};

export default AnalyticsPage;