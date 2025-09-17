import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import * as Tooltip from '@radix-ui/react-tooltip';
import ThemeToggle from '../ThemeToggle.jsx';
import PlanStatus from '../PlanStatus.jsx';
import Breadcrumbs from '../Breadcrumbs.jsx';

const ProfileMenu = ({ user, onLogout, compact = false }) => {
  const [open, setOpen] = React.useState(false);
  const closeTimeout = React.useRef(null);
  const menuRef = React.useRef(null);
  const [focusIndex, setFocusIndex] = React.useState(0);

  const clearClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimeout.current = setTimeout(() => setOpen(false), 160);
  };

  React.useEffect(() => () => clearClose(), []);

  // Basic keyboard navigation for dropdown
  const onKeyDown = (e) => {
    if (!open) return;
    const items = menuRef.current?.querySelectorAll('[data-menu-item="true"]');
    if (!items || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusIndex + 1) % items.length;
      setFocusIndex(next);
      items[next].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (focusIndex - 1 + items.length) % items.length;
      setFocusIndex(prev);
      items[prev].focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  if (compact) {
    return (
      <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent/40 transition-colors">
        <div className="w-8 h-8 bg-primary/20 text-primary rounded-full grid place-items-center text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/40 transition-colors text-left"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-9 h-9 bg-primary/20 text-primary rounded-full grid place-items-center text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
        </div>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute bottom-full right-0 z-40 mt-2 w-56 rounded-md border border-border bg-popover/95 backdrop-blur-sm shadow-lg py-2"
          role="menu"
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
          onKeyDown={onKeyDown}
        >
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 text-primary rounded-full grid place-items-center text-xs font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-popover-foreground truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <Link
            to="/settings/profile"
            className="px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
            role="menuitem"
            data-menu-item="true"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Profile Settings
          </Link>
          <Link
            to="/settings/notifications"
            className="px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
            role="menuitem"
            data-menu-item="true"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 012 21h13.78a3 3 0 002.553-1.658l.046-.092A17.925 17.925 0 0118.708 7.5 17.925 17.925 0 0112 3c-2.131 0-4.09.61-5.84 1.683M12 3v18"/></svg>
            Notifications
          </Link>
          <div className="border-t border-border my-1" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
            role="menuitem"
            data-menu-item="true"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0V7a2 2 0 114 0v1"/></svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile overlay
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    try {
      const v = localStorage.getItem('env.sidebarVisible');
      return v ? v === '1' : true;
    } catch {
      return true;
    }
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    try {
      const v = localStorage.getItem('env.sidebarExpanded');
      return v ? v === '1' : true;
    } catch {
      return true;
    }
  });
  // Compact (icon-only) mode, remembered separately from visibility
  const [sidebarCompact, setSidebarCompact] = useState(() => {
    try {
      const v = localStorage.getItem('env.sidebarCompact');
      return v === '1';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try { localStorage.setItem('env.sidebarVisible', sidebarVisible ? '1' : '0'); } catch (e) { void e; }
  }, [sidebarVisible]);
  React.useEffect(() => {
    try { localStorage.setItem('env.sidebarExpanded', sidebarExpanded ? '1' : '0'); } catch (e) { void e; }
  }, [sidebarExpanded]);
  React.useEffect(() => {
    try { localStorage.setItem('env.sidebarCompact', sidebarCompact ? '1' : '0'); } catch (e) { void e; }
  }, [sidebarCompact]);

  // Section tone for highlights
  const sectionTone = React.useMemo(() => {
    if (location.pathname.startsWith('/developer')) return 'purple';
    if (location.pathname.startsWith('/settings')) return 'blue';
    return 'emerald';
  }, [location.pathname]);

  const navigationItems = React.useMemo(() => {
    const isDeveloperSection = location.pathname.startsWith('/developer');
    const isSettingsSection = location.pathname.startsWith('/settings');

    if (isDeveloperSection) {
      return [
        {
          name: 'Overview',
          path: '/developer',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
          ),
          active: location.pathname === '/developer'
        },
        {
          name: 'API Docs',
          path: '/developer/api-docs',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/api-docs')
        },
        {
          name: 'API Keys',
          path: '/developer/api-keys',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/api-keys')
        },
        {
          name: 'Analytics',
          path: '/developer/analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V8a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 009.172 4H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/analytics')
        },
        {
          name: 'Rate Limits',
          path: '/developer/rate-limits',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/rate-limits')
        },
        {
          name: 'Snippets',
          path: '/developer/snippets',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/snippets')
        }
      ];
    } else if (isSettingsSection) {
      return [
        {
          name: 'Profile',
          path: '/settings/profile',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          active: location.pathname.startsWith('/settings/profile')
        },
        {
          name: 'Notifications',
          path: '/settings/notifications',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 012 21h13.78a3 3 0 002.553-1.658l.046-.092A17.925 17.925 0 0118.708 7.5 17.925 17.925 0 0112 3c-2.131 0-4.09.61-5.84 1.683M12 3v18" />
            </svg>
          ),
          active: location.pathname.startsWith('/settings/notifications')
        },
        {
          name: 'Security',
          path: '/settings/security',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          active: location.pathname.startsWith('/settings/security')
        }
      ];
    } else {
      // Dashboard section
      return [
        {
          name: 'Overview',
          path: '/dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
          ),
          active: location.pathname === '/dashboard'
        },
        {
          name: 'Monitoring',
          path: '/dashboard/monitoring',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/dashboard/monitoring')
        },
        {
          name: 'Analytics',
          path: '/dashboard/analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V8a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 009.172 4H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/dashboard/analytics')
        },
        {
          name: 'Reporting',
          path: '/dashboard/reporting',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/dashboard/reporting')
        }
      ];
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'w-64' : 'w-16'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarVisible ? 'md:translate-x-0 md:border-r md:border-border/80 md:pointer-events-auto' : 'md:-translate-x-full md:w-0 md:border-transparent md:pointer-events-none md:overflow-hidden'}`}
      >
        {/* Brand + Section Switcher */}
        <div className="px-3 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/svg/logo-nb.svg" alt="Envoyou" className="h-6 w-auto rounded" />
              {sidebarExpanded && !sidebarCompact && <span className="text-foreground font-semibold tracking-wide">Envoyou</span>}
            </Link>
            <div className="flex items-center gap-1">
              {sidebarExpanded && !sidebarCompact && (
                <span className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">App</span>
              )}
              {/* Compact toggle */}
              <button
                className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                title={sidebarCompact ? 'Disable compact' : 'Enable compact'}
                onClick={() => setSidebarCompact(v => !v)}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4h2v2H4V4zm0 5h2v2H4V9zm0 5h2v2H4v-2zm5-10h2v2H9V4zm0 5h2v2H9V9zm0 5h2v2H9v-2zm5-10h2v2h-2V4zm0 5h2v2h-2V9zm0 5h2v2h-2v-2z"/></svg>
              </button>
              <button
                className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                onClick={() => setSidebarExpanded(v => !v)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {/* Segmented section switcher */}
          <Tooltip.Provider delayDuration={200}>
            <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1 rounded-lg">
              {[
                { to: '/dashboard', active: !location.pathname.startsWith('/developer') && !location.pathname.startsWith('/settings'), tone: 'emerald', label: 'Dashboard', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/></svg>
                )},
                { to: '/developer', active: location.pathname.startsWith('/developer'), tone: 'purple', label: 'Developer', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                )},
                { to: '/settings/profile', active: location.pathname.startsWith('/settings'), tone: 'blue', label: 'Settings', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4 12a8 8 0 1016 0 8 8 0 10-16 0z"/></svg>
                )}
              ].map((s) => {
                const activeCls = s.tone === 'purple' ? 'bg-purple-600/20 text-purple-400' : s.tone === 'blue' ? 'bg-blue-600/20 text-blue-400' : 'bg-emerald-600/20 text-emerald-400';
                const el = (
                  <Link key={s.to} to={s.to}
                    className={`${sidebarCompact ? 'py-2' : 'px-3 py-2'} text-xs font-medium rounded-md text-center transition-colors ${s.active ? activeCls : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  >
                    {sidebarCompact ? s.icon : s.label}
                  </Link>
                );
                return sidebarCompact ? (
                  <Tooltip.Root key={s.to}>
                    <Tooltip.Trigger asChild>{el}</Tooltip.Trigger>
                    <Tooltip.Content side="right" className="rounded-md bg-popover text-popover-foreground border border-border px-2 py-1 text-xs shadow-md">{s.label}</Tooltip.Content>
                  </Tooltip.Root>
                ) : el;
              })}
            </div>
          </Tooltip.Provider>
        </div>

        {/* Navigation */}
        <Tooltip.Provider delayDuration={200} skipDelayDuration={200}>
          <nav className="flex-1 px-2 md:px-3 py-6 space-y-1">
            {navigationItems.map((item) => {
              const activeTone = sectionTone === 'purple' ? 'bg-purple-600/20' : sectionTone === 'blue' ? 'bg-blue-600/20' : 'bg-emerald-600/20';
              const indicatorTone = sectionTone === 'purple' ? 'bg-purple-400' : sectionTone === 'blue' ? 'bg-blue-400' : 'bg-emerald-400';
              const link = (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? `text-foreground ${activeTone}`
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                  }`}
                >
                  <div className="flex-shrink-0 opacity-90 group-hover:opacity-100">{item.icon}</div>
                  <span className={`ml-3 transition-all duration-200 ${
                    sidebarExpanded && !sidebarCompact ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                  }`}>
                    {item.name}
                  </span>
                  {item.active && (
                    <span className={`absolute inset-y-1 right-1 w-1.5 rounded-full ${indicatorTone}`} />
                  )}
                </Link>
              );
              return sidebarExpanded ? (
                link
              ) : (
                <Tooltip.Root key={item.path}>
                  <Tooltip.Trigger asChild>
                    {link}
                  </Tooltip.Trigger>
                  <Tooltip.Content side="right" className="rounded-md bg-popover text-popover-foreground border border-border px-2 py-1 text-xs shadow-md">
                    {item.name}
                  </Tooltip.Content>
                </Tooltip.Root>
              );
            })}
          </nav>
        </Tooltip.Provider>

        {/* User Profile at Bottom */}
        <div className="border-t border-border/80 p-3">
          <ProfileMenu user={user} onLogout={logout} compact={!sidebarExpanded || sidebarCompact} />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? (sidebarExpanded ? 'md:ml-64' : 'md:ml-16') : 'md:ml-0'}`}>
        {/* SaaS Header */}
        <header className="h-16 border-b border-border/80 bg-background/70 backdrop-blur flex items-center justify-between px-4 md:px-6">
          {/* Sidebar toggles */}
          <div className="flex items-center gap-1">
            {/* Mobile open */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Left: Breadcrumbs */}
          <div className="flex-1 flex items-center min-w-0">
            <Breadcrumbs />
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden md:block">
              <PlanStatus compact />
            </div>
            <ThemeToggle compact />
            <Link
              to="/developer/api-keys"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              New Key
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Floating sidebar toggle (desktop) */}
      <button
        onClick={() => setSidebarVisible(v => !v)}
        className={`hidden md:flex fixed bottom-4 left-4 z-50 h-9 w-9 rounded-full border border-border bg-card/90 backdrop-blur items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${sidebarVisible ? '' : ''}`}
        aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarVisible ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        )}
      </button>
    </div>
  );
}