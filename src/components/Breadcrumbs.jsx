import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  '/dashboard': 'Dashboard',
  '/dashboard/monitoring': 'Monitoring',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/reporting': 'Reporting',
  '/developer': 'Developer',
  '/developer/api-docs': 'API Docs',
  '/developer/api-keys': 'API Keys',
  '/developer/analytics': 'Analytics',
  '/developer/snippets': 'Snippets',
  '/developer/rate-limits': 'Rate Limits',
  '/settings/profile': 'Profile',
  '/settings/notifications': 'Notifications',
  '/settings/security': 'Security',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const items = [];
  let acc = '';
  for (let i = 0; i < segments.length; i++) {
    acc += '/' + segments[i];
    const label = LABELS[acc] || segments[i].replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    items.push({ href: acc, label, last: i === segments.length - 1 });
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center text-sm text-muted-foreground">
      {items.map((it, idx) => (
        <span key={it.href} className="flex items-center">
          {idx !== 0 && <span className="mx-2 text-border">/</span>}
          {it.last ? (
            <span className="text-foreground font-medium">{it.label}</span>
          ) : (
            <Link to={it.href} className="hover:text-foreground transition-colors">{it.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
