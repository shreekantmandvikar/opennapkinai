import { Router, Request, Response } from 'express';
import { createHabit, deleteHabit, getAllHabits, getHabitById, updateHabit } from '../data/habits';
import { Habit } from '@repo/types';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: getAllHabits() });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body as Partial<Habit>;
  if (!body.name) {
    return res.status(400).json({ success: false, error: 'name is required' });
  }
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: body.name,
    type: body.type ?? 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  createHabit(habit);
  res.status(201).json({ success: true, data: habit });
});

router.put('/:id', (req: Request, res: Response) => {
  const habit = updateHabit(req.params.id, req.body);
  if (!habit) return res.status(404).json({ success: false, error: 'Habit not found' });
  res.json({ success: true, data: habit });
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteHabit(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Habit not found' });
  res.json({ success: true });
});

export default router;
