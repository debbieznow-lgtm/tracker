import React, { useState, useEffect, useRef } from 'react';
import {
  Waves,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Volume2,
  VolumeX,
  Wind,
  Shield,
  Brain,
  Smile
} from 'lucide-react';
import { Habit, TriggerCategory, UrgeLog } from '../types/habit';
import { playMindfulBell } from '../utils/audio';
import confetti from 'canvas-confetti';

interface UrgeSurferProps {
  habits: Habit[];
  defaultHabitId?: string;
  onSaveUrgeLog: (log: UrgeLog) => void;
  onFinish?: () => void;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const UrgeSurfer: React.FC<UrgeSurferProps> = ({
  habits,
  defaultHabitId,
  onSaveUrgeLog,
  onFinish,
}) => {
  const quitHabits = habits.filter(h => h.type === 'quit');
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    defaultHabitId || quitHabits[0]?.id || habits[0]?.id || ''
  );

  // Urge settings
  const [initialIntensity, setInitialIntensity] = useState<number>(7);
  const [currentIntensity, setCurrentIntensity] = useState<number>(7);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerCategory>('stress');
  const [notes, setNotes] = useState<string>('');

  // Timer state
  const [durationMinutes, setDurationMinutes] = useState<number>(3);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Breathing state
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState<number>(4);

  // Grounding technique tab
  const [activeTab, setActiveTab] = useState<'breathe' | 'grounding' | 'reframes'>('breathe');
  const [loggedSuccess, setLoggedSuccess] = useState<boolean>(false);

  // Ref to track elapsed surfing time
  const startSecondsRef = useRef<number>(3 * 60);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            if (soundEnabled) playMindfulBell('finish');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, soundEnabled]);

  // Box Breathing cycle (4s each)
  useEffect(() => {
    let breathTimer: NodeJS.Timeout | null = null;
    if (isActive) {
      breathTimer = setInterval(() => {
        setPhaseSeconds(prev => {
          if (prev <= 1) {
            // transition phase
            setBreathPhase(curr => {
              let next: BreathPhase = 'inhale';
              if (curr === 'inhale') next = 'hold1';
              else if (curr === 'hold1') next = 'exhale';
              else if (curr === 'exhale') next = 'hold2';
              else if (curr === 'hold2') next = 'inhale';

              if (soundEnabled && (next === 'inhale' || next === 'exhale')) {
                playMindfulBell('gentle');
              }
              return next;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (breathTimer) clearInterval(breathTimer);
    };
  }, [isActive, soundEnabled]);

  const handleSelectDuration = (mins: number) => {
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
    startSecondsRef.current = mins * 60;
    setIsActive(false);
  };

  const handleToggleTimer = () => {
    if (!isActive && soundEnabled) {
      playMindfulBell('deep');
    }
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(durationMinutes * 60);
    setBreathPhase('inhale');
    setPhaseSeconds(4);
  };

  const handleLogVictory = () => {
    const elapsedMinutes = Math.max(
      1,
      Math.round((startSecondsRef.current - secondsRemaining) / 60)
    );

    const log: UrgeLog = {
      id: `urge-${Date.now()}`,
      habitId: selectedHabitId,
      timestamp: new Date().toISOString(),
      intensity: initialIntensity,
      trigger: selectedTrigger,
      surfedMinutes: elapsedMinutes,
      resisted: true,
      notes: notes || `Surfed wave for ${elapsedMinutes}m. Intensity dropped from ${initialIntensity}/10 to ${currentIntensity}/10.`,
    };

    onSaveUrgeLog(log);
    setLoggedSuccess(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2dd4bf', '#38bdf8', '#fbbf24'],
    });

    if (soundEnabled) {
      playMindfulBell('finish');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const phaseInstruction = {
    inhale: 'Breathe in slowly through your nose...',
    hold1: 'Hold your breath gently...',
    exhale: 'Slowly exhale through pursed lips...',
    hold2: 'Rest peacefully in stillness...',
  };

  const triggersList: { id: TriggerCategory; label: string }[] = [
    { id: 'stress', label: 'Stress / Pressure' },
    { id: 'boredom', label: 'Boredom / Restlessness' },
    { id: 'habitual_cue', label: 'Habitual Cue / Routine' },
    { id: 'social', label: 'Social Situation' },
    { id: 'loneliness', label: 'Loneliness' },
    { id: 'fatigue', label: 'Tired / Exhausted' },
    { id: 'emotional_pain', label: 'Anxiety / Frustration' },
    { id: 'celebration', label: 'Celebration' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Introduction */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Waves className="w-4 h-4" />
              <span>Evidence-Based Craving Surfing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Ride the Wave: The Urge Surfer
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Cravings feel permanent in the moment, but brain science shows they peak like an ocean wave
              within 5–10 minutes and break. You do not need to fight it—just observe and ride it.
            </p>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="self-start sm:self-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chimes On' : 'Chimes Muted'}</span>
          </button>
        </div>

        {/* Setup Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          {/* Target Track */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Which Urge Are You Surfing?
            </label>
            <select
              value={selectedHabitId}
              onChange={e => setSelectedHabitId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {habits.map(h => (
                <option key={h.id} value={h.id}>
                  {h.title} ({h.type === 'quit' ? 'Sobriety' : 'Habit'})
                </option>
              ))}
            </select>
          </div>

          {/* Trigger selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Identified Trigger
            </label>
            <select
              value={selectedTrigger}
              onChange={e => setSelectedTrigger(e.target.value as TriggerCategory)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {triggersList.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Initial Craving Intensity */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Craving Intensity:</span>
              <span className="font-bold font-mono text-teal-400 tabular-nums">
                {initialIntensity} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={initialIntensity}
              onChange={e => {
                const val = Number(e.target.value);
                setInitialIntensity(val);
                setCurrentIntensity(val);
              }}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Surfing & Breathing Area */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        {/* Navigation for Surfer Modules */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('breathe')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'breathe'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Box Breathing Wave</span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'grounding'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>5-4-3-2-1 Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('reframes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reframes'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Mind Reframes</span>
          </button>
        </div>

        {/* Tab 1: Box Breathing & Wave Visualizer */}
        {activeTab === 'breathe' && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {/* Duration selector */}
            <div className="flex items-center gap-2 mb-8 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {[3, 5, 10].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSelectDuration(mins)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>

            {/* Breathing Circle Visualizer */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
              {/* Animated Ripple Waves */}
              <div
                className={`absolute inset-0 rounded-full border border-teal-500/20 transition-all duration-1000 ${
                  isActive && (breathPhase === 'inhale' || breathPhase === 'hold1')
                    ? 'scale-110 opacity-80'
                    : 'scale-90 opacity-30'
                }`}
              />

              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out border shadow-2xl ${
                  breathPhase === 'inhale'
                    ? 'scale-105 bg-teal-500/20 border-teal-400/60 shadow-teal-500/20'
                    : breathPhase === 'hold1'
                    ? 'scale-105 bg-teal-500/30 border-teal-300 shadow-teal-500/30'
                    : breathPhase === 'exhale'
                    ? 'scale-90 bg-indigo-500/20 border-indigo-400/60 shadow-indigo-500/20'
                    : 'scale-90 bg-slate-900 border-slate-700'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
                  {formatTime(secondsRemaining)}
                </span>

                <span className="text-xs uppercase tracking-wider text-teal-300 font-bold mt-2">
                  {isActive ? breathPhase.replace('hold1', 'Hold').replace('hold2', 'Rest') : 'Ready'}
                </span>

                {isActive && (
                  <span className="text-sm font-mono text-slate-400 mt-1">
                    {phaseSeconds}s
                  </span>
                )}
              </div>
            </div>

            {/* Instruction text */}
            <p className="text-sm sm:text-base text-slate-200 font-medium h-8 mb-6">
              {isActive ? phaseInstruction[breathPhase] : 'Press Start to begin guided wave breathing'}
            </p>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleTimer}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20 active:scale-95"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isActive ? 'Pause' : 'Start Wave'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: 5-4-3-2-1 Sensory Grounding Technique */}
        {activeTab === 'grounding' && (
          <div className="space-y-4 py-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Grounding pulls your prefrontal cortex back online by anchoring your nervous system into physical reality:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                  5 Things You Can See
                </div>
                <p className="text-xs text-slate-400">
                  Notice 5 visual details around you right now: the wood grain on the table, light reflecting on glass, a shadow on the floor.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
                  4 Things You Can Physically Feel
                </div>
                <p className="text-xs text-slate-400">
                  Feel the soles of your feet touching the ground, the texture of your shirt, the temperature of air on your skin.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
                  3 Things You Can Hear
                </div>
                <p className="text-xs text-slate-400">
                  Listen for ambient sounds: distant traffic, the hum of a refrigerator, your own gentle breath.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                  2 Things You Can Smell
                </div>
                <p className="text-xs text-slate-400">
                  Inhale gently. Can you smell coffee, fresh air, paper, or soap?
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 md:col-span-2">
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                  1 Thing You Can Taste / 1 Pure Sip of Ice Water
                </div>
                <p className="text-xs text-slate-400">
                  Drink a tall glass of ice-cold water. Notice the crisp chill waking up your throat and vagus nerve.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cognitive Reframes */}
        {activeTab === 'reframes' && (
          <div className="space-y-3 py-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-teal-300">
                1. "A craving is a sensation, not a command."
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Just because an urge feels loud in your chest or mind does not mean you have to obey it. You can acknowledge it and let it pass through.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-teal-300">
                2. "Giving in does not cure cravings—it feeds the next one."
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every time you surrender to an urge, you strengthen the neural pathway. Every single time you ride it out without giving in, you weaken it forever.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-teal-300">
                3. "Delay 15 minutes."
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Don't say "I will never have this again." Tell yourself: "I will wait 15 minutes." In 15 minutes, the intense chemical spike will have receded.
              </p>
            </div>
          </div>
        )}

        {/* Victory & Post-Surfing Craving Re-assessment */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 bg-slate-950/60 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">How does the urge feel now?</h3>
              <p className="text-xs text-slate-400">Notice the reduction in physical tension.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Current Intensity:</span>
              <span className="text-base font-bold font-mono text-teal-400 tabular-nums">
                {currentIntensity} / 10
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            value={currentIntensity}
            onChange={e => setCurrentIntensity(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer mb-4"
          />

          <input
            type="text"
            placeholder="Optional reflections (e.g. Drank ice water, breathing helped ease chest tightness)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 mb-4"
          />

          <div className="flex items-center justify-between">
            {loggedSuccess ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-500/10 px-4 py-2.5 rounded-xl border border-teal-500/20">
                <CheckCircle className="w-4 h-4" />
                <span>Urge Surfed & Victory Recorded in Journal!</span>
              </div>
            ) : (
              <button
                onClick={handleLogVictory}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>I Surfed This Craving! (Record Victory)</span>
              </button>
            )}

            {onFinish && (
              <button
                onClick={onFinish}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1 cursor-pointer"
              >
                Close Surfer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
