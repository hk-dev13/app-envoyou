import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickActions() {
  const actions = [
    { href: '/developer/api-keys', label: 'Create API Key', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
    )},
    { href: '/developer/api-docs', label: 'Read Docs', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5z"/></svg>
    )},
    { href: '/developer/snippets', label: 'Code Snippets', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
    )},
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-2">
      {actions.map(a => (
        <Link key={a.href} to={a.href} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-accent text-sm transition-colors">
          {a.icon}
          <span>{a.label}</span>
        </Link>
      ))}
    </div>
  );
}
