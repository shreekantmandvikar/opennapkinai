export type HabitType = 'manual' | 'steps' | 'sleep' | 'yoga' | 'nutrition' | 'custom';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number; // for numeric habits like steps
}

export interface MonthlySetup {
  id: string;
  year: number;
  month: number; // 1–12
  photoDataUrl: string; // base64 data URL
  habitIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
