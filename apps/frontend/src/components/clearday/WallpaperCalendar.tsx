import { CheckCircle, Circle } from 'lucide-react';
import type { DayStatus } from '../../hooks/clearday/useCompletion';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface WallpaperCalendarProps {
  photoDataUrl: string;
  blurPx: number;
  completionPct: number;
  dayStatuses: DayStatus[];
  year: number;
  month: number; // 1–12
}

export function WallpaperCalendar({
  photoDataUrl,
  blurPx,
  completionPct,
  dayStatuses,
  year,
  month,
}: WallpaperCalendarProps) {
  const today = getTodayStr();
  // First day of month: 0=Sun … 6=Sat
  const firstDow = new Date(year, month - 1, 1).getDay();

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl" style={{ aspectRatio: '9/16' }}>
      {/* Blurred background photo */}
      {photoDataUrl ? (
        <img
          src={photoDataUrl}
          alt="Monthly motivation"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
          style={{
            filter: `blur(${blurPx}px)`,
            transform: 'scale(1.12)', // prevents white edges from blur
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-indigo-800 to-slate-900" />
      )}

      {/* Subtle dark scrim for text legibility */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Calendar content */}
      <div className="absolute inset-0 flex flex-col px-5 py-6">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
            {year}
          </p>
          <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-md">
            {MONTH_NAMES[month - 1]}
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs font-bold">{completionPct}%</span>
            <span className="text-white/60 text-xs">complete</span>
          </div>
        </div>

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-white/50 text-xs font-medium">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1 flex-1 content-start">
          {/* Empty leading cells */}
          {Array.from({ length: firstDow }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}

          {dayStatuses.map((ds) => {
            const day = parseInt(ds.date.slice(8), 10);
            const isToday = ds.date === today;

            return (
              <div
                key={ds.date}
                className={[
                  'flex flex-col items-center justify-center aspect-square rounded-full mx-0.5',
                  ds.completed ? 'bg-emerald-400/70' : '',
                  ds.partial ? 'bg-white/15' : '',
                  isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : '',
                  ds.future ? 'opacity-30' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-xs font-semibold leading-none',
                    ds.completed ? 'text-white' : 'text-white/90',
                  ].join(' ')}
                >
                  {day}
                </span>
                {ds.completed && (
                  <CheckCircle className="w-2 h-2 text-white mt-0.5 opacity-80" />
                )}
                {ds.partial && !ds.completed && (
                  <Circle className="w-2 h-2 text-white/60 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer completion bar */}
        <div className="mt-4">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/40 text-[10px]">0%</span>
            <span className="text-white/40 text-[10px]">
              {completionPct >= 80 ? '🎉 Free month earned!' : '80% = free month'}
            </span>
            <span className="text-white/40 text-[10px]">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}
