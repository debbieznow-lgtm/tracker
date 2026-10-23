import React from 'react';
import {
  Activity,
  Flame,
  Droplets,
  Sparkles,
  BookOpen,
  Moon,
  Sun,
  Shield,
  Heart,
  Wind,
  Smartphone,
  Wine,
  Cigarette,
  Coffee,
  Coins,
  Brain,
  Smile,
  Compass,
  Zap,
  CheckCircle2,
  Circle,
  HelpCircle,
  BellOff,
  Utensils,
  Timer,
  Target,
  Cookie
} from 'lucide-react';

export const ICON_OPTIONS: { name: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: 'Utensils', label: 'Mindful Eating & Nutrition', icon: Utensils },
  { name: 'Cookie', label: 'Quit Sugar / Binge Eating', icon: Cookie },
  { name: 'Wine', label: 'Quit / Reduce Alcohol & Drinking', icon: Wine },
  { name: 'Timer', label: 'Beat Procrastination & Focus', icon: Timer },
  { name: 'Smartphone', label: 'Social Media & Screen Time Detox', icon: Smartphone },
  { name: 'Wind', label: 'Breathing / Nicotine Quit', icon: Wind },
  { name: 'Cigarette', label: 'Smoke / Vape Quit', icon: Cigarette },
  { name: 'BellOff', label: 'Quiet / No Distractions', icon: BellOff },
  { name: 'Coffee', label: 'Caffeine Reduction', icon: Coffee },
  { name: 'Coins', label: 'Gambling / Spending', icon: Coins },
  { name: 'Sparkles', label: 'Mindfulness / Meditation', icon: Sparkles },
  { name: 'Droplets', label: 'Hydration / Water', icon: Droplets },
  { name: 'Activity', label: 'Exercise / Movement', icon: Activity },
  { name: 'BookOpen', label: 'Reading & Learning', icon: BookOpen },
  { name: 'Target', label: 'Deep Work & Goals', icon: Target },
  { name: 'Moon', label: 'Sleep & Rest', icon: Moon },
  { name: 'Sun', label: 'Morning Routine', icon: Sun },
  { name: 'Shield', label: 'Protection & Willpower', icon: Shield },
  { name: 'Heart', label: 'Health & Self-Care', icon: Heart },
  { name: 'Brain', label: 'Mental Focus', icon: Brain },
  { name: 'Zap', label: 'Energy & Discipline', icon: Zap },
  { name: 'Flame', label: 'Passion / Streak', icon: Flame },
];

export function renderIcon(iconName: string, className = 'w-5 h-5') {
  const match = ICON_OPTIONS.find(o => o.name.toLowerCase() === iconName.toLowerCase());
  if (match) {
    const Component = match.icon;
    return <Component className={className} />;
  }
  return <Sparkles className={className} />;
}
