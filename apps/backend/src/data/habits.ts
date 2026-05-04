import { Habit } from '@repo/types';

export const habits: Habit[] = [
  {
    id: 'habit-steps',
    name: 'Steps',
    type: 'steps',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'habit-sleep',
    name: 'Sleep',
    type: 'sleep',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'habit-yoga',
    name: 'Yoga',
    type: 'yoga',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllHabits = (): Habit[] => habits;

export const getHabitById = (id: string): Habit | undefined =>
  habits.find((h) => h.id === id);

export const createHabit = (habit: Habit): void => {
  habits.push(habit);
};

export const updateHabit = (id: string, partial: Partial<Habit>): Habit | undefined => {
  const habit = getHabitById(id);
  if (habit) Object.assign(habit, partial, { updatedAt: new Date() });
  return habit;
};

export const deleteHabit = (id: string): boolean => {
  const idx = habits.findIndex((h) => h.id === id);
  if (idx === -1) return false;
  habits.splice(idx, 1);
  return true;
};
