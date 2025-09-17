import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import ThemeToggle from '../ThemeToggle.jsx';
import PlanStatus from '../PlanStatus.jsx';

const ProfileMenu = ({ user, onLogout, compact = false }) => {
  const [open, setOpen] = React.useState(false);
  const closeTimeout = React.useRef(null);

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

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
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
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-transparent transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-foreground">{user?.name || 'User'}</div>
          <div className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</div>
        </div>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute bottom-full right-0 z-40 mt-2 w-56 rounded-md border border-border bg-popover/95 backdrop-blur-sm shadow-lg py-2"
          role="menu"
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-2 border-b border-border">
            <div className="text-sm font-medium text-popover-foreground">{user?.name || 'User'}</div>
            <div className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</div>
          </div>
          <Link
            to="/settings/profile"
            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Profile Settings
          </Link>
          <Link
            to="/settings/notifications"
            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Notifications
          </Link>
          <div className="border-t border-border my-1" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            role="menuitem"
          >
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'w-64' : 'w-16'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Section Switcher */}
        <div className="px-3 py-4 border-b border-border">
          <div className="flex space-x-1">
            <Link
              to="/dashboard"
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                !location.pathname.startsWith('/developer') && !location.pathname.startsWith('/settings')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/developer"
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                location.pathname.startsWith('/developer')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Developer
            </Link>
            <Link
              to="/settings/profile"
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                location.pathname.startsWith('/settings')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-primary border-l-4 border-primary bg-accent/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span className={`ml-3 transition-opacity duration-200 ${
                sidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* User Profile at Bottom */}
        <div className="border-t border-border p-3">
          <ProfileMenu user={user} onLogout={logout} compact={!sidebarExpanded} />
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
      <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : 'md:ml-16'}`}>
        {/* Minimal Header */}
        <header className="h-16 border-b border-border/80 bg-background/80 backdrop-blur flex items-center justify-between px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo for mobile */}
          <div className="md:hidden">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img
                src="/svg/logo-nb.svg"
                alt="Envoyou"
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <PlanStatus compact />
            <ThemeToggle compact />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}