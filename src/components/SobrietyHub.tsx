import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  DollarSign,
  Clock,
  Heart,
  TrendingDown,
  Sparkles,
  Waves,
  RefreshCw,
  Plus,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { Habit, HealthMilestone } from '../types/habit';
import { getCleanTimeBreakdown } from '../utils/storage';
import { getRelevantMilestones } from '../utils/milestones';
import { renderIcon } from '../utils/iconMap';

interface SobrietyHubProps {
  habits: Habit[];
  currencySymbol: string;
  onOpenNewHabit: () => void;
  onOpenRelapseModal: (habit: Habit) => void;
  onOpenUrgeSurferForHabit: (habit: Habit) => void;
  onUpdateHabit: (updatedHabit: Habit) => void;
}

export const SobrietyHub: React.FC<SobrietyHubProps> = ({
  habits,
  currencySymbol,
  onOpenNewHabit,
  onOpenRelapseModal,
  onOpenUrgeSurferForHabit,
  onUpdateHabit,
}) => {
  const quitHabits = habits.filter(h => h.type === 'quit' && !h.archived);
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    quitHabits[0]?.id || ''
  );
  const [showHelplines, setShowHelplines] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Keep live time ticking every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeHabit = quitHabits.find(h => h.id === selectedHabitId) || quitHabits[0];

  // Global calculations across all quit habits
  const totalFinancialSaved = quitHabits.reduce((acc, h) => {
    const stats = getCleanTimeBreakdown(h);
    return acc + stats.moneySaved;
  }, 0);

  const totalHoursReclaimed = quitHabits.reduce((acc, h) => {
    const stats = getCleanTimeBreakdown(h);
    return acc + stats.hoursReclaimed;
  }, 0);

  const longestDaysClean = quitHabits.reduce((acc, h) => {
    const stats = getCleanTimeBreakdown(h);
    return Math.max(acc, stats.days);
  }, 0);

  // Biological milestones for selected habit
  const milestones: HealthMilestone[] = React.useMemo(() => {
    if (!activeHabit) return [];
    return getRelevantMilestones(activeHabit.substanceOrVice);
  }, [activeHabit]);

  const activeStats = activeHabit ? getCleanTimeBreakdown(activeHabit) : null;

  // New Reason to Quit input state
  const [newReasonText, setNewReasonText] = useState('');
  const [isAddingReason, setIsAddingReason] = useState(false);

  const handleAddReason = () => {
    if (!newReasonText.trim() || !activeHabit) return;
    const existing = activeHabit.reasonsToQuit || [];
    const updated: Habit = {
      ...activeHabit,
      reasonsToQuit: [newReasonText.trim(), ...existing],
    };
    onUpdateHabit(updated);
    setNewReasonText('');
    setIsAddingReason(false);
  };

  const handleRemoveReason = (indexToRemove: number) => {
    if (!activeHabit) return;
    const existing = activeHabit.reasonsToQuit || [];
    const updated: Habit = {
      ...activeHabit,
      reasonsToQuit: existing.filter((_, idx) => idx !== indexToRemove),
    };
    onUpdateHabit(updated);
  };

  if (quitHabits.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Recovery Tracks</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Break free from substances, vaping, smoking, doomscrolling, alcohol, or unhealthy
          habits. Track your sober seconds, calculate money saved, and watch your body heal.
        </p>
        <button
          onClick={onOpenNewHabit}
          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Quitting / Sobriety Track</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Global Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Money Saved</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {currencySymbol}
              {totalFinancialSaved.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all quit tracks</div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Life Hours Reclaimed</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalHoursReclaimed.toFixed(1)} hrs
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Time returned to your life</div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Longest Clean Streak</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {longestDaysClean} days
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Unbroken commitment</div>
          </div>
        </div>
      </div>

      {/* Main Addiction Control Section */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        {/* Habit Selector Tabs if multiple */}
        {quitHabits.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800">
            {quitHabits.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHabitId(h.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  h.id === activeHabit.id
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {renderIcon(h.icon, 'w-4 h-4')}
                <span>{h.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Selected Habit Live Clean Timer Banner */}
        {activeHabit && activeStats && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize">{activeHabit.substanceOrVice || 'Addiction'}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {activeHabit.quitStrategy === 'harm_reduction'
                      ? 'Harm Reduction Taper'
                      : 'Complete Cold Turkey'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeHabit.title}
                </h2>
                {activeHabit.description && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    {activeHabit.description}
                  </p>
                )}
              </div>

              {/* Ticking Time Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center shrink-0">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                    {activeStats.days}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                    Days
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                    {activeStats.hours}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                    Hours
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                    {activeStats.minutes}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                    Mins
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-400 tabular-nums">
                    {activeStats.seconds}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                    Secs
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Strip */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenUrgeSurferForHabit(activeHabit)}
                className="px-4 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-950/20"
              >
                <Waves className="w-4 h-4 text-teal-400" />
                <span>Ride An Urge (Surfer)</span>
              </button>

              <button
                onClick={() => onOpenRelapseModal(activeHabit)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Log Relapse & Reflect</span>
              </button>
            </div>

            {/* Harm Reduction Panel (if applicable) */}
            {activeHabit.quitStrategy === 'harm_reduction' && activeHabit.harmReduction && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Harm Reduction Plan</h3>
                    <p className="text-xs text-slate-400">
                      Gradually tapering intake to zero rather than abrupt shock.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Current Daily Cap: </span>
                    <span className="text-sm font-bold font-mono text-teal-400">
                      {activeHabit.harmReduction.currentDailyLimit} {activeHabit.harmReduction.stepUnit}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-3">
                  {(() => {
                    const baseline = activeHabit.harmReduction.baselineDailyAmount || 1;
                    const current = activeHabit.harmReduction.currentDailyLimit;
                    const reductionPercent = Math.min(
                      100,
                      Math.max(0, Math.round(((baseline - current) / baseline) * 100))
                    );
                    return (
                      <div
                        className="bg-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${reductionPercent}%` }}
                      />
                    );
                  })()}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Starting Baseline: {activeHabit.harmReduction.baselineDailyAmount} {activeHabit.harmReduction.stepUnit}</span>
                  <span>Target: {activeHabit.harmReduction.targetDailyLimit} (Total Cessation)</span>
                </div>
              </div>
            )}

            {/* "My Why" Motivation Vault */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    My Why · Reasons to Stay Strong
                  </h3>
                </div>
                {!isAddingReason && (
                  <button
                    onClick={() => setIsAddingReason(true)}
                    className="text-xs px-2.5 py-1 rounded-lg text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Reason</span>
                  </button>
                )}
              </div>

              {isAddingReason && (
                <div className="mb-4 bg-slate-900 border border-slate-700/80 rounded-xl p-3 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="e.g. My child's future, saving $5,000 for travel, waking up without guilt..."
                    value={newReasonText}
                    onChange={e => setNewReasonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsAddingReason(false);
                        setNewReasonText('');
                      }}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReason}
                      className="px-3 py-1 text-xs font-semibold bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 cursor-pointer"
                    >
                      Save Reason
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeHabit.reasonsToQuit && activeHabit.reasonsToQuit.length > 0 ? (
                  activeHabit.reasonsToQuit.map((reason, idx) => (
                    <div
                      key={idx}
                      className="group bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs text-slate-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{reason}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveReason(idx)}
                        className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic col-span-2">
                    No reasons added yet. Documenting your core motivations increases long-term
                    recovery success by 300%.
                  </p>
                )}
              </div>
            </div>

            {/* Biological Health Recovery Milestones */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Biological Recovery Timeline
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {milestones.filter(m => activeStats.totalSeconds >= m.timeSeconds).length} /{' '}
                  {milestones.length} Milestones Achieved
                </span>
              </div>

              <div className="space-y-3">
                {milestones.map(m => {
                  const achieved = activeStats.totalSeconds >= m.timeSeconds;
                  const progressPct = Math.min(
                    100,
                    Math.round((activeStats.totalSeconds / m.timeSeconds) * 100)
                  );

                  return (
                    <div
                      key={m.id}
                      className={`border rounded-xl p-3.5 transition-all ${
                        achieved
                          ? 'bg-teal-500/5 border-teal-500/30'
                          : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              achieved
                                ? 'bg-teal-500 text-slate-950'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-xs sm:text-sm font-semibold ${
                                  achieved ? 'text-teal-200' : 'text-slate-300'
                                }`}
                              >
                                {m.title}
                              </h4>
                              {achieved && (
                                <span className="text-[10px] text-teal-400 font-medium">
                                  Unlocked
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                        </div>

                        {!achieved && (
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-medium text-slate-400 tabular-nums">
                              {progressPct}%
                            </span>
                          </div>
                        )}
                      </div>

                      {!achieved && (
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2.5">
                          <div
                            className="bg-teal-500/70 h-full rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Relapse / Past Learning History */}
            {activeHabit.relapseHistory && activeHabit.relapseHistory.length > 0 && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>Growth from Past Lapses ({activeHabit.relapseHistory.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Every bump in the road reveals a trigger to protect against in the future.
                </p>
                <div className="space-y-2">
                  {activeHabit.relapseHistory.map(rec => (
                    <div
                      key={rec.id}
                      className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-3 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="font-mono">{new Date(rec.date).toLocaleDateString()}</span>
                        <span className="capitalize text-slate-300">Trigger: {rec.trigger}</span>
                        <span className="font-mono text-teal-400">
                          {rec.daysSoberBefore} days achieved
                        </span>
                      </div>
                      {rec.reflection && (
                        <p className="text-slate-300 mt-1 italic">"{rec.reflection}"</p>
                      )}
                      {rec.actionPlanForNextTime && (
                        <p className="text-teal-300 mt-1 font-medium">
                          Next time plan: {rec.actionPlanForNextTime}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emergency Crisis / 24/7 Confidential Helplines Accordion */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowHelplines(!showHelplines)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">24/7 Confidential Crisis Support</div>
              <div className="text-xs text-slate-400">Free, private telephone & text hotlines</div>
            </div>
          </div>
          {showHelplines ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showHelplines && (
          <div className="p-5 pt-0 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="font-semibold text-white">988 Suicide & Crisis Lifeline</div>
              <div className="text-slate-400 mt-0.5">Call or text 988 (English & Spanish, 24/7)</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="font-semibold text-white">SAMHSA National Helpline</div>
              <div className="text-slate-400 mt-0.5">1-800-662-4357 (Substance abuse & mental health)</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="font-semibold text-white">National Smokefree Quitline</div>
              <div className="text-slate-400 mt-0.5">1-800-QUIT-NOW (1-800-784-8669)</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="font-semibold text-white">Crisis Text Line</div>
              <div className="text-slate-400 mt-0.5">Text HOME to 741741 to connect with a crisis counselor</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
