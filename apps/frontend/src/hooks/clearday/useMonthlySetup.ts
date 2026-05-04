import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentSetup, saveMonthlySetup } from '../../data/cleardayApi';

const KEY = ['clearday', 'monthly-setup', 'current'];

export function useMonthlySetup() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchCurrentSetup,
    retry: false,
  });

  const save = useMutation({
    mutationFn: ({
      year,
      month,
      photoDataUrl,
      habitIds,
    }: {
      year: number;
      month: number;
      photoDataUrl?: string;
      habitIds?: string[];
    }) => saveMonthlySetup(year, month, photoDataUrl, habitIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { ...query, save };
}
