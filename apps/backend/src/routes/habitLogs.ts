import { Router, Request, Response } from 'express';
import { deleteLog, getLogsByDate, getLogsByMonth, upsertLog } from '../data/habitLogs';

const router = Router();

// GET /api/clearday/habit-logs?date=YYYY-MM-DD  or  ?month=YYYY-MM
router.get('/', (req: Request, res: Response) => {
  const { date, month } = req.query as { date?: string; month?: string };
  if (date) return res.json({ success: true, data: getLogsByDate(date) });
  if (month) return res.json({ success: true, data: getLogsByMonth(month) });
  return res.status(400).json({ success: false, error: 'Provide date or month query param' });
});

// POST /api/clearday/habit-logs  { habitId, date, completed, value? }
router.post('/', (req: Request, res: Response) => {
  const { habitId, date, completed, value } = req.body as {
    habitId: string;
    date: string;
    completed: boolean;
    value?: number;
  };
  if (!habitId || !date || completed === undefined) {
    return res.status(400).json({ success: false, error: 'habitId, date and completed are required' });
  }
  const log = upsertLog(habitId, date, completed, value);
  res.json({ success: true, data: log });
});

// DELETE /api/clearday/habit-logs/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteLog(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Log not found' });
  res.json({ success: true });
});

export default router;
