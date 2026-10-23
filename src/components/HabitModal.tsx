import React, { useState } from 'react';
import { X, Sparkles, Shield, Trash2, ListChecks } from 'lucide-react';
import { Habit, HabitCategory, HabitType, QuitStrategy, RoutineStep, TimeOfDay } from '../types/habit';
import { ICON_OPTIONS, renderIcon } from '../utils/iconMap';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHabit: (habit: Habit) => void;
  habitToEdit?: Habit | null;
  currencySymbol: string;
}

interface HabitTemplate {
  name: string;
  type: HabitType;
  category: HabitCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
  substanceOrVice?: string;
  quitStrategy?: QuitStrategy;
  dailyCostSaved?: number;
  dailyMinutesReclaimed?: number;
  reasonsToQuit?: string[];
  routines?: RoutineStep[];
  communityCircleId?: string;
  targetUnit?: string;
  targetValue?: number;
  timeOfDay?: TimeOfDay;
}

const PRESET_TEMPLATES: HabitTemplate[] = [
  {
    name: 'Mindful Eating / Quit Sugar',
    type: 'quit',
    category: 'eating',
    title: 'Mindful Eating & Quit Late-Night Sugar',
    description: 'Stop stress-snacking, ultra-processed sugar spikes, and late-night kitchen raids.',
    icon: 'Utensils',
    color: 'emerald',
    substanceOrVice: 'Sugar & Binge Eating',
    quitStrategy: 'harm_reduction',
    dailyCostSaved: 14.0,
    dailyMinutesReclaimed: 40,
    communityCircleId: 'eating',
    reasonsToQuit: [
      'Eliminate afternoon glucose crashes and brain fog',
      'Wake up with steady digestion and natural morning appetite',
    ],
    routines: [
      {
        id: 'tmpl-eat-1',
        title: '12oz Warm Water & Apple Cider Protocol',
        timing: '15 mins before dinner or snacking urge',
        description: 'Drink a tall glass of water to activate stomach stretch receptors before reaching for snacks.',
        completedDates: [],
      },
      {
        id: 'tmpl-eat-2',
        title: '8:30 PM Kitchen Shutdown & Herbal Tea',
        timing: 'Every evening at 8:30 PM',
        description: 'Dim kitchen lights, brew peppermint tea, and brush teeth immediately to signal kitchen closed.',
        completedDates: [],
      },
      {
        id: 'tmpl-eat-3',
        title: 'HALT Hunger Audit (Hungry, Angry, Lonely, Tired)',
        timing: 'Whenever a sudden sugar craving hits',
        description: 'Score physical stomach hunger 1–10. If under 6, do 10 deep breaths instead of grazing.',
        completedDates: [],
      },
    ],
  },
  {
    name: 'Quit Drinking / Alcohol',
    type: 'quit',
    category: 'drinking',
    title: 'Alcohol-Free & Clear Nights',
    description: 'Eliminate evening drinking, restore deep REM sleep, and wake up energized.',
    icon: 'Wine',
    color: 'indigo',
    substanceOrVice: 'Alcohol',
    quitStrategy: 'cold_turkey',
    dailyCostSaved: 18.0,
    dailyMinutesReclaimed: 120,
    communityCircleId: 'drinking',
    reasonsToQuit: [
      'Never wake up with 3 AM racing heart or hangover regret',
      'Restore liver vitality, clear skin, and sharp morning focus',
    ],
    routines: [
      {
        id: 'tmpl-drink-1',
        title: '5:00 PM Botanical Tonic Pour Ritual',
        timing: 'At work-to-home transition (5–6 PM)',
        description: 'Pour sparkling water with tart cherry or lime in a heavy glass to satisfy the pouring cue.',
        completedDates: [],
      },
      {
        id: 'tmpl-drink-2',
        title: 'Social First-Drink Decoy Script',
        timing: 'Before arriving at dinners or bars',
        description: 'Order club soda with bitters immediately so your hands are full and peer pressure disappears.',
        completedDates: [],
      },
      {
        id: 'tmpl-drink-3',
        title: 'Evening Magnesium & Reading Wind-Down',
        timing: '9:30 PM bedtime prep',
        description: 'Replace the nightcap drink with magnesium glycinate and 10 pages of fiction.',
        completedDates: [],
      },
    ],
  },
  {
    name: 'Beat Procrastination',
    type: 'quit',
    category: 'procrastination',
    title: 'Zero Procrastination & Deep Action',
    description: 'Overcome task paralysis, perfectionism anxiety, and tab-switching.',
    icon: 'Timer',
    color: 'amber',
    substanceOrVice: 'Procrastination',
    quitStrategy: 'cold_turkey',
    dailyCostSaved: 0,
    dailyMinutesReclaimed: 110,
    communityCircleId: 'procrastination',
    reasonsToQuit: [
      'Finish priority work early and enjoy guilt-free evenings',
      'Replace dread of hard tasks with momentum and self-trust',
    ],
    routines: [
      {
        id: 'tmpl-proc-1',
        title: 'The 2-Minute Micro-Launch Rule',
        timing: 'When stalling on a dreaded task',
        description: 'Commit to working on the hardest file for only 120 seconds—starting breaks 80% of resistance.',
        completedDates: [],
      },
      {
        id: 'tmpl-proc-2',
        title: 'Single-Tab 25-Min Sprint',
        timing: '9:00 AM & 2:00 PM anchor blocks',
        description: 'Close all browser tabs except the active workspace and run a 25-minute countdown.',
        completedDates: [],
      },
      {
        id: 'tmpl-proc-3',
        title: 'Tomorrow Top-1 Frog Lock-In',
        timing: 'End of workday (5:30 PM)',
        description: 'Write the exact first action step for tomorrow morning on a sticky note before shutting down.',
        completedDates: [],
      },
    ],
  },
  {
    name: 'Social Media / Screen Time',
    type: 'quit',
    category: 'screen_time',
    title: 'Social Media & Screen Time Detox',
    description: 'Stop algorithmic reels loops, morning phone checking, and bedtime scrolling.',
    icon: 'Smartphone',
    color: 'sky',
    substanceOrVice: 'Social Media & Screen Time',
    quitStrategy: 'harm_reduction',
    dailyCostSaved: 0,
    dailyMinutesReclaimed: 95,
    communityCircleId: 'screen_time',
    reasonsToQuit: [
      'Reclaim 11+ hours a week for real-world hobbies and focus',
      'End comparison anxiety and fragmented attention span',
    ],
    routines: [
      {
        id: 'tmpl-scr-1',
        title: 'First 45 Mins Phone-Outside-Bedroom',
        timing: 'Immediately upon waking',
        description: 'Charge phone in the hallway; get sunlight and water before looking at any notifications.',
        completedDates: [],
      },
      {
        id: 'tmpl-scr-2',
        title: 'Grayscale Mode & App Logout at 8 PM',
        timing: 'Every evening at 8:00 PM',
        description: 'Switch screen to black-and-white to strip visual dopamine hooks from short-form video feeds.',
        completedDates: [],
      },
      {
        id: 'tmpl-scr-3',
        title: '10-Minute Analog Boredom Walk',
        timing: 'Afternoon break instead of scrolling',
        description: 'Step outside without earbuds or phone to let default-mode brain networks reset.',
        completedDates: [],
      },
    ],
  },
  {
    name: 'Quit Vaping / Nicotine',
    type: 'quit',
    category: 'substance',
    title: 'Quit Vaping & Nicotine',
    description: 'Restore lung capacity, clear vascular strain, and break nicotine grip.',
    icon: 'Wind',
    color: 'teal',
    substanceOrVice: 'Nicotine / Vaping',
    quitStrategy: 'cold_turkey',
    dailyCostSaved: 12.0,
    dailyMinutesReclaimed: 45,
    communityCircleId: 'nicotine',
    reasonsToQuit: [
      'Stop waking up with morning wheezing and shortness of breath',
      'Save over $4,300 every year',
    ],
    routines: [
      {
        id: 'tmpl-nic-1',
        title: 'Ice Water Straw & 4-7-8 Breath',
        timing: 'Whenever a hand-to-mouth craving peaks',
        description: 'Sip ice-cold water through a straw to mimic the draw sensation and exhale for 8 seconds.',
        completedDates: [],
      },
    ],
  },
  {
    name: 'Daily Meditation',
    type: 'build',
    category: 'mind',
    title: 'Morning Mindfulness & Breath',
    description: '10 minutes of silent presence and vagus nerve calibration.',
    icon: 'Sparkles',
    color: 'emerald',
    targetUnit: 'mins',
    targetValue: 10,
    timeOfDay: 'morning',
  },
  {
    name: '2.5L Clean Water',
    type: 'build',
    category: 'health',
    title: 'Hydrate 2.5 Liters',
    description: 'Metabolic flush, mental acuity, and cellular vitality.',
    icon: 'Droplets',
    color: 'sky',
    targetUnit: 'glasses',
    targetValue: 8,
    timeOfDay: 'anytime',
  },
];

const CATEGORY_OPTIONS: { id: HabitCategory; label: string }[] = [
  { id: 'eating', label: 'Eating & Sugar' },
  { id: 'drinking', label: 'Drinking & Alcohol' },
  { id: 'procrastination', label: 'Procrastination & Focus' },
  { id: 'screen_time', label: 'Social Media / Screen Time' },
  { id: 'substance', label: 'Nicotine / Substance' },
  { id: 'health', label: 'Health & Hydration' },
  { id: 'mind', label: 'Mindfulness' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'finances', label: 'Finances' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSaveHabit,
  habitToEdit,
  currencySymbol,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<HabitType>(habitToEdit?.type || 'quit');
  const [title, setTitle] = useState(habitToEdit?.title || '');
  const [description, setDescription] = useState(habitToEdit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(habitToEdit?.category || 'eating');
  const [icon, setIcon] = useState(habitToEdit?.icon || 'Utensils');
  const [color, setColor] = useState(habitToEdit?.color || 'teal');

  // Build specific
  const [targetUnit, setTargetUnit] = useState(habitToEdit?.targetUnit || 'mins');
  const [targetValue, setTargetValue] = useState<number>(habitToEdit?.targetValue || 1);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(habitToEdit?.timeOfDay || 'anytime');
  const [frequency] = useState<'daily' | 'weekly'>(habitToEdit?.frequency || 'daily');

  // Quit specific
  const [substanceOrVice, setSubstanceOrVice] = useState(
    habitToEdit?.substanceOrVice || 'Sugar & Binge Eating'
  );
  const [quitStrategy, setQuitStrategy] = useState<QuitStrategy>(
    habitToEdit?.quitStrategy || 'harm_reduction'
  );
  const [quitDateStr, setQuitDateStr] = useState(() => {
    if (habitToEdit?.quitDate) {
      return habitToEdit.quitDate.substring(0, 16);
    }
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().substring(0, 16);
  });
  const [dailyCostSaved, setDailyCostSaved] = useState<number>(
    habitToEdit?.dailyCostSaved !== undefined ? habitToEdit.dailyCostSaved : 10
  );
  const [dailyMinutesReclaimed, setDailyMinutesReclaimed] = useState<number>(
    habitToEdit?.dailyMinutesReclaimed !== undefined ? habitToEdit.dailyMinutesReclaimed : 45
  );
  const [reasons, setReasons] = useState<string[]>(
    habitToEdit?.reasonsToQuit || ['Reclaim physical health and mental clarity']
  );
  const [newReasonInput, setNewReasonInput] = useState('');

  // Routines to help quit / reduce
  const [routines, setRoutines] = useState<RoutineStep[]>(habitToEdit?.routines || []);
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineTiming, setRoutineTiming] = useState('When craving or trigger hits');
  const [routineDesc, setRoutineDesc] = useState('');

  // Harm reduction settings
  const [harmBaseline] = useState<number>(
    habitToEdit?.harmReduction?.baselineDailyAmount || 15
  );
  const [harmLimit] = useState<number>(
    habitToEdit?.harmReduction?.currentDailyLimit || 5
  );
  const [harmUnit] = useState<string>(
    habitToEdit?.harmReduction?.stepUnit || 'times/day'
  );

  const applyTemplate = (tmpl: HabitTemplate) => {
    setType(tmpl.type);
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setCategory(tmpl.category);
    setIcon(tmpl.icon);
    setColor(tmpl.color);

    if (tmpl.routines) {
      setRoutines(
        tmpl.routines.map(r => ({
          ...r,
          id: `rt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        }))
      );
    } else {
      setRoutines([]);
    }

    if (tmpl.type === 'quit') {
      setSubstanceOrVice(tmpl.substanceOrVice || '');
      setQuitStrategy(tmpl.quitStrategy || 'cold_turkey');
      setDailyCostSaved(tmpl.dailyCostSaved || 0);
      setDailyMinutesReclaimed(tmpl.dailyMinutesReclaimed || 0);
      if (tmpl.reasonsToQuit) setReasons(tmpl.reasonsToQuit);
    } else {
      setTargetUnit(tmpl.targetUnit || 'mins');
      setTargetValue(tmpl.targetValue || 1);
      setTimeOfDay(tmpl.timeOfDay || 'anytime');
    }
  };

  const handleAddReason = () => {
    if (!newReasonInput.trim()) return;
    setReasons([...reasons, newReasonInput.trim()]);
    setNewReasonInput('');
  };

  const handleRemoveReason = (idx: number) => {
    setReasons(reasons.filter((_, i) => i !== idx));
  };

  const handleAddRoutine = () => {
    if (!routineTitle.trim()) return;
    const nextStep: RoutineStep = {
      id: `rt-${Date.now()}`,
      title: routineTitle.trim(),
      timing: routineTiming.trim() || 'Daily anchor',
      description: routineDesc.trim() || 'Follow this routine step to interrupt the habit loop.',
      completedDates: [],
    };
    setRoutines([...routines, nextStep]);
    setRoutineTitle('');
    setRoutineDesc('');
  };

  const handleRemoveRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const circleMap: Record<string, string> = {
      eating: 'eating',
      drinking: 'drinking',
      procrastination: 'procrastination',
      screen_time: 'screen_time',
      digital: 'screen_time',
      substance: 'nicotine',
    };

    const baseHabit: Habit = {
      id: habitToEdit?.id || `habit-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      icon,
      color,
      createdAt: habitToEdit?.createdAt || new Date().toISOString(),
      frequency,
      timeOfDay,
      archived: false,
      routines,
      communityCircleId: habitToEdit?.communityCircleId || circleMap[category] || 'eating',
    };

    if (type === 'build') {
      baseHabit.targetUnit = targetUnit;
      baseHabit.targetValue = targetValue;
    } else {
      baseHabit.substanceOrVice = substanceOrVice.trim();
      baseHabit.quitStrategy = quitStrategy;
      baseHabit.quitDate = new Date(quitDateStr).toISOString();
      baseHabit.dailyCostSaved = Number(dailyCostSaved) || 0;
      baseHabit.dailyMinutesReclaimed = Number(dailyMinutesReclaimed) || 0;
      baseHabit.reasonsToQuit = reasons;
      baseHabit.relapseHistory = habitToEdit?.relapseHistory || [];

      if (quitStrategy === 'harm_reduction') {
        baseHabit.harmReduction = {
          stepUnit: harmUnit,
          baselineDailyAmount: harmBaseline,
          currentDailyLimit: harmLimit,
          targetDailyLimit: 0,
          reductionStepIntervalDays: 7,
        };
      }
    }

    onSaveHabit(baseHabit);
    onClose();
  };

  const colorOptions = [
    { id: 'teal', label: 'Teal' },
    { id: 'emerald', label: 'Emerald' },
    { id: 'indigo', label: 'Indigo' },
    { id: 'sky', label: 'Sky' },
    { id: 'amber', label: 'Amber' },
    { id: 'rose', label: 'Rose' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">
          {habitToEdit ? 'Edit Track & Routines' : 'Create New Track'}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Track eating, drinking, procrastination, screen time, or build positive daily rituals—complete with quit routines and community support.
        </p>

        {/* Quick Presets Carousel */}
        {!habitToEdit && (
          <div className="mb-6">
            <span className="text-xs text-slate-400 font-medium block mb-2">
              One-Click Specialized Trackers (Includes Quit Routines & Community):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {renderIcon(tmpl.icon, 'w-3.5 h-3.5 text-teal-400')}
                  <span>{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Track Type Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Track Type</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setType('quit')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'quit'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  <span>Quit / Reduce</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('build')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'build'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Build Habit</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tracker Category & Community Circle
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as HabitCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Mindful Eating & Quit Late-Night Sugar"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description / Intention
              </label>
              <input
                type="text"
                placeholder="Why this matters to your life..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Icon & Color Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Icon</label>
              <div className="grid grid-cols-6 gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl max-h-28 overflow-y-auto">
                {ICON_OPTIONS.map(opt => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIcon(opt.name)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      icon === opt.name
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={opt.label}
                  >
                    {renderIcon(opt.name, 'w-4 h-4')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color Accent</label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer capitalize ${
                      color === c.id
                        ? 'border-teal-400 text-teal-300 bg-teal-500/10 font-bold'
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Routines to Help Quit / Reduce */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-4 h-4" />
                <span>Routines to Help Quit / Reduce ({routines.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Daily micro-protocols</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Routine step title (e.g. 8:30 PM Kitchen Closed)"
                value={routineTitle}
                onChange={e => setRoutineTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="When to do it (e.g. Before dinner / When urge hits)"
                value={routineTiming}
                onChange={e => setRoutineTiming(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="How it works (e.g. Drink peppermint tea & dim lights)"
                value={routineDesc}
                onChange={e => setRoutineDesc(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddRoutine}
                className="px-3 py-2 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                + Add Routine Step
              </button>
            </div>

            {routines.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {routines.map(step => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-900/90 rounded-xl text-xs border border-slate-800"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {step.title}{' '}
                        <span className="text-teal-400 font-mono">({step.timing})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {step.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRoutine(step.id)}
                      className="text-slate-500 hover:text-rose-400 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Specific to Quit Addiction */}
          {type === 'quit' && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Recovery & Reduction Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Habit / Substance
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sugar, Alcohol, Procrastination, Screen Time"
                    value={substanceOrVice}
                    onChange={e => setSubstanceOrVice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Streak Start (Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={quitDateStr}
                    onChange={e => setQuitDateStr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Strategy Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cessation Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuitStrategy('cold_turkey')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      quitStrategy === 'cold_turkey'
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Complete Quit</div>
                    <div className="text-[10px] text-slate-500">Full abstinence streak</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuitStrategy('harm_reduction')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      quitStrategy === 'harm_reduction'
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Mindful Reduction</div>
                    <div className="text-[10px] text-slate-500">Cut back with daily boundaries</div>
                  </button>
                </div>
              </div>

              {/* Financial & Time Savings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Cost Saved ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={dailyCostSaved}
                    onChange={e => setDailyCostSaved(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Minutes Reclaimed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dailyMinutesReclaimed}
                    onChange={e => setDailyMinutesReclaimed(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* "My Why" Reasons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reasons to Quit ("My Why")
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a core reason..."
                    value={newReasonInput}
                    onChange={e => setNewReasonInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddReason}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {reasons.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-900/80 rounded-lg text-xs text-slate-300 border border-slate-800"
                    >
                      <span className="truncate">{r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReason(i)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section: Specific to Build Habit */}
          {type === 'build' && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Habit Frequency & Targets
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={targetValue}
                    onChange={e => setTargetValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mins, glasses, pages"
                    value={targetUnit}
                    onChange={e => setTargetUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Time of Day
                  </label>
                  <select
                    value={timeOfDay}
                    onChange={e => setTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20 cursor-pointer"
            >
              {habitToEdit ? 'Save Changes' : 'Create Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

