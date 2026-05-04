import { useMemo } from 'react';
import type { HabitLog } from '@repo/types';

export interface DayStatus {
  date: string;
  completed: boolean; // all habits done for that day
  partial: boolean;   // some habits done
  future: boolean;
}

/** Returns completion stats for the current month given all logs and active habit IDs. */
export function useCompletion(
  logs: HabitLog[],
  habitIds: string[],
  year: number,
  month: number,
) {
  return useMemo(() => {
    const today = new Date();
    const todayStr = toDateStr(today);

    const daysInMonth = new Date(year, month, 0).getDate();
    const dayStatuses: DayStatus[] = [];

    let completedDays = 0;
    let elapsedDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad(month)}-${pad(d)}`;
      const isFuture = dateStr > todayStr;

      if (!isFuture) {
        elapsedDays++;
        const dayLogs = logs.filter((l) => l.date === dateStr);
        const doneCount = habitIds.filter((hId) => dayLogs.find((l) => l.habitId === hId && l.completed)).length;
        const allDone = habitIds.length > 0 && doneCount === habitIds.length;
        const someDone = doneCount > 0 && !allDone;

        if (allDone) completedDays++;
        dayStatuses.push({ date: dateStr, completed: allDone, partial: someDone, future: false });
      } else {
        dayStatuses.push({ date: dateStr, completed: false, partial: false, future: true });
      }
    }

    const completionPct =
      elapsedDays === 0 ? 0 : Math.round((completedDays / elapsedDays) * 100);

    // blur: 0% → 24px, 100% → 0px
    const blurPx = Math.round(24 * (1 - completionPct / 100));

    const earnedFreeMonth = completionPct >= 80;

    return { dayStatuses, completionPct, blurPx, earnedFreeMonth, completedDays, elapsedDays };
  }, [logs, habitIds, year, month]);
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
