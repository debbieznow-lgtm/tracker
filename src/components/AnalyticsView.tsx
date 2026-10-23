import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Waves,
  Zap,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { DailyCheckIn, Habit, UrgeLog } from '../types/habit';
import { getCleanTimeBreakdown } from '../utils/storage';

interface AnalyticsViewProps {
  habits: Habit[];
  checkIns: DailyCheckIn[];
  urgeLogs: UrgeLog[];
  currencySymbol: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  habits,
  checkIns,
  urgeLogs,
  currencySymbol,
}) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
  const [weeklyMetricMode, setWeeklyMetricMode] = useState<'rate' | 'count'>('rate');

  // Weekly Summary (Last 7 Days) data for Recharts LineChart
  const weeklySummaryData = React.useMemo(() => {
    const today = new Date();
    const targetHabits =
      selectedHabitId === 'all'
        ? habits.filter(h => !h.archived)
        : habits.filter(h => h.id === selectedHabitId);
    const totalPossible = Math.max(1, targetHabits.length);

    const data: {
      dateStr: string;
      dayLabel: string;
      fullDateLabel: string;
      completedCount: number;
      totalPossible: number;
      completionRate: number;
      buildCompleted: number;
      quitCompleted: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDateLabel = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const dayChecks = checkIns.filter(
        c =>
          c.date === dStr &&
          c.completed &&
          (selectedHabitId === 'all'
            ? targetHabits.some(h => h.id === c.habitId)
            : c.habitId === selectedHabitId)
      );

      const buildCompleted = dayChecks.filter(c => {
        const h = habits.find(hab => hab.id === c.habitId);
        return h?.type === 'build';
      }).length;

      const quitCompleted = dayChecks.filter(c => {
        const h = habits.find(hab => hab.id === c.habitId);
        return h?.type === 'quit';
      }).length;

      const completedCount = dayChecks.length;
      const completionRate = Math.min(100, Math.round((completedCount / totalPossible) * 100));

      data.push({
        dateStr: dStr,
        dayLabel: i === 0 ? `${dayLabel} (Today)` : dayLabel,
        fullDateLabel,
        completedCount,
        totalPossible,
        completionRate,
        buildCompleted,
        quitCompleted,
      });
    }

    return data;
  }, [checkIns, habits, selectedHabitId]);

  const weeklyStats = React.useMemo(() => {
    const totalCheckIns = weeklySummaryData.reduce((sum, d) => sum + d.completedCount, 0);
    const avgCompletionRate = Math.round(
      weeklySummaryData.reduce((sum, d) => sum + d.completionRate, 0) /
        Math.max(1, weeklySummaryData.length)
    );
    const bestDay = [...weeklySummaryData].sort(
      (a, b) => b.completionRate - a.completionRate || b.completedCount - a.completedCount
    )[0];

    const firstHalfAvg =
      (weeklySummaryData[0]?.completionRate +
        weeklySummaryData[1]?.completionRate +
        weeklySummaryData[2]?.completionRate) /
      3;
    const secondHalfAvg =
      (weeklySummaryData[4]?.completionRate +
        weeklySummaryData[5]?.completionRate +
        weeklySummaryData[6]?.completionRate) /
      3;
    const momentumDelta = Math.round(secondHalfAvg - firstHalfAvg);

    return {
      totalCheckIns,
      avgCompletionRate,
      bestDay,
      momentumDelta,
    };
  }, [weeklySummaryData]);

  // Heatmap generation: last 60 days
  const heatmapDays = React.useMemo(() => {
    const days: { dateStr: string; dayNum: number; count: number; totalPossible: number }[] = [];
    const today = new Date();

    for (let i = 59; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];

      // Relevant check-ins
      const dayChecks = checkIns.filter(
        c => c.date === dStr && (selectedHabitId === 'all' || c.habitId === selectedHabitId) && c.completed
      );

      const targetHabits =
        selectedHabitId === 'all'
          ? habits.filter(h => !h.archived)
          : habits.filter(h => h.id === selectedHabitId);

      days.push({
        dateStr: dStr,
        dayNum: d.getDate(),
        count: dayChecks.length,
        totalPossible: Math.max(1, targetHabits.length),
      });
    }

    return days;
  }, [checkIns, habits, selectedHabitId]);

  // Financial calculations
  const quitHabits = habits.filter(h => h.type === 'quit' && !h.archived);
  const totalDailySaved = quitHabits.reduce((acc, h) => acc + (h.dailyCostSaved || 0), 0);

  const totalSavedSoFar = quitHabits.reduce((acc, h) => {
    const stats = getCleanTimeBreakdown(h);
    return acc + stats.moneySaved;
  }, 0);

  // Urge analytics
  const totalUrges = urgeLogs.length;
  const resistedUrges = urgeLogs.filter(u => u.resisted).length;
  const resistanceRate = totalUrges > 0 ? Math.round((resistedUrges / totalUrges) * 100) : 100;

  // Trigger breakdown
  const triggerCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    urgeLogs.forEach(u => {
      map[u.trigger] = (map[u.trigger] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [urgeLogs]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Evidence & Behavioral Insights</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Progress & Recovery Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track consistency trends, craving triggers, and financial wealth reclaimed.
            </p>
          </div>

          {/* Habit filter selector */}
          <div className="shrink-0">
            <select
              value={selectedHabitId}
              onChange={e => setSelectedHabitId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Habits & Tracks</option>
              {habits.map(h => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Summary Dashboard (7-Day Completion Trends Line Chart) */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Weekly Summary · Last 7 Days
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily completion trajectory across your active recovery and habit tracks.
            </p>
          </div>

          {/* Segmented metric toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setWeeklyMetricMode('rate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                weeklyMetricMode === 'rate'
                  ? 'bg-teal-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Completion %
            </button>
            <button
              onClick={() => setWeeklyMetricMode('count')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                weeklyMetricMode === 'count'
                  ? 'bg-teal-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Check-In Count
            </button>
          </div>
        </div>

        {/* Weekly Summary KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-xs text-slate-400 mb-1">7-Day Average Rate</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-teal-400 tabular-nums">
              {weeklyStats.avgCompletionRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Daily target adherence</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-xs text-slate-400 mb-1">Weekly Check-Ins</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {weeklyStats.totalCheckIns}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Completed in past 7 days</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-xs text-slate-400 mb-1">Peak Performance Day</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums truncate">
              {weeklyStats.bestDay ? weeklyStats.bestDay.dayLabel.replace(' (Today)', '') : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {weeklyStats.bestDay
                ? `${weeklyStats.bestDay.completionRate}% (${weeklyStats.bestDay.completedCount}/${weeklyStats.bestDay.totalPossible})`
                : 'No check-ins yet'}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-xs text-slate-400 mb-1">3-Day Momentum</div>
            <div
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                weeklyStats.momentumDelta >= 0 ? 'text-teal-400' : 'text-amber-400'
              }`}
            >
              {weeklyStats.momentumDelta >= 0 ? `+${weeklyStats.momentumDelta}%` : `${weeklyStats.momentumDelta}%`}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Recent vs earlier in week</div>
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-64 sm:h-72 w-full bg-slate-950/50 border border-slate-800/70 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklySummaryData}
              margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#1e293b' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={
                  weeklyMetricMode === 'rate'
                    ? [0, 100]
                    : [0, Math.max(5, weeklySummaryData[0]?.totalPossible || 5)]
                }
                allowDecimals={false}
                tickFormatter={val => (weeklyMetricMode === 'rate' ? `${val}%` : `${val}`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullDateLabel || ''
                }
                formatter={(value: any, name: any) => {
                  if (name === 'completionRate') {
                    return [`${value}%`, 'Completion Rate'];
                  }
                  if (name === 'completedCount') {
                    return [`${value} tracks`, 'Total Completed'];
                  }
                  if (name === 'quitCompleted') {
                    return [`${value} tracks`, 'Sobriety Check-Ins'];
                  }
                  if (name === 'buildCompleted') {
                    return [`${value} tracks`, 'Positive Habits'];
                  }
                  return [value, String(name || '')];
                }}
              />
              {weeklyMetricMode === 'rate' ? (
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  name="completionRate"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0f172a', stroke: '#2dd4bf', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#0f172a', strokeWidth: 2 }}
                />
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="completedCount"
                    name="completedCount"
                    stroke="#2dd4bf"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0f172a', stroke: '#2dd4bf', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#0f172a', strokeWidth: 2 }}
                  />
                  {selectedHabitId === 'all' && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="quitCompleted"
                        name="quitCompleted"
                        stroke="#818cf8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: '#0f172a', stroke: '#818cf8', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="buildCompleted"
                        name="buildCompleted"
                        stroke="#34d399"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: '#0f172a', stroke: '#34d399', strokeWidth: 2 }}
                      />
                    </>
                  )}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Breakdown Strip under the chart */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-4">
          {weeklySummaryData.map(day => (
            <div
              key={day.dateStr}
              className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-2 text-center"
            >
              <div className="text-[10px] text-slate-400 truncate">
                {day.dayLabel.replace(' (Today)', '')}
              </div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white tabular-nums mt-0.5">
                {day.completedCount}/{day.totalPossible}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    day.completionRate >= 80
                      ? 'text-teal-400'
                      : day.completionRate >= 40
                      ? 'text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  {day.completionRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 60-Day Consistency Heatmap Grid */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white">
              60-Day Consistency Grid
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1.5 sm:gap-2 pt-2">
          {heatmapDays.map(d => {
            const ratio = d.count / d.totalPossible;
            let bgClass = 'bg-slate-800/70 border-slate-700/50';

            if (d.count > 0) {
              if (ratio <= 0.33) bgClass = 'bg-teal-500/30 border-teal-500/40 text-teal-200';
              else if (ratio <= 0.66) bgClass = 'bg-teal-500/60 border-teal-500/70 text-white';
              else bgClass = 'bg-teal-400 border-teal-300 text-slate-950 font-bold';
            }

            return (
              <div
                key={d.dateStr}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${bgClass}`}
                title={`${d.dateStr}: ${d.count} completed`}
              >
                <span>{d.dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Reclaim Projections */}
      {quitHabits.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Wealth & Savings Projections
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 mb-1">Total Saved So Far</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {currencySymbol}
                {totalSavedSoFar.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Directly in your pocket</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 mb-1">30-Day Projection</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                {currencySymbol}
                {(totalDailySaved * 30).toFixed(0)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Based on daily spending</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 mb-1">1-Year Milestone</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-teal-400 tabular-nums">
                {currencySymbol}
                {(totalDailySaved * 365).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Equivalent to a luxury vacation</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 mb-1">5-Year Compounded</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400 tabular-nums">
                {currencySymbol}
                {(totalDailySaved * 365 * 5).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Major asset or life milestone</div>
            </div>
          </div>
        </div>
      )}

      {/* Craving & Urge Resilience Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Craving Success Rate */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Waves className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Craving Resistance Rate
            </h3>
          </div>

          <div className="flex items-center justify-between mb-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <div className="text-3xl font-extrabold font-mono text-teal-400 tabular-nums">
                {resistanceRate}%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {resistedUrges} resisted out of {totalUrges} logged urges
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-white">Neural Strength</div>
              <div className="text-xs text-teal-400 font-medium">Re-wiring dominant pathways</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Top Craving Triggers</div>
            {triggerCounts.length > 0 ? (
              triggerCounts.map(([trig, count]) => {
                const pct = totalUrges > 0 ? Math.round((count / totalUrges) * 100) : 0;
                return (
                  <div key={trig} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="capitalize">{trig.replace('_', ' ')}</span>
                      <span className="font-mono text-slate-300">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-400 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 italic">
                No urge logs recorded yet. Use the "Ride Urge Wave" tool whenever a craving hits!
              </p>
            )}
          </div>
        </div>

        {/* Urge Journal Feed */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-semibold text-white">Recent Urge Journal</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{urgeLogs.length} logged</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {urgeLogs.length > 0 ? (
              urgeLogs.slice(0, 6).map(u => (
                <div
                  key={u.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-mono">{new Date(u.timestamp).toLocaleDateString()}</span>
                    <span className="capitalize text-teal-400 font-medium">
                      Trigger: {u.trigger.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-slate-300">Peak: {u.intensity}/10</span>
                  </div>
                  {u.notes && <p className="text-slate-300 italic">"{u.notes}"</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                No journal entries yet. Log cravings and victories to build self-knowledge.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
