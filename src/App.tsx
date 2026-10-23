/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  NavTab
} from './components/Navbar';
import { DateStrip } from './components/DateStrip';
import { HabitCard } from './components/HabitCard';
import { SobrietyHub } from './components/SobrietyHub';
import { UrgeSurfer } from './components/UrgeSurfer';
import { AnalyticsView } from './components/AnalyticsView';
import { CommunityHub } from './components/CommunityHub';
import { ProfileModal } from './components/ProfileModal';
import { CuteAvatar } from './components/AvatarGallery';
import { PricingView } from './components/PricingView';
import { VitalityRegimens } from './components/VitalityRegimens';
import { HabitModal } from './components/HabitModal';
import { RelapseModal } from './components/RelapseModal';
import { NotesView } from './components/NotesView';
import { AIChatAssistant } from './components/AIChatAssistant';
import { StandoutFeaturesModal } from './components/StandoutFeaturesModal';
import { RemindersNotificationsModal } from './components/RemindersNotificationsModal';
import {
  SettingsModal,
  DISPLAY_THEMES,
  LAYOUT_OPTIONS,
  ACCENT_COLORS,
  TEXT_SIZES,
  TEXT_FONT_STYLES,
  TEXT_COLOR_TONES
} from './components/SettingsModal';
import {
  AIChatMessage,
  AppearanceSettings,
  CommunityCircle,
  CommunityPost,
  DailyCheckIn,
  DailyMoodLog,
  DocumentationNote,
  EatingPlan,
  ExercisePlan,
  Habit,
  MoodLevel,
  NotificationPreferences,
  ReminderItem,
  RoutineStep,
  UrgeLog,
  UserProfile,
  UserSubscription,
  UserVitalityState
} from './types/habit';
import {
  getHabits,
  saveHabits,
  getCheckIns,
  getUrgeLogs,
  saveUrgeLogs,
  toggleCheckIn,
  getCurrencySymbol,
  getAppearanceSettings,
  saveAppearanceSettings,
  applyAppearanceToDOM,
  DEFAULT_APPEARANCE,
  getUserProfile,
  saveUserProfile,
  DEFAULT_PROFILE,
  getCommunityPosts,
  saveCommunityPosts,
  getUserSubscription,
  saveUserSubscription,
  DEFAULT_SUBSCRIPTION,
  getCleanTimeBreakdown,
  getUserVitalityState,
  saveUserVitalityState,
  DEFAULT_VITALITY_STATE,
  EXERCISE_PLANS,
  EATING_PLANS,
  getDocumentationNotes,
  saveDocumentationNotes,
  getDailyMoodLogs,
  saveDailyMoodLogs,
  getAIChatHistory,
  saveAIChatHistory,
  getNotificationPreferences,
  saveNotificationPreferences,
  DEFAULT_NOTIFICATION_PREFS,
  getReminders,
  saveReminders
} from './utils/storage';
import {
  ShieldCheck,
  Plus,
  SlidersHorizontal,
  Monitor,
  Palette,
  Type,
  Utensils,
  Wine,
  Timer,
  Smartphone,
  Users,
  ArrowUpRight,
  X,
  Dumbbell,
  BookOpen,
  Award,
  CheckCircle2,
  Snowflake,
  Bell,
  Home,
  ShieldAlert,
  Mail
} from 'lucide-react';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [urgeLogs, setUrgeLogs] = useState<UrgeLog[]>([]);
  const [currencySymbol, setCurrencySymbolState] = useState<string>('$');
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);
  const [showAppearanceBar, setShowAppearanceBar] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>(DEFAULT_SUBSCRIPTION);
  const [vitalityState, setVitalityState] = useState<UserVitalityState>(DEFAULT_VITALITY_STATE);
  const [notes, setNotes] = useState<DocumentationNote[]>([]);
  const [moodLogs, setMoodLogs] = useState<DailyMoodLog[]>([]);
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFS
  );
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  // System Pop-Up Banner & Full-Screen App Override State
  const [systemPopupToast, setSystemPopupToast] = useState<{
    title: string;
    body: string;
    channelTag: string;
  } | null>(null);
  const [activeScreenOverride, setActiveScreenOverride] = useState<ReminderItem | null>(null);
  const [screenOverrideSecondsLeft, setScreenOverrideSecondsLeft] = useState<number>(60);

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [selectedCircleId, setSelectedCircleId] = useState<string | undefined>(undefined);
  const [notesFilterHabitId, setNotesFilterHabitId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Filter in Today view
  const [filterType, setFilterType] = useState<'all' | 'build' | 'quit'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'eating' | 'drinking' | 'procrastination' | 'screen_time'>('all');

  // Quick Daily Check-in & Note bar state
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSavedToast, setQuickNoteSavedToast] = useState(false);

  // Modals & AI Coach Drawer
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [relapseHabit, setRelapseHabit] = useState<Habit | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [activeUrgeSurferHabit, setActiveUrgeSurferHabit] = useState<Habit | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [pendingAIPrompt, setPendingAIPrompt] = useState<string | null>(null);
  const [standoutModalTab, setStandoutModalTab] = useState<'certificate' | 'publish_check' | null>(null);

  // Load initial data
  const loadData = () => {
    setHabits(getHabits());
    setCheckIns(getCheckIns());
    setUrgeLogs(getUrgeLogs());
    setCurrencySymbolState(getCurrencySymbol());
    setUserProfile(getUserProfile());
    setCommunityPosts(getCommunityPosts());
    setSubscription(getUserSubscription());
    setVitalityState(getUserVitalityState());
    setNotes(getDocumentationNotes());
    setMoodLogs(getDailyMoodLogs());
    setAiMessages(getAIChatHistory());
    setNotificationPrefs(getNotificationPreferences());
    setReminders(getReminders());
    const savedAppearance = getAppearanceSettings();
    setAppearance(savedAppearance);
    applyAppearanceToDOM(savedAppearance);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Countdown timer when Full-Screen App Override is active
  useEffect(() => {
    if (!activeScreenOverride) return;
    setScreenOverrideSecondsLeft(notificationPrefs.screenOverrideDurationSeconds || 60);
    const interval = setInterval(() => {
      setScreenOverrideSecondsLeft(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeScreenOverride, notificationPrefs.screenOverrideDurationSeconds]);

  const handleTriggerSystemPopup = (
    title: string,
    body: string,
    channelTag: string = 'System Pop-Up'
  ) => {
    setSystemPopupToast({ title, body, channelTag });
    if (
      notificationPrefs.notificationsEnabled &&
      notificationPrefs.systemPopupsEnabled &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, { body });
      } catch {
        // Fallback to in-app toast banner
      }
    }
    setTimeout(() => {
      setSystemPopupToast(prev => (prev?.title === title ? null : prev));
    }, 5500);
  };

  const handleUpdateNotificationPrefs = (nextPrefs: NotificationPreferences) => {
    setNotificationPrefs(nextPrefs);
    saveNotificationPreferences(nextPrefs);
  };

  const handleUpdateReminders = (nextReminders: ReminderItem[]) => {
    setReminders(nextReminders);
    saveReminders(nextReminders);
  };

  const handleAppearanceChange = (next: AppearanceSettings) => {
    setAppearance(next);
    saveAppearanceSettings(next);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  const handleUpdateCommunityPosts = (updatedPosts: CommunityPost[]) => {
    setCommunityPosts(updatedPosts);
    saveCommunityPosts(updatedPosts);
  };

  const handleUpdateSubscription = (updatedSub: UserSubscription) => {
    setSubscription(updatedSub);
    saveUserSubscription(updatedSub);
  };

  const handleUpdateVitalityState = (nextVitality: UserVitalityState) => {
    setVitalityState(nextVitality);
    saveUserVitalityState(nextVitality);
  };

  const handleSaveNotes = (updatedNotes: DocumentationNote[]) => {
    setNotes(updatedNotes);
    saveDocumentationNotes(updatedNotes);
  };

  const handleUpdateAIMessages = (updatedMsgs: AIChatMessage[]) => {
    setAiMessages(updatedMsgs);
    saveAIChatHistory(updatedMsgs);
  };

  const handleSaveReplyToNotes = (title: string, content: string, actionSteps?: string[]) => {
    const now = new Date().toISOString();
    const newNote: DocumentationNote = {
      id: `note-ai-${Date.now()}`,
      title,
      content,
      category: 'general',
      mood: 'good',
      tags: ['ai-coach', 'saved-advice'],
      pinned: false,
      actionSteps: actionSteps || [],
      createdAt: now,
      updatedAt: now,
    };
    handleSaveNotes([newNote, ...notes]);
  };

  const todayMoodLog = moodLogs.find(m => m.date === selectedDate) || {
    date: selectedDate,
    mood: 'good' as MoodLevel,
    energy: 4,
    gratitudeNote: '',
    streakFreezeUsed: false,
  };

  const handleUpdateTodayMood = (patch: Partial<DailyMoodLog>) => {
    const updatedLog: DailyMoodLog = { ...todayMoodLog, ...patch, date: selectedDate };
    const exists = moodLogs.some(m => m.date === selectedDate);
    const nextLogs = exists
      ? moodLogs.map(m => (m.date === selectedDate ? updatedLog : m))
      : [updatedLog, ...moodLogs];
    setMoodLogs(nextLogs);
    saveDailyMoodLogs(nextLogs);
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;
    const now = new Date().toISOString();
    const newNote: DocumentationNote = {
      id: `note-quick-${Date.now()}`,
      title: `Daily Note · ${selectedDate}`,
      content: quickNoteText.trim(),
      category: 'daily_log',
      mood: todayMoodLog.mood,
      tags: ['quick-note', selectedDate],
      pinned: false,
      actionSteps: [],
      createdAt: now,
      updatedAt: now,
    };
    handleSaveNotes([newNote, ...notes]);
    setQuickNoteText('');
    setQuickNoteSavedToast(true);
    setTimeout(() => setQuickNoteSavedToast(false), 2500);
  };

  const handleAdoptExercisePlanAsHabit = (plan: ExercisePlan) => {
    const existing = habits.find(
      h => !h.archived && h.title.toLowerCase().includes(plan.title.toLowerCase())
    );
    const routines: RoutineStep[] = plan.routineStepsForHabit.map((s, idx) => ({
      id: `ex-rt-${plan.id}-${idx}`,
      title: s.title,
      timing: s.timing,
      description: s.description,
      completedDates: [],
    }));

    if (existing) {
      handleSaveHabit({ ...existing, routines });
      return;
    }

    const newHabit: Habit = {
      id: `habit-ex-${plan.id}-${Date.now()}`,
      title: `Exercise: ${plan.title}`,
      description: `${plan.subtitle} (${plan.daysPerWeek} days/wk · ${plan.sessionMinutes} mins/session)`,
      type: 'build',
      category: 'fitness',
      icon: 'Dumbbell',
      color: 'teal',
      createdAt: new Date().toISOString(),
      frequency: 'daily',
      targetValue: plan.sessionMinutes,
      targetUnit: 'mins',
      timeOfDay: 'morning',
      routines,
    };
    handleSaveHabit(newHabit);
  };

  const handleAdoptEatingPlanAsHabit = (plan: EatingPlan) => {
    const existing = habits.find(
      h => !h.archived && h.title.toLowerCase().includes(plan.title.toLowerCase())
    );
    const routines: RoutineStep[] = plan.routineStepsForHabit.map((s, idx) => ({
      id: `eat-rt-${plan.id}-${idx}`,
      title: s.title,
      timing: s.timing,
      description: s.description,
      completedDates: [],
    }));

    if (existing) {
      handleSaveHabit({ ...existing, routines, communityCircleId: 'eating' });
      return;
    }

    const newHabit: Habit = {
      id: `habit-eat-${plan.id}-${Date.now()}`,
      title: `Meal Plan: ${plan.title}`,
      description: `${plan.dailyCalories} kcal · ${plan.macroSplit.proteinGrams}g Protein · ${plan.macroSplit.fiberGrams}g Fiber (${plan.eatingWindow})`,
      type: 'build',
      category: 'eating',
      icon: 'Utensils',
      color: 'emerald',
      createdAt: new Date().toISOString(),
      frequency: 'daily',
      targetValue: 4,
      targetUnit: 'healthy meals',
      timeOfDay: 'anytime',
      routines,
      communityCircleId: 'eating',
    };
    handleSaveHabit(newHabit);
  };

  // Handlers
  const handleToggleCheckIn = (habitId: string, date: string, value?: number) => {
    const updated = toggleCheckIn(habitId, date, value);
    setCheckIns(updated);
  };

  const handleToggleRoutineStep = (habitId: string, routineId: string) => {
    const updated = habits.map(h => {
      if (h.id !== habitId || !h.routines) return h;
      return {
        ...h,
        routines: h.routines.map(r => {
          if (r.id !== routineId) return r;
          const prevDates = r.completedDates || [];
          const hasDate = prevDates.includes(selectedDate);
          return {
            ...r,
            completedDates: hasDate
              ? prevDates.filter(d => d !== selectedDate)
              : [...prevDates, selectedDate],
          };
        }),
      };
    });
    setHabits(updated);
    saveHabits(updated);
  };

  const handleAdoptRoutine = (
    circle: CommunityCircle,
    routine: { title: string; timing: string; description: string }
  ) => {
    const targetHabit = habits.find(
      h =>
        !h.archived &&
        (h.category === circle.category ||
          h.communityCircleId === circle.id ||
          (circle.category === 'screen_time' && h.category === 'digital'))
    );

    if (targetHabit) {
      const existingRoutines = targetHabit.routines || [];
      if (existingRoutines.some(r => r.title === routine.title)) return;
      const newStep: RoutineStep = {
        id: `rt-${Date.now()}`,
        title: routine.title,
        timing: routine.timing,
        description: routine.description,
        completedDates: [],
      };
      const updated = habits.map(h =>
        h.id === targetHabit.id ? { ...h, routines: [...existingRoutines, newStep] } : h
      );
      setHabits(updated);
      saveHabits(updated);
    }
  };

  const handleSaveHabit = (savedHabit: Habit) => {
    const existingIndex = habits.findIndex(h => h.id === savedHabit.id);
    let updated: Habit[];
    if (existingIndex >= 0) {
      updated = [...habits];
      updated[existingIndex] = savedHabit;
    } else {
      updated = [savedHabit, ...habits];
    }
    setHabits(updated);
    saveHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter(h => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);
  };

  const handleSaveUrgeLog = (log: UrgeLog) => {
    const updated = [log, ...urgeLogs];
    setUrgeLogs(updated);
    saveUrgeLogs(updated);
  };

  const handleConfirmReset = (updatedHabit: Habit) => {
    handleSaveHabit(updatedHabit);
  };

  const handleOpenCommunityCircle = (circleId: string) => {
    setSelectedCircleId(circleId);
    setCurrentTab('community');
  };

  const activeHabits = habits.filter(h => !h.archived);
  const activeQuitHabits = activeHabits.filter(h => h.type === 'quit');

  const ledgerTotals = activeQuitHabits.reduce(
    (acc, h) => {
      const st = getCleanTimeBreakdown(h);
      return {
        moneySaved: acc.moneySaved + st.moneySaved,
        hoursSaved: acc.hoursSaved + Math.round(st.hoursReclaimed),
      };
    },
    { moneySaved: 0, hoursSaved: 0 }
  );

  // Today view filtered habits
  const filteredHabits = activeHabits.filter(h => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterCategory !== 'all') {
      if (filterCategory === 'screen_time') {
        if (h.category !== 'screen_time' && h.category !== 'digital') return false;
      } else if (h.category !== filterCategory) {
        return false;
      }
    }
    return true;
  });

  const todayCompletedCount = activeHabits.filter(h => {
    const c = checkIns.find(chk => chk.habitId === h.id && chk.date === selectedDate);
    return c?.completed;
  }).length;

  const gridLayoutClass =
    appearance.layoutDisplay === 'list'
      ? 'grid-cols-1'
      : appearance.layoutDisplay === 'compact'
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-12 transition-colors">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenNewHabit={() => {
          setHabitToEdit(null);
          setIsHabitModalOpen(true);
        }}
        onTriggerSOS={() => {
          setCurrentTab('urge_surfer');
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onToggleAppearance={() => setShowAppearanceBar(!showAppearanceBar)}
        isAppearanceOpen={showAppearanceBar}
        onOpenAICoach={() => setIsAIChatOpen(true)}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        activeRemindersCount={reminders.filter(r => r.enabled).length}
        notesCount={notes.length}
        userProfile={userProfile}
        subscription={subscription}
        activeQuittingCount={activeQuitHabits.length}
      />

      {/* IN-APP SYSTEM POP-UP TOAST BANNER */}
      {systemPopupToast && (
        <div className="fixed top-16 right-4 z-50 max-w-sm w-full studio-card rounded-xl p-4 border border-teal-400/50 bg-slate-900/95 shadow-2xl flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400">
                  {systemPopupToast.channelTag}
                </span>
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {systemPopupToast.title}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {systemPopupToast.body}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSystemPopupToast(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FULL-SCREEN APP SCREEN OVERRIDE TAKEOVER OVERLAY */}
      {activeScreenOverride && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="studio-card rounded-2xl max-w-xl w-full p-7 border border-amber-400/50 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400">
                App Screen Override · Scheduled Priority Reminder ({activeScreenOverride.time})
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl text-white">
                {activeScreenOverride.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                This priority routine has temporarily overridden your active screen so you can pause, breathe, and honor your commitment.
              </p>
            </div>

            {/* Active Countdown & Delivery Channels */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-around gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Focus Pause Timer
                </div>
                <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums mt-0.5">
                  00:{String(screenOverrideSecondsLeft).padStart(2, '0')}
                </div>
              </div>
              <div className="text-left space-y-1 text-xs font-mono">
                <div className="text-slate-400 text-[10px] uppercase">Dispatched Channels:</div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                    Screen Override
                  </span>
                  {activeScreenOverride.channels.systemPopup && (
                    <span className="px-2 py-0.5 rounded bg-teal-500/15 text-teal-300">
                      System Pop-Up
                    </span>
                  )}
                  {activeScreenOverride.channels.email && (
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300">Email</span>
                  )}
                  {activeScreenOverride.channels.text && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                      Text SMS
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Override Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (activeScreenOverride.habitId) {
                    handleToggleCheckIn(activeScreenOverride.habitId, selectedDate, 1);
                  }
                  const title = activeScreenOverride.title;
                  setActiveScreenOverride(null);
                  handleTriggerSystemPopup(
                    'Routine Completed!',
                    `Great job completing "${title}".`,
                    'Streak Protected'
                  );
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Routine & Dismiss</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveScreenOverride(null);
                  handleTriggerSystemPopup(
                    'Reminder Snoozed 10m',
                    'We will remind you again in 10 minutes.',
                    'Snoozed'
                  );
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
              >
                Snooze 10 Mins
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveScreenOverride(null);
                  setCurrentTab('today');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-teal-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Easy-to-Use Panel: Change Text Design, Text Colour, Theme Colour, Size & Brightness */}
      {showAppearanceBar && (
        <div className="border-b border-slate-800/90 bg-slate-900/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-200 font-semibold">
                  Text Design, Colours, Size & Brightness
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-teal-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  All Settings
                </button>
                <button
                  onClick={() => setShowAppearanceBar(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Column 1: Text Design (Font Style) & Text Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <Type className="w-3.5 h-3.5 text-teal-400" />
                  <span>1. Text Design (Font Style)</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {TEXT_FONT_STYLES.map(font => {
                    const active = (appearance.fontStyle || 'clean') === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() =>
                          handleAppearanceChange({ ...appearance, fontStyle: font.id })
                        }
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${font.fontClass} ${
                          active
                            ? 'border-teal-400 bg-teal-500/10 text-white font-semibold'
                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{font.label}</span>
                          <span className="text-xs text-teal-400 font-bold">Aa</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {font.sample}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Text Size
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TEXT_SIZES.map(sz => {
                      const active = appearance.textSize === sz.id;
                      return (
                        <button
                          key={sz.id}
                          onClick={() =>
                            handleAppearanceChange({ ...appearance, textSize: sz.id })
                          }
                          className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                            active
                              ? 'border-teal-400 bg-teal-500/10 text-white font-semibold'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-[11px]">{sz.label}</div>
                          <div className="text-[10px] font-mono text-slate-500">{sz.scaleLabel}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 2: Text Colour & Theme Button Colour */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <Palette className="w-3.5 h-3.5 text-teal-400" />
                  <span>2. Text Colour & Theme Colour</span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 mb-1">Reading Text Colour:</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TEXT_COLOR_TONES.map(tone => {
                      const active = (appearance.textColor || 'default') === tone.id;
                      return (
                        <button
                          key={tone.id}
                          onClick={() =>
                            handleAppearanceChange({ ...appearance, textColor: tone.id })
                          }
                          className={`px-2 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            active
                              ? 'border-teal-400 bg-teal-500/10 text-white font-semibold'
                              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span
                            className={`w-3 h-3 rounded-full border border-slate-700 shrink-0 ${tone.previewClass}`}
                          />
                          <span className="truncate text-[11px]">{tone.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 mb-1">Button & Highlight Colour:</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ACCENT_COLORS.map(col => {
                      const active = appearance.accentColor === col.id;
                      return (
                        <button
                          key={col.id}
                          onClick={() =>
                            handleAppearanceChange({ ...appearance, accentColor: col.id })
                          }
                          className={`px-2 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            active
                              ? 'border-teal-400 bg-teal-500/10 text-white font-semibold'
                              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${col.swatchClass} shrink-0`} />
                          <span className="truncate text-[11px]">{col.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 3: Background Look & Card Layout */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <Monitor className="w-3.5 h-3.5 text-teal-400" />
                  <span>3. Background & Layout</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {DISPLAY_THEMES.map(theme => {
                    const Icon = theme.icon;
                    const active = appearance.displayTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() =>
                          handleAppearanceChange({ ...appearance, displayTheme: theme.id })
                        }
                        className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          active
                            ? 'border-teal-400 bg-teal-500/10 text-white font-semibold'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-teal-400" />
                        <span className="truncate max-w-full text-[11px]">
                          {theme.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {LAYOUT_OPTIONS.map(layout => {
                    const Icon = layout.icon;
                    const active = appearance.layoutDisplay === layout.id;
                    return (
                      <button
                        key={layout.id}
                        onClick={() =>
                          handleAppearanceChange({ ...appearance, layoutDisplay: layout.id })
                        }
                        className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          active
                            ? 'border-teal-400 bg-teal-500/10 text-white font-semibold'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-teal-400" />
                        <span className="truncate max-w-full text-[11px]">
                          {layout.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column 4: Brightness & Colour Strength Sliders */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-300">App Brightness</span>
                    <span className="font-mono font-semibold text-teal-400 tabular-nums">
                      {appearance.brightnessLevel ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={130}
                    step={5}
                    value={appearance.brightnessLevel ?? 100}
                    onChange={e =>
                      handleAppearanceChange({
                        ...appearance,
                        brightnessLevel: Number(e.target.value),
                      })
                    }
                    className="w-full accent-teal-400 cursor-pointer"
                    aria-label="App Brightness"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-300">Colour Strength</span>
                    <span className="font-mono font-semibold text-teal-400 tabular-nums">
                      {appearance.colorIntensity ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={160}
                    step={5}
                    value={appearance.colorIntensity ?? 100}
                    onChange={e =>
                      handleAppearanceChange({
                        ...appearance,
                        colorIntensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-teal-400 cursor-pointer"
                    aria-label="Colour Strength"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* TAB 1: TODAY'S HABITS & TRACKERS */}
        {currentTab === 'today' && (
          <div className="space-y-6">
            {/* Simple Date Header & 8-Day Calendar Strip */}
            <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* Clean Daily Check-In & Quick Note Bar */}
            <div className="studio-card rounded-xl p-4 sm:p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Mood & Streak Grace Day */}
                <div className="lg:col-span-5 flex flex-wrap items-center gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
                      Daily Mood
                    </div>
                    <div className="flex items-center gap-1.5">
                      {(
                        [
                          { id: 'great', label: 'Great' },
                          { id: 'good', label: 'Good' },
                          { id: 'okay', label: 'Okay' },
                          { id: 'tough', label: 'Tough' },
                        ] as { id: MoodLevel; label: string }[]
                      ).map(m => {
                        const active = todayMoodLog.mood === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleUpdateTodayMood({ mood: m.id })}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                              active
                                ? 'border-teal-400 bg-teal-500/15 text-white font-semibold'
                                : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Streak Grace Day */}
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
                      Grace Day
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateTodayMood({
                          streakFreezeUsed: !todayMoodLog.streakFreezeUsed,
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        todayMoodLog.streakFreezeUsed
                          ? 'border-sky-400 bg-sky-500/15 text-sky-200 font-semibold'
                          : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-slate-200'
                      }`}
                      title="Protect your habit streak on a busy or sick day"
                    >
                      <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                      <span>
                        {todayMoodLog.streakFreezeUsed ? 'Protected' : 'Protect Streak'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Quick Documentation Note Input */}
                <form
                  onSubmit={handleSaveQuickNote}
                  className="lg:col-span-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={quickNoteText}
                      onChange={e => setQuickNoteText(e.target.value)}
                      placeholder="Write a quick note for today (triggers, wins, meal or workout note)..."
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {quickNoteSavedToast ? '✓ Saved' : 'Save Note'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNotesFilterHabitId(undefined);
                      setCurrentTab('notes');
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>Notes ({notes.length})</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Organized 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* LEFT 8 COLUMNS: Habit & Quit Trackers */}
              <div className="lg:col-span-8 space-y-5">
                {/* Clean Filter Bar */}
                <div className="flex flex-col gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setFilterType('all');
                          setFilterCategory('all');
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          filterType === 'all' && filterCategory === 'all'
                            ? 'bg-slate-100 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        All ({activeHabits.length})
                      </button>

                      <button
                        onClick={() => setFilterType('quit')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          filterType === 'quit'
                            ? 'bg-slate-100 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Quitting ({activeQuitHabits.length})</span>
                      </button>

                      <button
                        onClick={() => setFilterType('build')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          filterType === 'build'
                            ? 'bg-slate-100 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Daily Habits</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-slate-400 tabular-nums">
                        <strong className="text-slate-100">{todayCompletedCount}</strong> /{' '}
                        {activeHabits.length} completed
                      </span>
                      <button
                        onClick={() => {
                          setHabitToEdit(null);
                          setIsHabitModalOpen(true);
                        }}
                        className="text-teal-400 hover:text-teal-300 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Habit</span>
                      </button>
                    </div>
                  </div>

                  {/* Topic Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mr-1.5 shrink-0">
                      Filter:
                    </span>
                    <button
                      onClick={() =>
                        setFilterCategory(filterCategory === 'eating' ? 'all' : 'eating')
                      }
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                        filterCategory === 'eating'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-medium'
                          : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border-slate-800/80'
                      }`}
                    >
                      <Utensils className="w-3 h-3 text-teal-400" />
                      <span>Eating & Sugar</span>
                    </button>

                    <button
                      onClick={() =>
                        setFilterCategory(filterCategory === 'drinking' ? 'all' : 'drinking')
                      }
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                        filterCategory === 'drinking'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-medium'
                          : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border-slate-800/80'
                      }`}
                    >
                      <Wine className="w-3 h-3 text-teal-400" />
                      <span>Drinking</span>
                    </button>

                    <button
                      onClick={() =>
                        setFilterCategory(
                          filterCategory === 'procrastination' ? 'all' : 'procrastination'
                        )
                      }
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                        filterCategory === 'procrastination'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-medium'
                          : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border-slate-800/80'
                      }`}
                    >
                      <Timer className="w-3 h-3 text-teal-400" />
                      <span>Procrastination</span>
                    </button>

                    <button
                      onClick={() =>
                        setFilterCategory(filterCategory === 'screen_time' ? 'all' : 'screen_time')
                      }
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                        filterCategory === 'screen_time'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-medium'
                          : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border-slate-800/80'
                      }`}
                    >
                      <Smartphone className="w-3 h-3 text-teal-400" />
                      <span>Screen Time</span>
                    </button>
                  </div>
                </div>

                {/* Habit Cards Grid */}
                {filteredHabits.length > 0 ? (
                  <div className={`grid ${gridLayoutClass} gap-4`}>
                    {filteredHabits.map(habit => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        checkIns={checkIns}
                        selectedDate={selectedDate}
                        currencySymbol={currencySymbol}
                        onToggleCheckIn={handleToggleCheckIn}
                        onToggleRoutineStep={handleToggleRoutineStep}
                        onOpenCommunityCircle={handleOpenCommunityCircle}
                        onOpenNotesForHabit={h => {
                          setNotesFilterHabitId(h.id);
                          setCurrentTab('notes');
                        }}
                        onOpenEdit={h => {
                          setHabitToEdit(h);
                          setIsHabitModalOpen(true);
                        }}
                        onOpenRelapseModal={h => setRelapseHabit(h)}
                        onOpenUrgeSurferForHabit={h => {
                          setActiveUrgeSurferHabit(h);
                          setCurrentTab('urge_surfer');
                        }}
                        onDeleteHabit={handleDeleteHabit}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="studio-card rounded-xl p-10 text-center">
                    <p className="text-sm text-slate-400 mb-4">
                      No habits match this filter right now.
                    </p>
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setFilterCategory('all');
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Show All Habits
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT 4 COLUMNS: Clean 3-Card Summary Sidebar */}
              <aside className="lg:col-span-4 space-y-4">
                {/* Card 1: Profile & Total Savings */}
                <div className="studio-card rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(true)}
                      className="cursor-pointer shrink-0"
                      title="Edit Profile & Avatar"
                    >
                      <CuteAvatar
                        avatarId={userProfile.avatarId}
                        auraColor={userProfile.auraColor}
                        size="lg"
                      />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-white truncate">
                          {userProfile.displayName}
                        </h2>
                        <span className="text-[11px] font-mono text-slate-400 truncate">
                          {userProfile.handle}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-teal-400 mt-0.5">
                        {userProfile.titleBadge}
                      </div>
                    </div>
                  </div>

                  {/* Savings Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
                      <div className="text-[11px] text-slate-400">Money Saved</div>
                      <div className="text-lg font-mono font-semibold text-white mt-0.5 tabular-nums">
                        {currencySymbol}
                        {ledgerTotals.moneySaved.toFixed(0)}
                      </div>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
                      <div className="text-[11px] text-slate-400">Time Reclaimed</div>
                      <div className="text-lg font-mono font-semibold text-white mt-0.5 tabular-nums">
                        {ledgerTotals.hoursSaved} hrs
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-slate-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Profile & Avatars</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => setCurrentTab('community')}
                      className="text-teal-400 hover:text-teal-300 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Support Groups</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Active Exercise & Healthy Meal Plans */}
                <div className="studio-card rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
                      <span>Exercise & Meal Plans</span>
                    </span>
                    <button
                      onClick={() => setCurrentTab('regimens')}
                      className="text-[11px] font-mono text-teal-400 hover:text-teal-300 cursor-pointer"
                    >
                      Open Guides →
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentTab('regimens')}
                      className="w-full text-left p-3 rounded-lg bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        ACTIVE EXERCISE PLAN
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5 truncate">
                        {(
                          EXERCISE_PLANS.find(p => p.id === vitalityState.activeExercisePlanId) ||
                          EXERCISE_PLANS[0]
                        ).title}
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentTab('regimens')}
                      className="w-full text-left p-3 rounded-lg bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        ACTIVE MEAL PLAN
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5 truncate">
                        {(
                          EATING_PLANS.find(p => p.id === vitalityState.activeEatingPlanId) ||
                          EATING_PLANS[0]
                        ).title}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Card 3: Quick Tools & Membership Plan */}
                <div className="studio-card rounded-xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                      Tools & Membership
                    </span>
                    <button
                      onClick={() => setShowAppearanceBar(!showAppearanceBar)}
                      className="text-[11px] font-mono text-teal-400 hover:text-teal-300 cursor-pointer"
                    >
                      {showAppearanceBar ? 'Hide Display' : 'Display & Fonts'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsRemindersModalOpen(true)}
                      className="py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-teal-400" />
                      <span>Reminders ({reminders.filter(r => r.enabled).length})</span>
                    </button>
                    <button
                      onClick={() => setIsRemindersModalOpen(true)}
                      className="py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span>Email & Alerts</span>
                    </button>
                    <button
                      onClick={() => setStandoutModalTab('certificate')}
                      className="py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Milestone Card</span>
                    </button>
                    <button
                      onClick={() => setStandoutModalTab('publish_check')}
                      className="py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Publish to GitHub</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {subscription.active
                          ? `Ascent ${subscription.tierId.toUpperCase()} Plan`
                          : 'Plans from $5 USD'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {subscription.active
                          ? `${subscription.billingCycle} · ${subscription.paymentChannel || 'Active'}`
                          : '50% off new users · 5 payment channels'}
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentTab('pricing')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer shrink-0"
                    >
                      Plans
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* TAB 1B: EXERCISE PLANS & EATING PLANS FOR HEALTHY LIVING */}
        {currentTab === 'regimens' && (
          <VitalityRegimens
            selectedDate={selectedDate}
            vitalityState={vitalityState}
            habits={habits}
            onUpdateVitalityState={handleUpdateVitalityState}
            onAdoptExercisePlanAsHabit={handleAdoptExercisePlanAsHabit}
            onAdoptEatingPlanAsHabit={handleAdoptEatingPlanAsHabit}
            onNavigateToJournal={() => setCurrentTab('today')}
          />
        )}

        {/* TAB 2: SOBRIETY & ADDICTION RECOVERY COMMAND CENTER */}
        {currentTab === 'sobriety' && (
          <SobrietyHub
            habits={habits}
            currencySymbol={currencySymbol}
            onOpenNewHabit={() => {
              setHabitToEdit(null);
              setIsHabitModalOpen(true);
            }}
            onOpenRelapseModal={h => setRelapseHabit(h)}
            onOpenUrgeSurferForHabit={h => {
              setActiveUrgeSurferHabit(h);
              setCurrentTab('urge_surfer');
            }}
            onUpdateHabit={handleSaveHabit}
          />
        )}

        {/* TAB 2B: PERSONAL NOTES & DOCUMENTATION BOOK */}
        {currentTab === 'notes' && (
          <NotesView
            notes={notes}
            habits={habits}
            onSaveNotes={handleSaveNotes}
            initialHabitId={notesFilterHabitId}
            onOpenAIChatWithPrompt={prompt => {
              setPendingAIPrompt(prompt);
              setIsAIChatOpen(true);
            }}
          />
        )}

        {/* TAB 3: COMMUNITY CIRCLES, WHATSAPP/TELEGRAM SUPPORT, PROGRESS PHOTOS & DIRECT MESSAGES */}
        {currentTab === 'community' && (
          <CommunityHub
            profile={userProfile}
            habits={habits}
            posts={communityPosts}
            subscription={subscription}
            selectedCircleId={selectedCircleId}
            onSelectCircleId={setSelectedCircleId}
            onUpdateProfile={handleSaveProfile}
            onUpdatePosts={handleUpdateCommunityPosts}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onAdoptRoutine={handleAdoptRoutine}
            onNavigateToPricing={() => setCurrentTab('pricing')}
          />
        )}

        {/* TAB 4: URGE SURFER & MINDFULNESS SOS */}
        {currentTab === 'urge_surfer' && (
          <UrgeSurfer
            habits={habits}
            defaultHabitId={activeUrgeSurferHabit?.id}
            onSaveUrgeLog={handleSaveUrgeLog}
            onFinish={() => setCurrentTab('today')}
          />
        )}

        {/* TAB 5: ANALYTICS & INSIGHTS */}
        {currentTab === 'analytics' && (
          <AnalyticsView
            habits={habits}
            checkIns={checkIns}
            urgeLogs={urgeLogs}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 6: PAYMENT PLANS & MEMBERSHIP (3 TIERS STARTING FROM $5 USD) */}
        {currentTab === 'pricing' && (
          <PricingView
            subscription={subscription}
            onUpdateSubscription={handleUpdateSubscription}
          />
        )}
      </main>

      {/* FLOATING 24/7 AI COACH CHATBOT ASSISTANT */}
      <AIChatAssistant
        isOpen={isAIChatOpen}
        onOpen={() => setIsAIChatOpen(true)}
        onClose={() => setIsAIChatOpen(false)}
        messages={aiMessages}
        onUpdateMessages={handleUpdateAIMessages}
        userProfile={userProfile}
        habits={habits}
        notes={notes}
        activeExercisePlan={
          EXERCISE_PLANS.find(p => p.id === vitalityState.activeExercisePlanId) ||
          EXERCISE_PLANS[0]
        }
        activeEatingPlan={
          EATING_PLANS.find(p => p.id === vitalityState.activeEatingPlanId) ||
          EATING_PLANS[0]
        }
        currencySymbol={currencySymbol}
        onSaveReplyToNotes={handleSaveReplyToNotes}
        pendingPrompt={pendingAIPrompt}
        onClearPendingPrompt={() => setPendingAIPrompt(null)}
      />

      {/* MODALS */}
      <StandoutFeaturesModal
        isOpen={standoutModalTab !== null}
        onClose={() => setStandoutModalTab(null)}
        userProfile={userProfile}
        habits={habits}
        notes={notes}
        currencySymbol={currencySymbol}
        onDataReload={loadData}
        initialTab={standoutModalTab || 'certificate'}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => {
          setIsHabitModalOpen(false);
          setHabitToEdit(null);
        }}
        onSaveHabit={handleSaveHabit}
        habitToEdit={habitToEdit}
        currencySymbol={currencySymbol}
      />

      {relapseHabit && (
        <RelapseModal
          habit={relapseHabit}
          isOpen={!!relapseHabit}
          onClose={() => setRelapseHabit(null)}
          onConfirmReset={handleConfirmReset}
        />
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        habits={habits}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currencySymbol={currencySymbol}
        onCurrencyChange={sym => setCurrencySymbolState(sym)}
        appearance={appearance}
        onAppearanceChange={handleAppearanceChange}
        onDataReload={loadData}
      />

      <RemindersNotificationsModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        preferences={notificationPrefs}
        onUpdatePreferences={handleUpdateNotificationPrefs}
        reminders={reminders}
        onUpdateReminders={handleUpdateReminders}
        habits={activeHabits}
        onTriggerSystemPopup={handleTriggerSystemPopup}
        onTriggerScreenOverride={rem => setActiveScreenOverride(rem)}
        onGoHome={() => setCurrentTab('today')}
      />
    </div>
  );
}


