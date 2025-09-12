import React from 'react';
import DeveloperLayout from '../../../components/developer/DeveloperLayout';
import UsageAnalytics from '../../../components/developer/UsageAnalytics';

const AnalyticsPage = () => {
  return (
    <DeveloperLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Usage Analytics</h1>
          <p className="text-slate-400 mt-2">Monitor your API usage and performance metrics</p>
        </div>
        <UsageAnalytics />
      </div>
    </DeveloperLayout>
  );
};

export default AnalyticsPage;