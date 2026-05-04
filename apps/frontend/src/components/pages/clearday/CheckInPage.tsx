import { Link } from 'react-router';
import { ArrowLeft, Loader2, CalendarDays } from 'lucide-react';
import { HabitChecklist } from '../../clearday/HabitChecklist';
import { useHabits } from '../../../hooks/clearday/useHabits';
import { useHabitLogsForDate } from '../../../hooks/clearday/useHabitLogs';
import { useMonthlySetup } from '../../../hooks/clearday/useMonthlySetup';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function pad(n: number) { return String(n).padStart(2, '0'); }

export function CheckInPage() {
  const today = new Date();
  const todayStr = getTodayStr();

  const { data: setup, isLoading: loadingSetup } = useMonthlySetup();
  const { habits, isLoading: loadingHabits } = useHabits();
  const { data: logs = [], isLoading: loadingLogs } = useHabitLogsForDate(todayStr);

  const activeHabitIds = setup?.habitIds ?? [];
  const activeHabits = habits.filter((h) => activeHabitIds.includes(h.id));

  const loading = loadingSetup || loadingHabits || loadingLogs;

  const doneCount = activeHabitIds.filter(
    (hId) => logs.find((l) => l.habitId === hId && l.completed)
  ).length;
  const allDone = activeHabits.length > 0 && doneCount === activeHabits.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/clearday" className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">Daily Check-In</h1>
          <p className="text-secondary text-sm">
            {DAY_NAMES[today.getDay()]}, {MONTH_NAMES[today.getMonth()]} {today.getDate()}
          </p>
        </div>
      </div>

      {/* Progress chip */}
      {!loading && activeHabits.length > 0 && (
        <div className={[
          'flex items-center justify-between px-5 py-3 rounded-2xl',
          allDone ? 'bg-emerald-50 border border-emerald-200' : 'bg-white/80 border border-slate-200',
        ].join(' ')}>
          <span className={['text-sm font-medium', allDone ? 'text-emerald-700' : 'text-secondary'].join(' ')}>
            {allDone ? 'All done for today! 🎉' : `${doneCount} of ${activeHabits.length} habits complete`}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round((doneCount / activeHabits.length) * 100)}%
          </span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : !setup ? (
        <div className="text-center py-12">
          <p className="text-secondary mb-4">No habits set up for this month.</p>
          <Link to="/clearday/setup" className="ai-button text-white px-6 py-3 rounded-xl text-sm font-medium">
            Go to Setup
          </Link>
        </div>
      ) : (
        <HabitChecklist habits={activeHabits} logs={logs} date={todayStr} />
      )}

      {/* View calendar */}
      {!loading && allDone && (
        <Link
          to="/clearday"
          className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-base font-semibold transition-colors"
        >
          <CalendarDays className="w-5 h-5" />
          See your calendar update
        </Link>
      )}
    </div>
  );
}
