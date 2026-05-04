import { MonthlySetup } from '@repo/types';

export const monthlySetups: MonthlySetup[] = [];

export const getSetupByMonth = (year: number, month: number): MonthlySetup | undefined =>
  monthlySetups.find((s) => s.year === year && s.month === month);

export const getCurrentSetup = (): MonthlySetup | undefined => {
  const now = new Date();
  return getSetupByMonth(now.getFullYear(), now.getMonth() + 1);
};

export const upsertSetup = (year: number, month: number, partial: Partial<MonthlySetup>): MonthlySetup => {
  const existing = getSetupByMonth(year, month);
  if (existing) {
    Object.assign(existing, partial, { updatedAt: new Date() });
    return existing;
  }
  const newSetup: MonthlySetup = {
    id: crypto.randomUUID(),
    year,
    month,
    photoDataUrl: '',
    habitIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  };
  monthlySetups.push(newSetup);
  return newSetup;
};
