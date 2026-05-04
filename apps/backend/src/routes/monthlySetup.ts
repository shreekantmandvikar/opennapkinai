import { Router, Request, Response } from 'express';
import { getCurrentSetup, getSetupByMonth, upsertSetup } from '../data/monthlySetup';

const router = Router();

// GET /api/clearday/monthly-setup/current
router.get('/current', (_req: Request, res: Response) => {
  const setup = getCurrentSetup();
  if (!setup) return res.status(404).json({ success: false, error: 'No setup for current month' });
  res.json({ success: true, data: setup });
});

// GET /api/clearday/monthly-setup/:year/:month
router.get('/:year/:month', (req: Request, res: Response) => {
  const year = parseInt(req.params.year, 10);
  const month = parseInt(req.params.month, 10);
  if (isNaN(year) || isNaN(month)) {
    return res.status(400).json({ success: false, error: 'Invalid year or month' });
  }
  const setup = getSetupByMonth(year, month);
  if (!setup) return res.status(404).json({ success: false, error: 'No setup for that month' });
  res.json({ success: true, data: setup });
});

// POST /api/clearday/monthly-setup  { year, month, photoDataUrl?, habitIds? }
router.post('/', (req: Request, res: Response) => {
  const { year, month, photoDataUrl, habitIds } = req.body as {
    year: number;
    month: number;
    photoDataUrl?: string;
    habitIds?: string[];
  };
  if (!year || !month) {
    return res.status(400).json({ success: false, error: 'year and month are required' });
  }
  const setup = upsertSetup(year, month, { photoDataUrl, habitIds });
  res.json({ success: true, data: setup });
});

export default router;
