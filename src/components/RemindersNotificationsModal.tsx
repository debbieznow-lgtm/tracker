import React, { useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Monitor,
  ShieldAlert,
  Clock,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Play,
  Home
} from 'lucide-react';
import {
  Habit,
  NotificationPreferences,
  ReminderItem
} from '../types/habit';

interface RemindersNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreferences;
  onUpdatePreferences: (prefs: NotificationPreferences) => void;
  reminders: ReminderItem[];
  onUpdateReminders: (reminders: ReminderItem[]) => void;
  habits: Habit[];
  onTriggerSystemPopup: (title: string, body: string, channelTag?: string) => void;
  onTriggerScreenOverride: (reminder: ReminderItem) => void;
  onGoHome: () => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const RemindersNotificationsModal: React.FC<RemindersNotificationsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  reminders,
  onUpdateReminders,
  habits,
  onTriggerSystemPopup,
  onTriggerScreenOverride,
  onGoHome,
}) => {
  const [activeSection, setActiveSection] = useState<'reminders' | 'channels' | 'emails'>(
    'reminders'
  );

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('19:30');
  const [newDays, setNewDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [newHabitId, setNewHabitId] = useState<string>(habits[0]?.id || '');
  const [newChannels, setNewChannels] = useState({
    email: true,
    text: true,
    systemPopup: true,
    overrideScreen: true,
  });

  const [emailPreviewSent, setEmailPreviewSent] = useState(false);

  if (!isOpen) return null;

  const handleToggleDay = (day: string) => {
    setNewDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime || '09:00',
      days: newDays.length > 0 ? newDays : DAYS_OF_WEEK,
      enabled: true,
      habitId: newHabitId || undefined,
      channels: { ...newChannels },
    };

    onUpdateReminders([item, ...reminders]);
    setNewTitle('');
    onTriggerSystemPopup(
      'Reminder Scheduled',
      `"${item.title}" set for ${item.time} (${item.days.length === 7 ? 'Every day' : item.days.join(', ')}).`,
      'Reminder Active'
    );
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onUpdateReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    onUpdateReminders(reminders.filter(r => r.id !== id));
  };

  const handleSendTestFeatureEmail = () => {
    setEmailPreviewSent(true);
    onTriggerSystemPopup(
      'Feature & Update Email Opt-In Confirmed',
      `Test release digest sent to ${preferences.emailAddress || 'your email'}.`,
      'Email Updates'
    );
    setTimeout(() => setEmailPreviewSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="studio-card rounded-2xl w-full max-w-3xl p-6 shadow-2xl border border-slate-800 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-teal-400">
              Reminders, Multi-Channel Alerts & Screen Override
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-white mt-0.5">
              Notifications, Reminders & Email Updates
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoHome();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer"
              title="Return to Home Dashboard"
            >
              <Home className="w-3.5 h-3.5 text-teal-400" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            type="button"
            onClick={() => setActiveSection('reminders')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'reminders'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1. Habit Reminders ({reminders.filter(r => r.enabled).length} active)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('channels')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'channels'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>2. Alert Channels & Screen Override</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('emails')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'emails'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>3. New Features & Update Emails</span>
          </button>
        </div>

        {/* ==================== SECTION 1: SCHEDULED REMINDERS ==================== */}
        {activeSection === 'reminders' && (
          <div className="space-y-5">
            {/* Add New Reminder Form */}
            <form
              onSubmit={handleAddReminder}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400">
                  Create New Daily / Routine Reminder
                </span>
                <span className="text-[11px] text-slate-400">
                  Supports Email, Text, Pop-Up & Screen Override
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] text-slate-400 mb-1">Reminder Label</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., 8:30 PM Herbal Tea & Kitchen Close"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1">Linked Habit</label>
                  <select
                    value={newHabitId}
                    onChange={e => setNewHabitId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="">General Reminder</option>
                    {habits.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Days & Channels Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1 flex-wrap">
                  {DAYS_OF_WEEK.map(day => {
                    const active = newDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer border ${
                          active
                            ? 'bg-teal-500/15 border-teal-400 text-teal-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.systemPopup}
                      onChange={e =>
                        setNewChannels({ ...newChannels, systemPopup: e.target.checked })
                      }
                      className="accent-teal-400"
                    />
                    <span>Pop-Up</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.email}
                      onChange={e => setNewChannels({ ...newChannels, email: e.target.checked })}
                      className="accent-teal-400"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.text}
                      onChange={e => setNewChannels({ ...newChannels, text: e.target.checked })}
                      className="accent-teal-400"
                    />
                    <span>Text/SMS</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.overrideScreen}
                      onChange={e =>
                        setNewChannels({ ...newChannels, overrideScreen: e.target.checked })
                      }
                      className="accent-amber-400"
                    />
                    <span>Override Screen</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reminder</span>
                </button>
              </div>
            </form>

            {/* Existing Reminders List */}
            <div className="space-y-2.5">
              {reminders.map(rem => {
                const linkedHabit = habits.find(h => h.id === rem.habitId);
                return (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      rem.enabled
                        ? 'bg-slate-900/90 border-slate-800'
                        : 'bg-slate-950/60 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm font-bold text-teal-400 tabular-nums">
                          {rem.time}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">
                          {rem.title}
                        </h4>
                        {linkedHabit && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                            {linkedHabit.title}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span>
                          {rem.days.length === 7 ? 'Every day' : rem.days.join(', ')}
                        </span>
                        <span>·</span>
                        {rem.channels.systemPopup && (
                          <span className="text-teal-300">System Pop-Up</span>
                        )}
                        {rem.channels.email && <span className="text-sky-300">Email</span>}
                        {rem.channels.text && <span className="text-emerald-300">Text SMS</span>}
                        {rem.channels.overrideScreen && (
                          <span className="text-amber-300 font-semibold">
                            Screen Override
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (rem.channels.overrideScreen && preferences.overrideAppScreens) {
                            onClose();
                            onTriggerScreenOverride(rem);
                          } else {
                            onTriggerSystemPopup(
                              `Reminder: ${rem.title}`,
                              `Scheduled for ${rem.time}. Stay consistent with your daily routine!`,
                              'Habit Reminder'
                            );
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-teal-300 flex items-center gap-1 cursor-pointer"
                        title="Test this reminder right now"
                      >
                        <Play className="w-3 h-3" />
                        <span>Test Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleReminder(rem.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                          rem.enabled
                            ? 'bg-teal-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rem.enabled ? 'ON' : 'OFF'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-950 cursor-pointer"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== SECTION 2: MULTI-CHANNEL NOTIFICATIONS & SCREEN OVERRIDE ==================== */}
        {activeSection === 'channels' && (
          <div className="space-y-4">
            {/* Master Notification Toggle */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Enable All App Notifications
                  </h3>
                  <p className="text-xs text-slate-400">
                    Master switch for habit reminders, streak protection alerts, and community replies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdatePreferences({
                    ...preferences,
                    notificationsEnabled: !preferences.notificationsEnabled,
                  })
                }
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                  preferences.notificationsEnabled
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {preferences.notificationsEnabled ? 'ENABLED' : 'PAUSED'}
              </button>
            </div>

            {/* 3 Delivery Channels: Email, Text (SMS), System Pop-Ups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Channel 1: System Pop-Ups */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Monitor className="w-4 h-4 text-teal-400" />
                    <button
                      type="button"
                      onClick={() =>
                        onUpdatePreferences({
                          ...preferences,
                          systemPopupsEnabled: !preferences.systemPopupsEnabled,
                        })
                      }
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        preferences.systemPopupsEnabled
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {preferences.systemPopupsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-white">System Pop-Ups</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Instant desktop/mobile system pop-up banners when a routine or craving timer triggers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if ('Notification' in window && Notification.permission === 'default') {
                      Notification.requestPermission().catch(() => {});
                    }
                    onTriggerSystemPopup(
                      'System Pop-Up Active',
                      'Your Ascent system pop-up notifications are working properly!',
                      'System Pop-Up'
                    );
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-teal-300 cursor-pointer"
                >
                  Test System Pop-Up
                </button>
              </div>

              {/* Channel 2: Email Notifications */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <button
                      type="button"
                      onClick={() =>
                        onUpdatePreferences({
                          ...preferences,
                          emailAlertsEnabled: !preferences.emailAlertsEnabled,
                        })
                      }
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        preferences.emailAlertsEnabled
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {preferences.emailAlertsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-white">Email Notifications</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Receive daily habit summaries and missed check-in nudges via email.
                  </p>
                </div>

                <input
                  type="email"
                  value={preferences.emailAddress}
                  onChange={e =>
                    onUpdatePreferences({ ...preferences, emailAddress: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white"
                />
              </div>

              {/* Channel 3: Text (SMS) Notifications */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <button
                      type="button"
                      onClick={() =>
                        onUpdatePreferences({
                          ...preferences,
                          textSmsAlertsEnabled: !preferences.textSmsAlertsEnabled,
                        })
                      }
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        preferences.textSmsAlertsEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {preferences.textSmsAlertsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-white">Text / SMS Alerts</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Direct text message nudges for evening curfews and urgent streak protection.
                  </p>
                </div>

                <input
                  type="tel"
                  value={preferences.phoneNumber}
                  onChange={e =>
                    onUpdatePreferences({ ...preferences, phoneNumber: e.target.value })
                  }
                  placeholder="+1 (555) 234-8910"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-white"
                />
              </div>
            </div>

            {/* Option to Override App Screens */}
            <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3.5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">
                        Override App Screens for Priority Reminders & Curfews
                      </h4>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                        Screen Takeover
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                      When enabled, critical habit reminders (like your 8:30 PM Kitchen Close or Screen Time Curfew) will temporarily override the active app screen with a full-screen focus intervention until you complete or snooze the routine.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({
                      ...preferences,
                      overrideAppScreens: !preferences.overrideAppScreens,
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer shrink-0 ${
                    preferences.overrideAppScreens
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {preferences.overrideAppScreens ? 'SCREEN OVERRIDE: ON' : 'SCREEN OVERRIDE: OFF'}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>Hold takeover screen for:</span>
                  <select
                    value={preferences.screenOverrideDurationSeconds}
                    onChange={e =>
                      onUpdatePreferences({
                        ...preferences,
                        screenOverrideDurationSeconds: Number(e.target.value),
                      })
                    }
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={120}>2 minutes</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerScreenOverride(
                      reminders[0] || {
                        id: 'test-override',
                        title: '8:30 PM Herbal Tea & Kitchen Close',
                        time: '20:30',
                        days: DAYS_OF_WEEK,
                        enabled: true,
                        channels: {
                          email: true,
                          text: true,
                          systemPopup: true,
                          overrideScreen: true,
                        },
                      }
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Preview Full-Screen App Override Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 3: EMAILS FOR NEW FEATURES & UPDATES ==================== */}
        {activeSection === 'emails' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400">
                  Product Updates & Release Notes
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">
                  Receive Emails for New Features, Exercise Plans & Community Updates
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Stay informed whenever we release new habit routines, healthy meal & workout guides, or new sticker packs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      New Features & App Updates
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Instant email when new tools & trackers launch
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdatePreferences({
                        ...preferences,
                        receiveFeatureUpdateEmails: !preferences.receiveFeatureUpdateEmails,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                      preferences.receiveFeatureUpdateEmails
                        ? 'bg-teal-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {preferences.receiveFeatureUpdateEmails ? 'OPTED IN' : 'OFF'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Weekly Progress & Routine Digest
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Sunday recap of your streaks & top community tips
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdatePreferences({
                        ...preferences,
                        receiveWeeklyDigestEmails: !preferences.receiveWeeklyDigestEmails,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                      preferences.receiveWeeklyDigestEmails
                        ? 'bg-teal-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {preferences.receiveWeeklyDigestEmails ? 'OPTED IN' : 'OFF'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <input
                  type="email"
                  value={preferences.emailAddress}
                  onChange={e =>
                    onUpdatePreferences({ ...preferences, emailAddress: e.target.value })
                  }
                  placeholder="Enter your email address for feature updates..."
                  className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={handleSendTestFeatureEmail}
                  className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Sample Feature Update Email</span>
                </button>
              </div>

              {emailPreviewSent && (
                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/40 flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      Sample Feature Update Dispatched to {preferences.emailAddress}
                    </strong>
                    <span>
                      Subject: "What's New in Ascent: Custom Sticker Uploads, Internet Sticker Browser, Screen Override & Multi-Channel Reminders!"
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
