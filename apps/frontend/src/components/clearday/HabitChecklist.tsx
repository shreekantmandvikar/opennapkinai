import { Check, Loader2 } from 'lucide-react';
import type { Habit, HabitLog } from '@repo/types';
import { useUpsertLog } from '../../hooks/clearday/useHabitLogs';

interface HabitChecklistProps {
  habits: Habit[];
  logs: HabitLog[];
  date: string; // YYYY-MM-DD
}

const TYPE_ICONS: Record<Habit['type'], string> = {
  steps: '👟',
  sleep: '😴',
  yoga: '🧘',
  nutrition: '🥗',
  manual: '✅',
  custom: '⭐',
};

export function HabitChecklist({ habits, logs, date }: HabitChecklistProps) {
  const upsert = useUpsertLog();

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-secondary">
        No habits set up for this month. Head to Setup to add some.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {habits.map((habit) => {
        const log = logs.find((l) => l.habitId === habit.id);
        const done = log?.completed ?? false;
        const pending = upsert.isPending && upsert.variables?.habitId === habit.id;

        return (
          <li key={habit.id}>
            <button
              className={[
                'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left',
                done
                  ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-sm',
              ].join(' ')}
              onClick={() =>
                upsert.mutate({ habitId: habit.id, date, completed: !done })
              }
              disabled={pending}
            >
              {/* Icon */}
              <span className="text-2xl select-none">{TYPE_ICONS[habit.type]}</span>

              {/* Label */}
              <span className={['flex-1 font-medium', done ? 'text-emerald-800' : 'text-primary'].join(' ')}>
                {habit.name}
              </span>

              {/* Check indicator */}
              {pending ? (
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              ) : done ? (
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex-shrink-0" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
