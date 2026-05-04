import { useState, useEffect } from 'react';
import { Loader2, Trash2, CheckCircle2 } from 'lucide-react';
import { PhotoUpload } from '../../clearday/PhotoUpload';
import { HabitForm } from '../../clearday/HabitForm';
import { useMonthlySetup } from '../../../hooks/clearday/useMonthlySetup';
import { useHabits } from '../../../hooks/clearday/useHabits';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TYPE_ICONS: Record<string, string> = {
  steps: '👟',
  sleep: '😴',
  yoga: '🧘',
  nutrition: '🥗',
  manual: '✅',
  custom: '⭐',
};

export function SetupPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: setup, isLoading: loadingSetup, save } = useMonthlySetup();
  const { habits, isLoading: loadingHabits, create, remove } = useHabits();

  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  // Hydrate from existing setup
  useEffect(() => {
    if (setup) {
      setPhotoDataUrl(setup.photoDataUrl ?? '');
      setSelectedHabitIds(setup.habitIds ?? []);
    }
  }, [setup]);

  const handleAddHabit = async (name: string, type: string) => {
    const result = await create.mutateAsync({ name, type: type as any });
    setSelectedHabitIds((ids) => [...ids, result.id]);
  };

  const handleRemoveHabit = async (habitId: string) => {
    await remove.mutateAsync(habitId);
    setSelectedHabitIds((ids) => ids.filter((id) => id !== habitId));
  };

  const handleSave = async () => {
    await save.mutateAsync({ year, month, photoDataUrl, habitIds: selectedHabitIds });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const loading = loadingSetup || loadingHabits;
  const activeHabits = habits.filter((h) => selectedHabitIds.includes(h.id));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Month Setup</h1>
        <p className="text-secondary text-sm mt-1">
          {MONTH_NAMES[month - 1]} {year} · Configure your habits and motivational photo
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : (
        <>
          {/* Photo section */}
          <section className="ai-card rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-primary">Motivational Photo</h2>
            <p className="text-secondary text-sm">
              This photo becomes your blurred calendar wallpaper. As you complete habits each day, it
              progressively clears. At 100% it's crystal clear.
            </p>
            <PhotoUpload
              currentDataUrl={photoDataUrl}
              onUpload={(url) => setPhotoDataUrl(url)}
            />
          </section>

          {/* Habits section */}
          <section className="ai-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-primary">Habits</h2>
              <span className="text-secondary text-xs">{activeHabits.length} / 5</span>
            </div>
            <p className="text-secondary text-sm">
              Track up to 5 habits per month. Complete all habits on a day to earn that day on your
              calendar.
            </p>

            {/* Active habits list */}
            {activeHabits.length > 0 && (
              <ul className="space-y-2">
                {activeHabits.map((habit) => (
                  <li
                    key={habit.id}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <span className="text-xl">{TYPE_ICONS[habit.type] ?? '⭐'}</span>
                    <span className="flex-1 text-sm font-medium text-primary">{habit.name}</span>
                    <button
                      onClick={() => handleRemoveHabit(habit.id)}
                      disabled={remove.isPending}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add habit form */}
            <HabitForm
              existingCount={activeHabits.length}
              onAdd={handleAddHabit}
              isAdding={create.isPending}
            />
          </section>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={save.isPending || !photoDataUrl}
            className={[
              'w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300',
              saved
                ? 'bg-emerald-500 text-white'
                : 'ai-button text-white disabled:opacity-50 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            {save.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Saving…</>
            ) : saved ? (
              <><CheckCircle2 className="w-5 h-5" />Saved!</>
            ) : (
              'Save Month Setup'
            )}
          </button>

          {!photoDataUrl && (
            <p className="text-center text-secondary text-xs">
              Upload a photo to enable saving
            </p>
          )}
        </>
      )}
    </div>
  );
}
