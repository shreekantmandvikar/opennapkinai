import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Habit } from '@repo/types';

const PRESET_HABITS: Array<{ name: string; type: Habit['type'] }> = [
  { name: 'Steps', type: 'steps' },
  { name: 'Sleep', type: 'sleep' },
  { name: 'Yoga', type: 'yoga' },
  { name: 'Nutrition', type: 'nutrition' },
];

const TYPE_ICONS: Record<Habit['type'], string> = {
  steps: '👟',
  sleep: '😴',
  yoga: '🧘',
  nutrition: '🥗',
  manual: '✅',
  custom: '⭐',
};

interface HabitFormProps {
  existingCount: number;
  onAdd: (name: string, type: Habit['type']) => void;
  isAdding: boolean;
}

export function HabitForm({ existingCount, onAdd, isAdding }: HabitFormProps) {
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const maxReached = existingCount >= 5;

  const addPreset = (preset: { name: string; type: Habit['type'] }) => {
    if (maxReached) return;
    onAdd(preset.name, preset.type);
  };

  const addCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed || maxReached) return;
    onAdd(trimmed, 'custom');
    setCustomName('');
    setShowCustom(false);
  };

  if (maxReached) {
    return (
      <p className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
        Maximum 5 habits reached. Remove one to add another.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-secondary text-sm">Quick add a habit:</p>
      <div className="flex flex-wrap gap-2">
        {PRESET_HABITS.map((p) => (
          <button
            key={p.type}
            onClick={() => addPreset(p)}
            disabled={isAdding}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-primary hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <span>{TYPE_ICONS[p.type]}</span>
            {p.name}
          </button>
        ))}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-dashed border-slate-300 rounded-xl text-sm text-secondary hover:border-blue-300 hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Habit name…"
            maxLength={40}
            autoFocus
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            onClick={addCustom}
            disabled={!customName.trim() || isAdding}
            className="px-4 py-2.5 ai-button text-white rounded-xl text-sm disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
