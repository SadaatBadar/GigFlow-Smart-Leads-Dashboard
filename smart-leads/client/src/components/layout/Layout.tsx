import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={clsx(
        'flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
        mobile ? 'w-full' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-700 text-lg text-slate-900 dark:text-white tracking-tight">
          GigFlow<span className="text-brand-600">Leads</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4 h-4', isActive ? 'text-brand-600 dark:text-brand-400' : '')} />
                {label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-brand-500 dark:text-brand-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/30 dark:bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 dark:text-slate-300" /> : <Menu className="w-5 h-5 dark:text-slate-300" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-semibold text-slate-900 dark:text-white">
                GigFlow<span className="text-brand-600">Leads</span>
              </span>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
