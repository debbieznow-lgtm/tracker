import React from 'react';
import {
  Home,
  ShieldCheck,
  Waves,
  BarChart3,
  Plus,
  Users,
  Crown,
  SlidersHorizontal,
  Dumbbell,
  BookOpen,
  Bot,
  Bell
} from 'lucide-react';
import { UserProfile, UserSubscription } from '../types/habit';
import { CuteAvatar } from './AvatarGallery';

export type NavTab =
  | 'today'
  | 'regimens'
  | 'sobriety'
  | 'notes'
  | 'community'
  | 'urge_surfer'
  | 'analytics'
  | 'pricing'
  | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewHabit: () => void;
  onTriggerSOS: () => void;
  onOpenProfile: () => void;
  onToggleAppearance?: () => void;
  isAppearanceOpen?: boolean;
  onOpenAICoach?: () => void;
  onOpenReminders?: () => void;
  activeRemindersCount?: number;
  notesCount?: number;
  userProfile: UserProfile;
  subscription?: UserSubscription;
  activeQuittingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewHabit,
  onOpenProfile,
  onToggleAppearance,
  isAppearanceOpen,
  onOpenAICoach,
  onOpenReminders,
  activeRemindersCount = 0,
  userProfile,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'today', label: 'Home' },
    { id: 'regimens', label: 'Exercise & Meals' },
    { id: 'sobriety', label: 'Quit Tracker' },
    { id: 'community', label: 'Community' },
    { id: 'notes', label: 'Notes' },
    { id: 'urge_surfer', label: 'Calm SOS' },
    { id: 'analytics', label: 'Progress' },
    { id: 'pricing', label: 'Plans' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark + Dedicated Home Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('today')}
              className="font-serif-editorial text-2xl text-white hover:text-teal-400 transition-colors cursor-pointer tracking-normal"
            >
              Ascent
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('today')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                currentTab === 'today'
                  ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
              title="Go to Home Dashboard"
            >
              <Home className="w-3.5 h-3.5 text-teal-400" />
              <span>Home</span>
            </button>
          </div>

          {/* Zone 2: Clean Single-Line Navigation */}
          <nav className="hidden md:flex items-center h-full gap-1 overflow-x-auto scrollbar-none">
            {navItems.slice(1).map(item => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative h-full px-3 text-xs transition-colors cursor-pointer flex items-center whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-teal-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Essential Actions (Reminders, Display, Coach, New Habit, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenReminders && (
              <button
                type="button"
                onClick={onOpenReminders}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Reminders, Notifications, Email Updates & Screen Override"
              >
                <Bell className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden lg:inline">Reminders</span>
                {activeRemindersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold">
                    {activeRemindersCount}
                  </span>
                )}
              </button>
            )}

            {onToggleAppearance && (
              <button
                onClick={onToggleAppearance}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border whitespace-nowrap shrink-0 ${
                  isAppearanceOpen
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
                title="Customize Display, Text & Colours"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden xl:inline">Display</span>
              </button>
            )}

            {onOpenAICoach && (
              <button
                onClick={onOpenAICoach}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Open Coach Assistant"
              >
                <Bot className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Coach</span>
              </button>
            )}

            <button
              onClick={onOpenNewHabit}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-400 hover:bg-teal-300 text-slate-950 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">New Habit</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer shrink-0"
              title="Profile & Settings"
            >
              <CuteAvatar
                avatarId={userProfile.avatarId}
                auraColor={userProfile.auraColor}
                size="sm"
              />
              <span className="hidden xl:inline text-xs font-medium text-slate-200 max-w-[80px] truncate">
                {userProfile.displayName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Includes Home Button first) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-1 py-1">
        <div className="grid grid-cols-8 items-center justify-items-center h-13">
          <button
            onClick={() => onSelectTab('today')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'today' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </button>

          <button
            onClick={() => onSelectTab('regimens')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'regimens' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Workouts</span>
          </button>

          <button
            onClick={() => onSelectTab('sobriety')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'sobriety' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Quit</span>
          </button>

          <button
            onClick={() => onSelectTab('community')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'community' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Groups</span>
          </button>

          <button
            onClick={() => onSelectTab('notes')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'notes' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Notes</span>
          </button>

          <button
            onClick={() => onSelectTab('urge_surfer')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'urge_surfer' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Calm</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'analytics' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Progress</span>
          </button>

          <button
            onClick={() => onSelectTab('pricing')}
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
              currentTab === 'pricing' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1">Plans</span>
          </button>
        </div>
      </nav>
    </>
  );
};
