import React, { useState } from 'react';
import { RefreshCw, HeartHandshake, X, ShieldAlert, Check } from 'lucide-react';
import { Habit, RelapseRecord, TriggerCategory } from '../types/habit';
import { getCleanTimeBreakdown } from '../utils/storage';

interface RelapseModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (updatedHabit: Habit) => void;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  habit,
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  const currentStats = getCleanTimeBreakdown(habit);
  const [trigger, setTrigger] = useState<TriggerCategory>('stress');
  const [notes, setNotes] = useState<string>('');
  const [reflection, setReflection] = useState<string>('');
  const [actionPlan, setActionPlan] = useState<string>('');

  const handleReset = () => {
    const relapseEntry: RelapseRecord = {
      id: `relapse-${Date.now()}`,
      date: new Date().toISOString(),
      trigger,
      notes,
      daysSoberBefore: currentStats.days,
      reflection,
      actionPlanForNextTime: actionPlan,
    };

    const existingRelapses = habit.relapseHistory || [];

    const updated: Habit = {
      ...habit,
      quitDate: new Date().toISOString(), // reset timer to now
      relapseHistory: [relapseEntry, ...existingRelapses],
    };

    onConfirmReset(updated);
    onClose();
  };

  const triggersList: { id: TriggerCategory; label: string }[] = [
    { id: 'stress', label: 'High Stress / Overwhelm' },
    { id: 'fatigue', label: 'Tired / Exhausted' },
    { id: 'boredom', label: 'Boredom / Understimulated' },
    { id: 'social', label: 'Social Pressure / Drinking setting' },
    { id: 'loneliness', label: 'Loneliness / Isolation' },
    { id: 'emotional_pain', label: 'Sadness / Anger / Anxiety' },
    { id: 'habitual_cue', label: 'Automatic Habit Loop (e.g. driving)' },
    { id: 'celebration', label: 'Celebration / "Just once"' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Compassionate Reset</h3>
            <p className="text-xs text-slate-400">Recovery is a journey of iteration, not perfection.</p>
          </div>
        </div>

        {/* Compassionate message */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-5 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong className="text-teal-400">You did not lose your progress.</strong> You reached{' '}
            <span className="font-bold text-white font-mono">{currentStats.days} clean days</span>.
            The biological healing and neural rewiring you achieved during those days does not vanish.
          </p>
          <p className="text-slate-400">
            A lapse only becomes a full relapse if you let shame spiral. Treat this moment with curious
            investigation: what can we learn so this trigger cannot fool you again?
          </p>
        </div>

        <div className="space-y-4">
          {/* Trigger question */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. What was the underlying trigger? (HALT check)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {triggersList.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTrigger(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer border ${
                    trigger === t.id
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* What happened reflection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. What was happening right before?
            </label>
            <input
              type="text"
              placeholder="e.g. Had an argument, stayed up past 2 AM, was around friends who were smoking..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Action plan for next time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              3. Next time this trigger appears, what will you do instead?
            </label>
            <input
              type="text"
              placeholder="e.g. Leave the room immediately, open Urge Surfer for 5 mins, call my brother..."
              value={actionPlan}
              onChange={e => setActionPlan(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-rose-950/40"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Clock & Commit Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
