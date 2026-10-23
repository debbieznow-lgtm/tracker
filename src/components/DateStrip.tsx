import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ selectedDate, onSelectDate }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const dates = React.useMemo(() => {
    const list: { dateStr: string; dayNum: string; dayName: string; isToday: boolean }[] = [];
    const baseDate = new Date(selectedDate + 'T12:00:00');

    for (let i = -5; i <= 2; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const str = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = String(d.getDate()).padStart(2, '0');

      list.push({
        dateStr: str,
        dayNum,
        dayName,
        isToday: str === todayStr,
      });
    }
    return list;
  }, [selectedDate, todayStr]);

  const handleShiftDays = (amount: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + amount);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const formattedParts = React.useMemo(() => {
    const d = new Date(selectedDate + 'T12:00:00');
    return {
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
      monthDay: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    };
  }, [selectedDate]);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-800/80">
      {/* Left: Simple Date Headline */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-400">
          <span>{selectedDate === todayStr ? 'TODAY’S CHECK-IN' : 'PAST DATE'}</span>
          <span aria-hidden="true">·</span>
          <span>{selectedDate}</span>
          {selectedDate !== todayStr && (
            <button
              onClick={() => onSelectDate(todayStr)}
              className="ml-2 text-teal-400 hover:underline cursor-pointer"
            >
              Back to Today
            </button>
          )}
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl text-white mt-1 leading-none">
          {formattedParts.weekday},{' '}
          <span className="italic text-slate-300">{formattedParts.monthDay}</span>
        </h1>
      </div>

      {/* Right: Compact 8-Day Horizon Strip */}
      <div className="flex items-center gap-1 self-start md:self-auto">
        <button
          onClick={() => handleShiftDays(-1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          title="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 bg-slate-900/70 border border-slate-800/90 rounded-xl p-1">
          {dates.map(item => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                onClick={() => onSelectDate(item.dateStr)}
                className={`flex flex-col items-center justify-center w-10 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm'
                    : item.isToday
                    ? 'text-teal-400 hover:bg-slate-800/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span
                  className={`text-[9px] uppercase tracking-wider ${
                    isSelected ? 'text-slate-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.dayName.slice(0, 2)}
                </span>
                <span className="text-xs font-mono tabular-nums mt-0.5">{item.dayNum}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handleShiftDays(1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          title="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

