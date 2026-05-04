import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createHabit, deleteHabit, fetchHabits, updateHabit } from '../../data/cleardayApi';
import type { Habit } from '@repo/types';

const KEY = ['clearday', 'habits'];

export function useHabits() {
  const qc = useQueryClient();
  const { data: habits = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: fetchHabits });

  const create = useMutation({
    mutationFn: ({ name, type }: { name: string; type: Habit['type'] }) => createHabit(name, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const update = useMutation({
    mutationFn: ({ id, partial }: { id: string; partial: Partial<Pick<Habit, 'name' | 'type'>> }) =>
      updateHabit(id, partial),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { habits, isLoading, error, create, update, remove };
}
