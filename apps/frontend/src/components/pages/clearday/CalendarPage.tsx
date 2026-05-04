import { Link } from 'react-router';
import { Loader2, Settings2, CheckSquare, PartyPopper } from 'lucide-react';
import { WallpaperCalendar } from '../../clearday/WallpaperCalendar';
import { useMonthlySetup } from '../../../hooks/clearday/useMonthlySetup';
import { useHabitLogsForMonth } from '../../../hooks/clearday/useHabitLogs';
import { useCompletion } from '../../../hooks/clearday/useCompletion';

export function CalendarPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

  const { data: setup, isLoading: loadingSetup, error: setupError } = useMonthlySetup();
  const { data: logs = [], isLoading: loadingLogs } = useHabitLogsForMonth(yearMonth);

  const habitIds = setup?.habitIds ?? [];
  const { dayStatuses, completionPct, blurPx, earnedFreeMonth } = useCompletion(
    logs,
    habitIds,
    year,
    month,
  );

  if (loadingSetup || loadingLogs) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  // No setup yet — prompt to onboard
  if (setupError || !setup) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
        <div className="p-5 rounded-3xl ai-gradient shadow-lg">
          <Settings2 className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Welcome to ClearDay</h2>
          <p className="text-secondary max-w-xs mx-auto">
            Upload a motivational photo and choose up to 5 habits to track this month. As you log
            each day, your photo will progressively clear.
          </p>
        </div>
        <Link
          to="/clearday/setup"
          className="flex items-center gap-2 ai-button text-white px-8 py-3 rounded-2xl text-base font-medium transition-all duration-300"
        >
          <Settings2 className="w-5 h-5" />
          Start Setup
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Free month celebration banner */}
      {earnedFreeMonth && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
          <PartyPopper className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800">This month is on us! 🎉</p>
            <p className="text-emerald-700 text-sm">
              You've hit {completionPct}% completion — your next billing cycle is waived.
            </p>
          </div>
        </div>
      )}

      {/* Wallpaper calendar */}
      <WallpaperCalendar
        photoDataUrl={setup.photoDataUrl}
        blurPx={blurPx}
        completionPct={completionPct}
        dayStatuses={dayStatuses}
        year={year}
        month={month}
      />

      {/* CTA */}
      <Link
        to="/clearday/checkin"
        className="flex items-center justify-center gap-2 ai-button text-white w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300"
      >
        <CheckSquare className="w-5 h-5" />
        Log Today's Habits
      </Link>

      <p className="text-center text-secondary text-xs">
        Complete all habits today to fill in another day on your calendar
      </p>
    </div>
  );
}
