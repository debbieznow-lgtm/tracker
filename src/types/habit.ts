export type HabitType = 'build' | 'quit';

export type HabitCategory =
  | 'eating'
  | 'drinking'
  | 'procrastination'
  | 'screen_time'
  | 'health'
  | 'mind'
  | 'fitness'
  | 'productivity'
  | 'substance'
  | 'behavioral'
  | 'digital'
  | 'finances';

export type QuitStrategy = 'cold_turkey' | 'harm_reduction';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type TriggerCategory =
  | 'stress'
  | 'boredom'
  | 'social'
  | 'loneliness'
  | 'fatigue'
  | 'habitual_cue'
  | 'emotional_pain'
  | 'celebration';

export interface RelapseRecord {
  id: string;
  date: string; // ISO
  trigger: TriggerCategory;
  notes?: string;
  daysSoberBefore: number;
  reflection?: string;
  actionPlanForNextTime?: string;
}

export interface HarmReductionConfig {
  stepUnit: string; // e.g. "cigarettes", "cans", "hours", "scrolls"
  baselineDailyAmount: number; // e.g. 20
  currentDailyLimit: number; // e.g. 10
  targetDailyLimit: number; // e.g. 0
  reductionStepIntervalDays: number; // reduce limit every X days
  lastAdjustedDate?: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  timing: string; // e.g. "Morning Cue", "When Craving Hits", "Evening Wind-Down"
  description: string;
  completedDates?: string[]; // YYYY-MM-DD strings when user practiced this routine step
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  type: HabitType;
  category: HabitCategory;
  icon: string;
  color: string;
  createdAt: string; // ISO
  archived?: boolean;

  // Build Habit specific fields
  targetUnit?: string; // e.g. "mins", "glasses", "pages", "reps"
  targetValue?: number; // e.g. 8, 30, 1
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek?: number; // 1-7
  timeOfDay: TimeOfDay;

  // Addiction / Quitting specific fields
  substanceOrVice?: string;
  quitStrategy?: QuitStrategy;
  quitDate?: string; // ISO of start date or last clean streak start
  dailyCostSaved?: number; // in user currency e.g. 12.50
  dailyMinutesReclaimed?: number; // e.g. 90 minutes
  reasonsToQuit?: string[]; // "My Why"
  harmReduction?: HarmReductionConfig;
  relapseHistory?: RelapseRecord[];

  // Guided Routines to help quit/reduce or anchor the habit
  routines?: RoutineStep[];
  communityCircleId?: string;
}

export interface DailyCheckIn {
  id: string;
  habitId: string;
  date: string; // 'YYYY-MM-DD'
  completed: boolean;
  value?: number; // for quantitative habits or harm-reduction intake count
  notes?: string;
  loggedAt: string; // ISO
}

export interface UrgeLog {
  id: string;
  habitId: string;
  timestamp: string; // ISO
  intensity: number; // 1 to 10
  trigger: TriggerCategory;
  surfedMinutes?: number;
  resisted: boolean;
  notes?: string;
}

export interface HealthMilestone {
  id: string;
  viceType: 'nicotine' | 'alcohol' | 'caffeine' | 'screen' | 'sugar' | 'procrastination' | 'general';
  timeSeconds: number; // seconds clean required
  title: string;
  description: string;
  benefitCategory: 'cardiovascular' | 'mental' | 'sleep' | 'neuro' | 'physical' | 'financial';
}

export type DisplayTheme = 'dark' | 'midnight' | 'light';
export type LayoutDisplay = 'grid' | 'list' | 'compact';
export type AccentColor = 'teal' | 'emerald' | 'indigo' | 'sky' | 'amber' | 'rose' | 'violet';
export type TextSize = 'sm' | 'md' | 'lg' | 'xl';
export type TextFontStyle = 'clean' | 'serif' | 'rounded' | 'mono';
export type TextColorTone = 'default' | 'warm' | 'mint' | 'sky' | 'amber' | 'rose';

export interface AppearanceSettings {
  displayTheme: DisplayTheme;
  layoutDisplay: LayoutDisplay;
  accentColor: AccentColor;
  textSize: TextSize;
  fontStyle?: TextFontStyle;
  textColor?: TextColorTone;
  brightnessLevel: number; // 50 to 130 (default 100%)
  colorIntensity: number; // 20 to 160 (default 100%)
}

export interface UserProfile {
  displayName: string;
  handle: string;
  avatarId: string;
  auraColor: string;
  titleBadge: string;
  bio: string;
  joinedCircles: string[];
  pledgeDate: string;
  dmEnabled?: boolean;
  joinedWhatsAppCircles?: string[];
  joinedTelegramCircles?: string[];
}

export interface StickerItem {
  id: string;
  label: string;
  imageUrl: string;
  category: 'builtin' | 'uploaded' | 'internet';
  tags?: string[];
  createdAt?: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatarId: string;
  authorAuraColor: string;
  text: string;
  stickerUrl?: string;
  stickerLabel?: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  circleId: string; // 'eating' | 'drinking' | 'procrastination' | 'screen_time' | 'nicotine' | 'general'
  authorName: string;
  authorHandle: string;
  authorAvatarId: string;
  authorAuraColor: string;
  authorBadge: string;
  streakDays: number;
  content: string;
  routineShared?: string;
  imageUrl?: string;
  imageCaption?: string;
  stickerUrl?: string;
  stickerLabel?: string;
  timestamp: string;
  cheersCount: number;
  cheeredByMe?: boolean;
  comments: CommunityComment[];
}

export interface CommunityCircle {
  id: string;
  name: string;
  category: HabitCategory;
  tagline: string;
  memberCount: number;
  activeNowCount: number;
  weeklyChallenge: string;
  whatsappGroupUrl?: string;
  telegramGroupUrl?: string;
  whatsappMembersCount?: number;
  telegramMembersCount?: number;
  featuredRoutines: { title: string; timing: string; description: string }[];
}

export interface DirectMessage {
  id: string;
  senderHandle: string; // '@me' or peer handle
  senderName: string;
  text: string;
  imageUrl?: string;
  stickerUrl?: string;
  stickerLabel?: string;
  timestamp: string;
}

export interface DMConversation {
  id: string;
  peerName: string;
  peerHandle: string;
  peerAvatarId: string;
  peerAuraColor: string;
  peerBadge: string;
  peerCircleId: string;
  peerOnline: boolean;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string; // 'HH:MM' e.g. '08:00'
  days: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  enabled: boolean;
  habitId?: string;
  channels: {
    email: boolean;
    text: boolean;
    systemPopup: boolean;
    overrideScreen: boolean;
  };
}

export interface NotificationPreferences {
  receiveFeatureUpdateEmails: boolean;
  receiveWeeklyDigestEmails: boolean;
  emailAddress: string;
  phoneNumber: string;
  notificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  textSmsAlertsEnabled: boolean;
  systemPopupsEnabled: boolean;
  overrideAppScreens: boolean;
  screenOverrideDurationSeconds: number;
}

export type PlanTierId = 'starter' | 'pro' | 'mastery';
export type BillingCycle = 'monthly' | 'yearly';

export interface UserSubscription {
  tierId: PlanTierId;
  billingCycle: BillingCycle;
  isNewUserDiscountApplied: boolean;
  subscribedAt?: string;
  active: boolean;
  paymentChannel?: string;
}

export type ExerciseVisualType =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'carry'
  | 'push'
  | 'row'
  | 'press'
  | 'stretch'
  | 'walk'
  | 'hang';

export interface ExerciseMovement {
  id: string;
  name: string;
  Prescription: string; // e.g. "3 sets × 10 reps · Rest 75s"
  focusCue: string;
  description: string; // Simple explanation of what the exercise does
  stepByStep: string[]; // Step 1, Step 2, Step 3 in plain words
  visualDirection: string; // Visual cue of body movement & posture direction
  musclesWorked: string; // e.g. "Thighs, Hips & Core"
  visualGuideType: ExerciseVisualType;
  category: 'strength' | 'cardio' | 'mobility' | 'recovery';
}

export interface ExerciseDaySchedule {
  dayLabel: string;
  focus: string;
  durationMinutes: number;
  intensity: 'Low' | 'Moderate' | 'High';
  movements: ExerciseMovement[];
}

export interface ExercisePlan {
  id: string;
  numberLabel: string;
  title: string;
  subtitle: string;
  level: string;
  daysPerWeek: number;
  sessionMinutes: number;
  primaryGoal: string;
  overview: string;
  weeklySchedule: ExerciseDaySchedule[];
  routineStepsForHabit: { title: string; timing: string; description: string }[];
}

export interface MealSlot {
  id: string;
  slotLabel: string; // "07:30 · Morning Anchor", "12:30 · Midday Plate", etc.
  name: string;
  description: string;
  prepMinutes: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  keyIngredients: string[];
}

export interface EatingPlan {
  id: string;
  numberLabel: string;
  title: string;
  subtitle: string;
  philosophy: string;
  dailyCalories: number;
  macroSplit: { proteinGrams: number; carbsGrams: number; fatsGrams: number; fiberGrams: number };
  hydrationTargetLiters: number;
  eatingWindow: string;
  meals: MealSlot[];
  stapleGroceryList: { category: string; items: string[] }[];
  routineStepsForHabit: { title: string; timing: string; description: string }[];
}

export interface UserVitalityState {
  activeExercisePlanId: string;
  activeEatingPlanId: string;
  completedMovementsByDate: Record<string, string[]>; // YYYY-MM-DD -> movement IDs
  completedMealsByDate: Record<string, string[]>; // YYYY-MM-DD -> meal IDs
  waterGlassesByDate: Record<string, number>; // YYYY-MM-DD -> glasses count
  checkedGroceryItems: string[];
}

export type NoteCategory =
  | 'daily_log'
  | 'craving_trigger'
  | 'workout_meal'
  | 'doctor_therapy'
  | 'milestone_win'
  | 'general';

export type MoodLevel = 'great' | 'good' | 'okay' | 'tough';

export interface DocumentationNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  linkedHabitId?: string;
  mood?: MoodLevel;
  tags: string[];
  pinned?: boolean;
  actionSteps?: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface DailyMoodLog {
  date: string; // YYYY-MM-DD
  mood: MoodLevel;
  energy: number; // 1 to 5
  gratitudeNote: string;
  streakFreezeUsed?: boolean;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  savedToNotes?: boolean;
}

