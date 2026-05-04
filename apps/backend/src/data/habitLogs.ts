import { HabitLog } from '@repo/types';

export const habitLogs: HabitLog[] = [];

export const getLogsByDate = (date: string): HabitLog[] =>
  habitLogs.filter((l) => l.date === date);

export const getLogsByMonth = (yearMonth: string): HabitLog[] =>
  habitLogs.filter((l) => l.date.startsWith(yearMonth));

export const getLogById = (id: string): HabitLog | undefined =>
  habitLogs.find((l) => l.id === id);

export const upsertLog = (habitId: string, date: string, completed: boolean, value?: number): HabitLog => {
  const existing = habitLogs.find((l) => l.habitId === habitId && l.date === date);
  if (existing) {
    existing.completed = completed;
    if (value !== undefined) existing.value = value;
    return existing;
  }
  const newLog: HabitLog = {
    id: crypto.randomUUID(),
    habitId,
    date,
    completed,
    value,
  };
  habitLogs.push(newLog);
  return newLog;
};

export const deleteLog = (id: string): boolean => {
  const idx = habitLogs.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  habitLogs.splice(idx, 1);
  return true;
};
