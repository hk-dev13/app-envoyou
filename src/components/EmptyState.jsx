import React from 'react';

export default function EmptyState({
  icon: Icon,
  title = 'Nothing here yet',
  description = 'When there is data to show, it will appear here.',
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/40 text-muted-foreground ring-1 ring-inset ring-border animate-in fade-in duration-300">
        {Icon ? <Icon className="h-6 w-6" /> : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
}
