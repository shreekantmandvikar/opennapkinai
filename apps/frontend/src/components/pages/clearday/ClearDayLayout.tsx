import { NavLink, Outlet } from 'react-router';
import { CalendarDays, CheckSquare, Settings2, Sun } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/clearday', icon: CalendarDays, label: 'Calendar', end: true },
  { to: '/clearday/checkin', icon: CheckSquare, label: 'Check-In', end: false },
  { to: '/clearday/setup', icon: Settings2, label: 'Setup', end: false },
];

export function ClearDayLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 minimal-pattern flex flex-col">
      {/* Top bar */}
      <header className="ai-card border-b border-blue-100/50 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg ai-gradient">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary">ClearDay</span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-secondary hover:text-primary hover:bg-slate-100',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
