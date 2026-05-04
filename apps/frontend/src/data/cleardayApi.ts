import { Habit, HabitLog, MonthlySetup } from '@repo/types';

const BASE = 'http://localhost:3001/api/clearday';

async function req<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json.data as T;
}

// ── Habits ──────────────────────────────────────────────────────────────────

export const fetchHabits = (): Promise<Habit[]> =>
  req<Habit[]>(`${BASE}/habits`);

export const createHabit = (name: string, type: Habit['type']): Promise<Habit> =>
  req<Habit>(`${BASE}/habits`, {
    method: 'POST',
    body: JSON.stringify({ name, type }),
  });

export const updateHabit = (id: string, partial: Partial<Pick<Habit, 'name' | 'type'>>): Promise<Habit> =>
  req<Habit>(`${BASE}/habits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(partial),
  });

export const deleteHabit = (id: string): Promise<void> =>
  req<void>(`${BASE}/habits/${id}`, { method: 'DELETE' });

// ── Habit Logs ───────────────────────────────────────────────────────────────

export const fetchLogsByDate = (date: string): Promise<HabitLog[]> =>
  req<HabitLog[]>(`${BASE}/habit-logs?date=${date}`);

export const fetchLogsByMonth = (yearMonth: string): Promise<HabitLog[]> =>
  req<HabitLog[]>(`${BASE}/habit-logs?month=${yearMonth}`);

export const upsertLog = (habitId: string, date: string, completed: boolean, value?: number): Promise<HabitLog> =>
  req<HabitLog>(`${BASE}/habit-logs`, {
    method: 'POST',
    body: JSON.stringify({ habitId, date, completed, value }),
  });

// ── Monthly Setup ────────────────────────────────────────────────────────────

export const fetchCurrentSetup = (): Promise<MonthlySetup> =>
  req<MonthlySetup>(`${BASE}/monthly-setup/current`);

export const fetchSetupByMonth = (year: number, month: number): Promise<MonthlySetup> =>
  req<MonthlySetup>(`${BASE}/monthly-setup/${year}/${month}`);

export const saveMonthlySetup = (
  year: number,
  month: number,
  photoDataUrl?: string,
  habitIds?: string[],
): Promise<MonthlySetup> =>
  req<MonthlySetup>(`${BASE}/monthly-setup`, {
    method: 'POST',
    body: JSON.stringify({ year, month, photoDataUrl, habitIds }),
  });
