import React, { useState, useEffect } from 'react';
import {
  Check,
  MoreHorizontal,
  Minus,
  Plus,
  RefreshCw,
  Waves,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { DailyCheckIn, Habit } from '../types/habit';
import { calculateHabitStats, getCleanTimeBreakdown, COMMUNITY_CIRCLES } from '../utils/storage';
import { renderIcon } from '../utils/iconMap';
import confetti from 'canvas-confetti';

interface HabitCardProps {
  habit: Habit;
  checkIns: DailyCheckIn[];
  selectedDate: string;
  currencySymbol: string;
  onToggleCheckIn: (habitId: string, date: string, value?: number) => void;
  onToggleRoutineStep?: (habitId: string, routineId: string) => void;
  onOpenCommunityCircle?: (circleId: string) => void;
  onOpenNotesForHabit?: (habit: Habit) => void;
  onOpenEdit: (habit: Habit) => void;
  onOpenRelapseModal: (habit: Habit) => void;
  onOpenUrgeSurferForHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  checkIns,
  selectedDate,
  currencySymbol,
  onToggleCheckIn,
  onToggleRoutineStep,
  onOpenCommunityCircle,
  onOpenNotesForHabit,
  onOpenEdit,
  onOpenRelapseModal,
  onOpenUrgeSurferForHabit,
  onDeleteHabit,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showRoutines, setShowRoutines] = useState(true);
  const [cleanBreakdown, setCleanBreakdown] = useState(() => getCleanTimeBreakdown(habit));

  useEffect(() => {
    if (habit.type !== 'quit' || !habit.quitDate) return;

    setCleanBreakdown(getCleanTimeBreakdown(habit));
    const interval = setInterval(() => {
      setCleanBreakdown(getCleanTimeBreakdown(habit));
    }, 1000);

    return () => clearInterval(interval);
  }, [habit]);

  const currentCheckIn = checkIns.find(c => c.habitId === habit.id && c.date === selectedDate);
  const isCompleted = currentCheckIn?.completed ?? false;
  const currentValue = currentCheckIn?.value ?? 0;

  const stats = calculateHabitStats(habit, checkIns);

  const handleToggle = () => {
    if (!isCompleted && habit.type === 'build') {
      confetti({
        particleCount: 18,
        spread: 36,
        origin: { y: 0.75 },
        colors: ['#14b8a6', '#e2e8f0'],
      });
    }

    if (habit.targetValue && habit.targetValue > 1) {
      const nextVal = isCompleted ? 0 : habit.targetValue;
      onToggleCheckIn(habit.id, selectedDate, nextVal);
    } else {
      onToggleCheckIn(habit.id, selectedDate);
    }
  };

  const handleAdjustValue = (delta: number) => {
    const next = Math.max(0, currentValue + delta);
    onToggleCheckIn(habit.id, selectedDate, next);
  };

  const accentTextMap: Record<string, string> = {
    teal: 'text-teal-400',
    emerald: 'text-emerald-400',
    indigo: 'text-indigo-400',
    sky: 'text-sky-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  };

  const accentText = accentTextMap[habit.color] || accentTextMap.teal;

  const routines = habit.routines || [];
  const completedRoutinesCount = routines.filter(r =>
    r.completedDates?.includes(selectedDate)
  ).length;

  const matchedCircle = COMMUNITY_CIRCLES.find(
    c => c.id === habit.communityCircleId || c.category === habit.category
  );

  const pad2 = (n: number) => String(n).padStart(2, '0');

  return (
    <article className="studio-card rounded-xl p-5 transition-all hover:border-slate-700/90 flex flex-col justify-between relative">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-slate-300 mt-0.5">
              {renderIcon(habit.icon, `w-4 h-4 ${accentText}`)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  {habit.category.replace('_', ' ')}
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  {habit.type === 'quit'
                    ? habit.quitStrategy === 'harm_reduction'
                      ? 'Cut Back Slowly'
                      : 'Quit Completely'
                    : `${habit.timeOfDay} habit`}
                </span>
              </div>

              <h3 className="text-[15px] font-semibold text-white tracking-tight mt-0.5 leading-snug">
                {habit.title}
              </h3>
            </div>
          </div>

          {/* Right Utility Actions */}
          <div className="relative shrink-0 flex items-center gap-1">
            {onOpenNotesForHabit && (
              <button
                onClick={() => onOpenNotesForHabit(habit)}
                className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-teal-300 hover:bg-slate-800/70 transition-colors flex items-center gap-1 cursor-pointer"
                title={`Write or view documentation notes for ${habit.title}`}
              >
                <FileText className="w-3 h-3 text-teal-400" />
                <span>Note</span>
              </button>
            )}

            {matchedCircle && onOpenCommunityCircle && (
              <button
                onClick={() => onOpenCommunityCircle(matchedCircle.id)}
                className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-0.5 cursor-pointer"
                title={`Support Group: ${matchedCircle.name}`}
              >
                <span>Group</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setConfirmDelete(false);
              }}
              className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800/70 transition-colors cursor-pointer"
              aria-label="Habit options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmDelete(false);
                  }}
                />
                <div className="absolute right-0 top-7 z-50 w-44 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenEdit(habit);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Edit Habit
                  </button>
                  {onOpenNotesForHabit && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenNotesForHabit(habit);
                      }}
                      className="w-full text-left px-3 py-1.5 text-teal-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Write / View Notes
                    </button>
                  )}
                  {matchedCircle && onOpenCommunityCircle && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenCommunityCircle(matchedCircle.id);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Open {matchedCircle.name}
                    </button>
                  )}
                  {habit.type === 'quit' && (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenUrgeSurferForHabit(habit);
                        }}
                        className="w-full text-left px-3 py-1.5 text-teal-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Calm a Craving
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenRelapseModal(habit);
                        }}
                        className="w-full text-left px-3 py-1.5 text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Reset Timer
                      </button>
                    </>
                  )}
                  <div className="border-t border-slate-800 my-1" />
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Delete Habit
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteHabit(habit.id);
                      }}
                      className="w-full text-left px-3 py-1.5 bg-rose-500/20 text-rose-300 font-semibold hover:bg-rose-500/30 transition-colors cursor-pointer"
                    >
                      Confirm Delete?
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {habit.description && (
          <p className="text-xs text-slate-400 mt-2 pl-1 leading-relaxed line-clamp-2">
            {habit.description}
          </p>
        )}

        {/* Quit Timer & Money Saved */}
        {habit.type === 'quit' && (
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 pl-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  TIME CLEAN
                </div>
                <div className="mt-1 flex items-baseline gap-1.5 font-mono tabular-nums">
                  <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                    {cleanBreakdown.days}
                  </span>
                  <span className="text-xs text-slate-500 mr-1.5">days</span>
                  <span className="text-lg sm:text-xl font-medium text-slate-200">
                    {pad2(cleanBreakdown.hours)}:{pad2(cleanBreakdown.minutes)}:
                    <span className={accentText}>{pad2(cleanBreakdown.seconds)}</span>
                  </span>
                </div>
              </div>

              {cleanBreakdown.moneySaved > 0 && (
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    MONEY SAVED
                  </div>
                  <div className="text-sm font-mono font-medium text-emerald-400 tabular-nums mt-0.5">
                    +{currencySymbol}
                    {cleanBreakdown.moneySaved.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* Clean inline action bar */}
            <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-slate-800/50 text-xs">
              <button
                onClick={() => onOpenUrgeSurferForHabit(habit)}
                className="text-slate-300 hover:text-teal-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Waves className="w-3.5 h-3.5 text-teal-400" />
                <span>Calm Craving (3 min)</span>
              </button>

              <button
                onClick={() => onOpenRelapseModal(habit)}
                className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset timer with note"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Timer</span>
              </button>
            </div>
          </div>
        )}

        {/* Daily Steps to Help Quit or Build */}
        {routines.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 pl-1">
            <button
              type="button"
              onClick={() => setShowRoutines(!showRoutines)}
              className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer mb-2"
            >
              <span>DAILY STEPS ({completedRoutinesCount}/{routines.length} DONE)</span>
              {showRoutines ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {showRoutines && (
              <div className="divide-y divide-slate-800/60 border-t border-slate-800/60">
                {routines.map((step, idx) => {
                  const isStepDone = step.completedDates?.includes(selectedDate) ?? false;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => onToggleRoutineStep && onToggleRoutineStep(habit.id, step.id)}
                      className="w-full text-left py-2 flex items-start gap-2.5 group cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isStepDone
                            ? 'bg-teal-400 text-slate-950'
                            : 'border border-slate-700 group-hover:border-slate-500 bg-slate-950'
                        }`}
                      >
                        {isStepDone ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500">
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={`text-xs font-medium transition-colors ${
                              isStepDone
                                ? 'line-through text-slate-500'
                                : 'text-slate-200 group-hover:text-white'
                            }`}
                          >
                            {step.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {step.timing}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                          {step.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Build Habit Footer */}
      {habit.type === 'build' && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 pl-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
            <span className="text-slate-200 font-medium">{stats.currentStreak}d streak</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-500">Peak {stats.longestStreak}d</span>
          </div>

          {habit.targetValue && habit.targetValue > 1 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5">
                <button
                  onClick={() => handleAdjustValue(-1)}
                  disabled={currentValue <= 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 font-mono text-xs tabular-nums text-slate-200">
                  {currentValue}/{habit.targetValue} {habit.targetUnit}
                </span>
                <button
                  onClick={() => handleAdjustValue(1)}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleToggle}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-slate-100 text-slate-950'
                    : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleToggle}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isCompleted
                  ? 'bg-slate-100 text-slate-950 font-semibold'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Logged' : 'Mark Done'}</span>
            </button>
          )}
        </div>
      )}
    </article>
  );
};


