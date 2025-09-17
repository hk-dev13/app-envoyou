import React from 'react';

export default function StatCard({ title, value, delta, icon, tone = 'emerald' }) {
  const Icon = icon;
  const toneMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
  };
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
          {delta && (
            <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M12 3v18"/></svg>
              {delta}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
            <Icon className={`h-5 w-5 ${toneMap[tone].split(' ')[0]}`} />
          </div>
        )}
      </div>
    </div>
  );
}
