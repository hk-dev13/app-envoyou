import React, { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import RecentActivity from '../../components/dashboard/RecentActivity.jsx';
import { Activity, Gauge, Key, Zap } from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeKeys: 0,
    errorRate: 0,
    endpoints: 0,
    loading: true,
  });

  useEffect(() => {
    // TODO: Wire to real API later
    const t = setTimeout(() => {
      setStats({ totalRequests: 1247, activeKeys: 2, errorRate: 0.028, endpoints: 24, loading: false });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Top strip */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-background to-muted/30">
          <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(600px 200px at 20% -20%, rgba(16,185,129,0.15), transparent), radial-gradient(600px 200px at 80% -40%, rgba(59,130,246,0.15), transparent)"}} />
          <div className="relative p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">Platform Overview</h1>
            <p className="text-muted-foreground mt-1">Snapshot of usage & quick access to tools</p>
            <div className="mt-6"><QuickActions /></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total API Calls" value={stats.loading ? '—' : stats.totalRequests.toLocaleString()} delta="+8.2% vs last month" icon={Activity} tone="emerald" />
          <StatCard title="Active API Keys" value={stats.loading ? '—' : stats.activeKeys} icon={Key} tone="blue" />
          <StatCard title="Error Rate" value={stats.loading ? '—' : `${(stats.errorRate*100).toFixed(1)}%`} icon={Zap} tone="yellow" />
          <StatCard title="Endpoints" value={stats.loading ? '—' : stats.endpoints} icon={Gauge} tone="purple" />
        </div>

        {/* Activity & Placeholder for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-primary-foreground font-semibold">Recent Activity</h2>
            <p className="text-muted-foreground text-sm mb-4">Latest events from your API usage</p>
            <RecentActivity items={stats.totalRequests ? [
              { title: 'API key generated', time: '2 hours ago', color: 'bg-emerald-400' },
              { title: '1000 requests processed', time: '5 hours ago', color: 'bg-blue-400' },
              { title: 'Rate limit warning', time: '1 day ago', color: 'bg-yellow-400' },
            ] : []} />
          </div>
          <div className="bg-card border border-border rounded-xl p-6 min-h-[280px]">
            <h2 className="text-primary-foreground font-semibold">Usage Overview</h2>
            <p className="text-muted-foreground text-sm">Coming soon: charts & insights</p>
            <div className="mt-6 h-40 rounded-lg border border-dashed border-border/80 flex items-center justify-center text-muted-foreground text-sm">Charts placeholder</div>
          </div>
        </div>
      </div>
  );
}
