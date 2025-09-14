import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import ThemeToggle from '../ThemeToggle.jsx';
import PlanStatus from '../PlanStatus.jsx';

function useActive(path) {
  const location = useLocation();
  return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
}

const Dropdown = ({ label, children }) => {
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
    closeTimeout.current = setTimeout(() => setOpen(false), 160); // small delay so pointer can traverse gap
  };

  React.useEffect(() => () => clearClose(), []);

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div
          className="absolute z-40 mt-2 w-48 rounded-md border border-slate-800 bg-slate-900/95 backdrop-blur-sm shadow-lg py-2"
          role="menu"
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ to, children, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white"
      role="menuitem"
    >
      {children}
    </Link>
  );
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const activeDashboard = ['/dashboard','/dashboard/monitoring','/dashboard/analytics','/dashboard/reporting'].some(p => location.pathname.startsWith(p));
  const activeDeveloper = ['/developer','/developer/api-keys','/developer/api-docs','/developer/rate-limits','/developer/snippets'].some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur flex items-center z-30">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
                <img 
                    src="/svg/logo-full-nb.svg" 
                    alt="Envoyou" 
                    className="h-8 w-auto text-emerald-400"
                  />
            </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md font-medium ${useActive('/dashboard') && !activeDashboard ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >Overview</Link>
            <Dropdown label={<span className={activeDashboard ? 'text-white' : 'text-slate-300'}>Dashboards</span>}>
              <MenuItem to="/dashboard/monitoring">Monitoring</MenuItem>
              <MenuItem to="/dashboard/analytics">Analytics</MenuItem>
              <MenuItem to="/dashboard/reporting">Reporting</MenuItem>
            </Dropdown>
            <Dropdown label={<span className={activeDeveloper ? 'text-white' : 'text-slate-300'}>Developer</span>}>
              <MenuItem to="/developer/api-keys">API Keys</MenuItem>
              <MenuItem to="/developer/api-docs">Documentation</MenuItem>
              <MenuItem to="/developer/rate-limits">Rate Limits</MenuItem>
              <MenuItem to="/developer/snippets">Snippets</MenuItem>
            </Dropdown>
          </nav>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-4">
            <PlanStatus compact />
            <ThemeToggle compact />
            <ProfileMenu user={user} onLogout={logout} />
          </div>
          <div className="md:hidden"><ProfileMenu user={user} onLogout={logout} minimal /></div>
        </div>
      </header>
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}

function ProfileMenu({ user, onLogout, minimal = false }) {
  const [open, setOpen] = React.useState(false);
  const initial = user?.name?.[0] || user?.email?.[0] || 'U';
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-9 px-3 inline-flex items-center gap-2 rounded-md bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-semibold text-white">{initial}</span>
        {!minimal && <span className="max-w-[120px] truncate">{user?.name || user?.email}</span>}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-slate-800 bg-slate-900/95 backdrop-blur-sm shadow-lg py-2 z-50" role="menu">
          <div className="px-4 py-2 text-xs uppercase tracking-wide text-slate-500">Account</div>
          <MenuItem to="/settings/profile">Profile Settings</MenuItem>
          <MenuItem to="/settings/security">Security</MenuItem>
          <MenuItem to="/settings/api-keys">API Keys</MenuItem>
          <div className="h-px my-2 bg-slate-800" />
          <button
            onClick={onLogout}
            className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
            role="menuitem"
          >Logout</button>
        </div>
      )}
    </div>
  );
}