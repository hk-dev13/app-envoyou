import React from 'react';
import EmptyState from '../EmptyState';
import { Inbox } from 'lucide-react';

export default function RecentActivity({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No activity yet"
        description="When your app starts making requests, you’ll see them here."
        primaryAction={<a href="/developer/api-keys" className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Create API Key</a>}
        secondaryAction={<a href="/developer/api-docs" className="inline-flex items-center px-3 py-2 rounded-md border border-border hover:bg-accent text-sm">Read Docs</a>}
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${it.color || 'bg-emerald-400'}`}></div>
          <div className="flex-1">
            <p className="text-sm text-primary-foreground">{it.title}</p>
            <p className="text-xs text-muted-foreground">{it.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
