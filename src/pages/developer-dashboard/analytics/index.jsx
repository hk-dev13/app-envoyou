import React from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import UsageAnalytics from '../../../components/developer/UsageAnalytics';

const AnalyticsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Usage Analytics</h1>
          <p className="text-slate-400 mt-2">Monitor your API usage and performance metrics</p>
        </div>
        <UsageAnalytics />
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;