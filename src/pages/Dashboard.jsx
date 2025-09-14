import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import StatCard from '../components/StatCard';
import DateRangePicker from '../components/DateRangePicker';
import UsageChart from '../components/UsageChart';
import RecentActivity from '../components/RecentActivity';
import apiService from '../services/apiService';

// Hub dashboard: overview + navigation to specialized dashboards
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    apiCalls: 0,
    thisMonth: 0,
    quota: 5000,
    activeKeys: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  const [sparklineData] = useState({
    apiCalls: [1200, 1150, 1180, 1220, 1190, 1247, 1210],
    thisMonth: [75, 82, 78, 89, 85, 89, 89],
    quota: [1.2, 1.5, 1.3, 1.8, 1.6, 1.8, 1.8],
    activeKeys: [2, 2, 2, 2, 2, 2, 2]
  });
  const [usageData] = useState([
    { date: 'Sep 1', value: 120 },
    { date: 'Sep 2', value: 135 },
    { date: 'Sep 3', value: 142 },
    { date: 'Sep 4', value: 138 },
    { date: 'Sep 5', value: 156 },
    { date: 'Sep 6', value: 148 },
    { date: 'Sep 7', value: 162 },
    { date: 'Sep 8', value: 175 },
    { date: 'Sep 9', value: 168 },
    { date: 'Sep 10', value: 182 },
    { date: 'Sep 11', value: 195 },
    { date: 'Sep 12', value: 187 },
    { date: 'Sep 13', value: 201 }
  ]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const userStats = await apiService.getUserStats();
        const keys = await apiService.getApiKeys();
        setStats({
          apiCalls: userStats.total_calls || 0,
          thisMonth: userStats.monthly_calls || 0,
          quota: userStats.quota || 5000,
            activeKeys: keys.length || 0
        });
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
        setStats({ apiCalls: 1247, thisMonth: 89, quota: 5000, activeKeys: 2 });
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  const quotaPercentage = (stats.thisMonth / stats.quota) * 100;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/svg/logo-full-nb.svg" alt="Envoyou" className="h-8 w-auto mr-3" />
              </Link>
              <nav className="hidden md:flex space-x-8 ml-10">
                <Link to="/dashboard" className="text-emerald-400 font-medium">Overview</Link>
                <Link to="/dashboard/monitoring" className="text-slate-300 hover:text-white transition-colors">Monitoring</Link>
                <Link to="/dashboard/analytics" className="text-slate-300 hover:text-white transition-colors">Analytics</Link>
                <Link to="/dashboard/reporting" className="text-slate-300 hover:text-white transition-colors">Reporting</Link>
                <Link to="/settings/api-keys" className="text-slate-300 hover:text-white transition-colors">API Keys</Link>
                <Link to="/developer" className="text-slate-300 hover:text-white transition-colors">Developer</Link>
                <Link to="/settings/profile" className="text-slate-300 hover:text-white transition-colors">Settings</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <DateRangePicker selectedRange={dateRange} onRangeChange={setDateRange} />
              <a href="https://envoyou.com/documentation" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </a>
              <div className="relative">
                <Link to="/settings/profile" className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center"><span className="text-white font-medium">{user?.name?.[0] || user?.email?.[0] || 'U'}</span></div>
                  <span className="text-white font-medium hidden md:block">{user?.name}</span>
                </Link>
              </div>
              <button onClick={async () => { try { await logout(); } catch(e){ console.error(e);} }} className="text-slate-400 hover:text-white transition-colors" title="Sign out">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="mt-1 text-sm text-slate-400">Snapshot of usage & quick access to specialized dashboards.</p>
        </div>
        <EmailVerificationBanner />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total API Calls" value={stats.apiCalls} change="+8.2%" changeType="positive" sparklineData={sparklineData.apiCalls} loading={loading} onClick={() => window.open('/dashboard/usage', '_self')} icon={(props)=>(<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>)} />
          <StatCard title="This Month" value={stats.thisMonth} change="+12.5%" changeType="positive" sparklineData={sparklineData.thisMonth} loading={loading} onClick={() => window.open('/dashboard/usage', '_self')} icon={(props)=>(<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>)} />
          <StatCard title="Quota Used" value={`${quotaPercentage.toFixed(1)}%`} change="+0.2%" changeType="neutral" sparklineData={sparklineData.quota} loading={loading} onClick={() => window.open('/settings/billing', '_self')} icon={(props)=>(<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>)} />
          <StatCard title="Active API Keys" value={stats.activeKeys} change="0%" changeType="neutral" sparklineData={sparklineData.activeKeys} loading={loading} onClick={() => window.open('/settings/api-keys', '_self')} icon={(props)=>(<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>)} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Usage Overview</h3>
            <UsageChart data={usageData} />
            <div className="mt-4 text-right">
              <Link to="/dashboard/monitoring" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Go to Monitoring →</Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-lg">
              <h4 className="text-xs font-semibold tracking-wide text-slate-400 mb-2">Specialized Dashboards</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard/monitoring" className="text-emerald-400 hover:text-emerald-300">ESG Monitoring</Link><p className="text-[11px] text-slate-500">Real-time score, alerts, regulations</p></li>
                <li><Link to="/dashboard/analytics" className="text-emerald-400 hover:text-emerald-300">Analytics (Investor / Company)</Link><p className="text-[11px] text-slate-500">Portfolio & facility intelligence</p></li>
                <li><Link to="/dashboard/reporting" className="text-emerald-400 hover:text-emerald-300">Reporting & Disclosure</Link><p className="text-[11px] text-slate-500">Exports, mappings, webhooks</p></li>
              </ul>
            </div>
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
