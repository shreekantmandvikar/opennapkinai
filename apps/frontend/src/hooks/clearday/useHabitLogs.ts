import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLogsByDate, fetchLogsByMonth, upsertLog } from '../../data/cleardayApi';

export function useHabitLogsForDate(date: string) {
  return useQuery({
    queryKey: ['clearday', 'habit-logs', 'date', date],
    queryFn: () => fetchLogsByDate(date),
  });
}

export function useHabitLogsForMonth(yearMonth: string) {
  return useQuery({
    queryKey: ['clearday', 'habit-logs', 'month', yearMonth],
    queryFn: () => fetchLogsByMonth(yearMonth),
  });
}

export function useUpsertLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      habitId,
      date,
      completed,
      value,
    }: {
      habitId: string;
      date: string;
      completed: boolean;
      value?: number;
    }) => upsertLog(habitId, date, completed, value),
    onSuccess: (_data, { date }) => {
      // Invalidate both date-specific and month queries
      qc.invalidateQueries({ queryKey: ['clearday', 'habit-logs', 'date', date] });
      qc.invalidateQueries({ queryKey: ['clearday', 'habit-logs', 'month', date.slice(0, 7)] });
    },
  });
}
