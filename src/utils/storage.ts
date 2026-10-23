import {
  AIChatMessage,
  AppearanceSettings,
  CommunityCircle,
  CommunityPost,
  DailyCheckIn,
  DailyMoodLog,
  DMConversation,
  DocumentationNote,
  EatingPlan,
  ExercisePlan,
  Habit,
  NotificationPreferences,
  RelapseRecord,
  ReminderItem,
  StickerItem,
  UrgeLog,
  UserProfile,
  UserSubscription,
  UserVitalityState
} from '../types/habit';

const STORAGE_KEYS = {
  HABITS: 'ascent_habits_v1',
  CHECK_INS: 'ascent_check_ins_v1',
  URGE_LOGS: 'ascent_urge_logs_v1',
  CURRENCY: 'ascent_currency_v1',
  APPEARANCE: 'ascent_appearance_v1',
  PROFILE: 'ascent_profile_v1',
  COMMUNITY_POSTS: 'ascent_community_posts_v1',
  SUBSCRIPTION: 'ascent_subscription_v1',
  VITALITY: 'ascent_vitality_v1',
  NOTES: 'ascent_documentation_notes_v1',
  MOOD_LOGS: 'ascent_daily_mood_logs_v1',
  AI_CHAT: 'ascent_ai_chat_v1',
  DM_CONVERSATIONS: 'ascent_dm_conversations_v1',
  NOTIFICATION_PREFS: 'ascent_notification_prefs_v1',
  REMINDERS: 'ascent_reminders_v1',
  CUSTOM_STICKERS: 'ascent_custom_stickers_v1',
};

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tierId: 'starter',
  billingCycle: 'monthly',
  isNewUserDiscountApplied: true,
  active: false,
};

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  displayTheme: 'dark',
  layoutDisplay: 'grid',
  accentColor: 'teal',
  textSize: 'md',
  fontStyle: 'clean',
  textColor: 'default',
  brightnessLevel: 100,
  colorIntensity: 100,
};

export const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Alex Rivera',
  handle: '@alex_ascent',
  avatarId: 'zen-capybara',
  auraColor: 'teal',
  titleBadge: 'Mindful Wave Rider',
  bio: 'Reclaiming focus, nourishing my body, and living present one day at a time.',
  joinedCircles: ['eating', 'drinking', 'procrastination', 'screen_time', 'nicotine'],
  pledgeDate: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
  dmEnabled: true,
  joinedWhatsAppCircles: ['eating'],
  joinedTelegramCircles: ['procrastination'],
};

export const COMMUNITY_CIRCLES: CommunityCircle[] = [
  {
    id: 'eating',
    name: 'Mindful Eating & Sugar-Free Sanctuary',
    category: 'eating',
    tagline: 'Breaking emotional snacking, late-night binges, and ultra-processed sugar loops together.',
    memberCount: 14820,
    activeNowCount: 312,
    weeklyChallenge: '7-Day Kitchen Closed After 8:30 PM & Protein-First Breakfast',
    whatsappGroupUrl: 'https://chat.whatsapp.com/AscentMindfulEatingSupport',
    telegramGroupUrl: 'https://t.me/AscentMindfulEatingCircle',
    whatsappMembersCount: 1840,
    telegramMembersCount: 2610,
    featuredRoutines: [
      {
        title: '30g Protein + Fiber First Meal Anchor',
        timing: 'Morning / First Meal',
        description: 'Stabilizes blood glucose for 6+ hours and prevents 4 PM and 10 PM sugar crashes.',
      },
      {
        title: 'The 10-Minute HALT Kitchen Pause',
        timing: 'When Snacking Urge Hits',
        description: 'Drink 1 glass of water and ask: Am I physically hungry, or stressed/bored/tired?',
      },
      {
        title: 'Herbal Tea & Mint Brush Kitchen Close',
        timing: '8:30 PM Evening Cue',
        description: 'Brew peppermint or chamomile tea and brush teeth early to signal the brain that eating is done.',
      },
    ],
  },
  {
    id: 'drinking',
    name: 'Clear Glass · Alcohol-Free & Mindful Drinking',
    category: 'drinking',
    tagline: 'Trading hangovers, bar tabs, and sugary drinks for deep REM sleep and crisp mornings.',
    memberCount: 19340,
    activeNowCount: 428,
    weeklyChallenge: '5:00 PM Mocktail Ritual Swap & 100% Clear Weekend Mornings',
    whatsappGroupUrl: 'https://chat.whatsapp.com/AscentClearGlassSupport',
    telegramGroupUrl: 'https://t.me/AscentClearGlassCommunity',
    whatsappMembersCount: 2290,
    telegramMembersCount: 3420,
    featuredRoutines: [
      {
        title: 'The 5:00 PM Glassware Ritual Swap',
        timing: '5:00 PM Transition Hour',
        description: 'Pour sparkling water, tart cherry, or bitters & lime into a nice glass as soon as work ends.',
      },
      {
        title: 'First-Drink Delay & Electrolyte Rule',
        timing: 'Social Events / Dinners',
        description: 'Always order sparkling water with lime first; never drink on an empty stomach.',
      },
      {
        title: 'Morning Clarity Gratitude Log',
        timing: '7:30 AM Waking Cue',
        description: 'Savor waking up hydrated without headache or regret; log your money saved.',
      },
    ],
  },
  {
    id: 'procrastination',
    name: 'Momentum Lab · Procrastination Breakers',
    category: 'procrastination',
    tagline: 'Dissolving task paralysis, perfectionism dread, and last-minute panic through micro-starts.',
    memberCount: 22610,
    activeNowCount: 519,
    weeklyChallenge: 'Eat the Frog Before 10:00 AM Using the 2-Minute Entry Rule',
    whatsappGroupUrl: 'https://chat.whatsapp.com/AscentMomentumLabSupport',
    telegramGroupUrl: 'https://t.me/AscentMomentumLabCommunity',
    whatsappMembersCount: 3120,
    telegramMembersCount: 4890,
    featuredRoutines: [
      {
        title: 'The 2-Minute Micro-Entry Rule',
        timing: 'Task Start Cue',
        description: 'Commit to working on the dreaded task for just 120 seconds—open the file and write 1 sentence.',
      },
      {
        title: 'Single-Tab 25-Minute Focus Sprint',
        timing: 'Morning Deep Work',
        description: 'Close all browser tabs except the active workspace and run one uninterrupted 25-min timer.',
      },
      {
        title: 'Evening Top-1 Tomorrow Lock',
        timing: 'End of Workday',
        description: 'Write down the exact first step of tomorrow’s #1 priority so you never wake up to ambiguity.',
      },
    ],
  },
  {
    id: 'screen_time',
    name: 'Unplugged · Social Media & Screen Time Detox',
    category: 'screen_time',
    tagline: 'Ending algorithmic doomscrolling, phantom phone checks, and bedtime blue-light insomnia.',
    memberCount: 26490,
    activeNowCount: 604,
    weeklyChallenge: 'No Phone in the Bedroom & Analog First 45 Minutes of Every Morning',
    whatsappGroupUrl: 'https://chat.whatsapp.com/AscentUnpluggedDetoxSupport',
    telegramGroupUrl: 'https://t.me/AscentUnpluggedCommunity',
    whatsappMembersCount: 2740,
    telegramMembersCount: 4150,
    featuredRoutines: [
      {
        title: 'Analog First 45 Minutes',
        timing: 'Upon Waking',
        description: 'No feeds, notifications, or short-form video until after hydration, sunlight, and breakfast.',
      },
      {
        title: 'Grayscale Mode & App Friction Lock',
        timing: 'All Day Guardrail',
        description: 'Remove social apps from home screen and switch display to grayscale after 8:00 PM.',
      },
      {
        title: 'Hallway Charging Dock Curfew',
        timing: '10:00 PM Wind-Down',
        description: 'Plug your phone in outside the bedroom and read a physical book or stretch before sleep.',
      },
    ],
  },
  {
    id: 'nicotine',
    name: 'Pure Breath · Nicotine & Vape Recovery',
    category: 'substance',
    tagline: 'Reclaiming lung capacity, calm heart rate, and freedom from chemical loops.',
    memberCount: 16750,
    activeNowCount: 289,
    weeklyChallenge: 'Box Breathing Through Every Craving Wave',
    whatsappGroupUrl: 'https://chat.whatsapp.com/AscentPureBreathSupport',
    telegramGroupUrl: 'https://t.me/AscentPureBreathCommunity',
    whatsappMembersCount: 1960,
    telegramMembersCount: 2840,
    featuredRoutines: [
      {
        title: 'Ice Water Straw & Cinnamon Toothpick Swap',
        timing: 'Oral Fixation Cue',
        description: 'Sip ice-cold water through a straw to trigger a vagus nerve dopamine reset.',
      },
      {
        title: '4-4-4-4 Box Breathing Wave',
        timing: 'Craving Spike',
        description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s for 3 minutes until the urge wave breaks.',
      },
    ],
  },
];

// Default seed data so the user has an immediate, functional experience across Eating, Drinking, Procrastination, Screen Time, and Sobriety
export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-eating',
    title: 'Mindful Eating · Quit Sugar & Night Snacking',
    description: 'End emotional late-night binge eating and ultra-processed sugar crashes with nourishing routines.',
    type: 'quit',
    category: 'eating',
    icon: 'Utensils',
    color: 'emerald',
    createdAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
    substanceOrVice: 'Sugar & Emotional Binge Eating',
    quitStrategy: 'harm_reduction',
    quitDate: new Date(Date.now() - 10 * 86400 * 1000 + 2 * 3600 * 1000).toISOString(),
    dailyCostSaved: 9.50,
    dailyMinutesReclaimed: 35,
    reasonsToQuit: [
      'Wake up feeling light, energized, and free from digestive bloating',
      'Break the stress-eating loop after long workdays',
      'Stabilize afternoon mood and blood sugar without candy or delivery snacks',
    ],
    harmReduction: {
      stepUnit: 'sugary snacks/day',
      baselineDailyAmount: 5,
      currentDailyLimit: 1,
      targetDailyLimit: 0,
      reductionStepIntervalDays: 7,
    },
    routines: [
      {
        id: 'rt-eat-1',
        title: '30g Protein + Fiber First Meal Anchor',
        timing: 'Morning Cue',
        description: 'Eat a protein-rich breakfast to prevent afternoon and late-night sugar cravings.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-eat-2',
        title: '10-Minute HALT Water Pause',
        timing: 'Before Snacking',
        description: 'Drink a full glass of water and wait 10 minutes to check if hunger is emotional or physical.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-eat-3',
        title: '8:30 PM Herbal Tea & Kitchen Close',
        timing: 'Evening Routine',
        description: 'Brew peppermint tea, dim kitchen lights, and brush teeth to close the eating window.',
        completedDates: [],
      },
    ],
    communityCircleId: 'eating',
    frequency: 'daily',
    timeOfDay: 'evening',
    relapseHistory: [],
  },
  {
    id: 'habit-drinking',
    title: 'Clear Glass · Quit Alcohol & Mindful Drinking',
    description: 'Replace evening drinks with restorative sleep, liver vitality, and crisp morning energy.',
    type: 'quit',
    category: 'drinking',
    icon: 'Wine',
    color: 'rose',
    createdAt: new Date(Date.now() - 16 * 86400 * 1000).toISOString(),
    substanceOrVice: 'Alcohol & Evening Drinking',
    quitStrategy: 'cold_turkey',
    quitDate: new Date(Date.now() - 16 * 86400 * 1000 + 5 * 3600 * 1000).toISOString(),
    dailyCostSaved: 15.00,
    dailyMinutesReclaimed: 90,
    reasonsToQuit: [
      'Experience deep uninterrupted REM sleep and zero morning hangxiety',
      'Save $450+ every month from bar tabs and bottle runs',
      'Stay sharp, emotionally present, and clear-headed every evening',
    ],
    routines: [
      {
        id: 'rt-drk-1',
        title: '5:00 PM Sparkling Bitters & Lime Ritual Swap',
        timing: '5:00 PM Cue',
        description: 'Pour sparkling water with lime and tart cherry into a stemmed glass right after work.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-drk-2',
        title: 'Social Event First-Order Script',
        timing: 'Social Gatherings',
        description: 'Immediately order club soda with lime so your hands are full and decision fatigue is zero.',
        completedDates: [],
      },
      {
        id: 'rt-drk-3',
        title: 'Magnesium & Deep Sleep Wind-Down',
        timing: '9:30 PM Bedtime',
        description: 'Replace the nightcap with magnesium glycinate and 10 pages of fiction.',
        completedDates: [],
      },
    ],
    communityCircleId: 'drinking',
    frequency: 'daily',
    timeOfDay: 'evening',
    relapseHistory: [],
  },
  {
    id: 'habit-procrastination',
    title: 'Beat Procrastination & Task Avoidance',
    description: 'Dissolve perfectionism paralysis and doom-delaying using micro-starts and focus sprints.',
    type: 'quit',
    category: 'procrastination',
    icon: 'Timer',
    color: 'amber',
    createdAt: new Date(Date.now() - 9 * 86400 * 1000).toISOString(),
    substanceOrVice: 'Procrastination & Task Avoidance',
    quitStrategy: 'cold_turkey',
    quitDate: new Date(Date.now() - 9 * 86400 * 1000 + 3 * 3600 * 1000).toISOString(),
    dailyCostSaved: 0,
    dailyMinutesReclaimed: 110,
    reasonsToQuit: [
      'Enjoy guilt-free evenings without looming deadline dread',
      'Build unshakable self-trust by doing what I say I will do',
      'Reclaim nearly 2 hours a day lost to anxious avoidance',
    ],
    routines: [
      {
        id: 'rt-prc-1',
        title: 'The 2-Minute Micro-Entry Rule',
        timing: 'When Avoiding a Task',
        description: 'Open the document or tool and work for just 120 seconds to break activation friction.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-prc-2',
        title: 'Single-Tab 25-Min Pomodoro Sprint',
        timing: 'Morning Focus Block',
        description: 'Close all distractions and complete one 25-minute sprint on your hardest priority.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-prc-3',
        title: 'Tomorrow Top-1 Action Lock',
        timing: '5:30 PM Wrap-Up',
        description: 'Write the exact first 2-minute action for tomorrow morning before shutting down.',
        completedDates: [],
      },
    ],
    communityCircleId: 'procrastination',
    frequency: 'daily',
    timeOfDay: 'morning',
    relapseHistory: [],
  },
  {
    id: 'habit-screen-time',
    title: 'Social Media & Screen Time Detox',
    description: 'Replace endless short-form video feeds and bedtime scrolling with real-world presence.',
    type: 'quit',
    category: 'screen_time',
    icon: 'Smartphone',
    color: 'indigo',
    createdAt: new Date(Date.now() - 21 * 86400 * 1000).toISOString(),
    substanceOrVice: 'Social Media & Doomscrolling',
    quitStrategy: 'harm_reduction',
    quitDate: new Date(Date.now() - 21 * 86400 * 1000).toISOString(),
    dailyCostSaved: 0,
    dailyMinutesReclaimed: 95,
    reasonsToQuit: [
      'Fall asleep naturally before 11:00 PM without digital agitation',
      'Reclaim 10+ hours per week for reading and creative projects',
      'End dopamine burnout and comparison-induced anxiety',
    ],
    harmReduction: {
      stepUnit: 'minutes/day',
      baselineDailyAmount: 180,
      currentDailyLimit: 40,
      targetDailyLimit: 0,
      reductionStepIntervalDays: 7,
    },
    routines: [
      {
        id: 'rt-scr-1',
        title: 'Analog First 45 Minutes After Waking',
        timing: 'Morning Cue',
        description: 'Keep phone in airplane mode until after water, sunlight, and morning movement.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-scr-2',
        title: '8:00 PM Grayscale Display Switch',
        timing: 'Evening Guardrail',
        description: 'Turn screen grayscale to strip hyper-stimulating color hooks from social feeds.',
        completedDates: [],
      },
      {
        id: 'rt-scr-3',
        title: 'Out-of-Bedroom Charging Station',
        timing: '10:00 PM Bedtime',
        description: 'Dock phone in another room overnight and use a dedicated alarm or book.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
    ],
    communityCircleId: 'screen_time',
    frequency: 'daily',
    timeOfDay: 'evening',
  },
  {
    id: 'habit-quit-nicotine',
    title: 'Quit Vaping & Nicotine',
    description: 'Breathe free, protect cardiovascular stamina, and rewire dopamine pathways.',
    type: 'quit',
    category: 'substance',
    icon: 'Wind',
    color: 'teal',
    createdAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    substanceOrVice: 'Nicotine / Vaping',
    quitStrategy: 'cold_turkey',
    quitDate: new Date(Date.now() - 14 * 86400 * 1000 + 4 * 3600 * 1000).toISOString(),
    dailyCostSaved: 12.50,
    dailyMinutesReclaimed: 45,
    reasonsToQuit: [
      'Stop waking up with morning chest tightness and shallow breathing',
      'Save over $4,500 every single year for my dream travel fund',
      'Break free from the mental anxiety of constantly needing a puff',
    ],
    routines: [
      {
        id: 'rt-nic-1',
        title: 'Ice Water Straw Sip & 4-4-4-4 Breath',
        timing: 'When Craving Hits',
        description: 'Sip ice water through a straw and complete 4 rounds of box breathing.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'rt-nic-2',
        title: 'Post-Meal Mint Gum / Brisk 5-Min Walk',
        timing: 'After Meals',
        description: 'Replace the post-meal nicotine cue with fresh mint gum and a quick walk.',
        completedDates: [],
      },
    ],
    communityCircleId: 'nicotine',
    frequency: 'daily',
    timeOfDay: 'anytime',
    relapseHistory: [],
  },
  {
    id: 'habit-mindfulness',
    title: 'Morning Mindfulness & Breathwork',
    description: '10 minutes of grounding box breathing and silent reflection.',
    type: 'build',
    category: 'mind',
    icon: 'Sparkles',
    color: 'emerald',
    createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
    targetUnit: 'mins',
    targetValue: 10,
    frequency: 'daily',
    timeOfDay: 'morning',
    routines: [
      {
        id: 'rt-mnd-1',
        title: '10-Minute Seated Box Breathing',
        timing: '7:00 AM',
        description: 'Sit upright before checking messages and observe 10 minutes of breath.',
        completedDates: [new Date().toISOString().split('T')[0]],
      },
    ],
  },
  {
    id: 'habit-hydration',
    title: 'Hydrate 2.5 Liters',
    description: 'Optimal metabolic flush, sustained energy, and cognitive clarity.',
    type: 'build',
    category: 'health',
    icon: 'Droplets',
    color: 'sky',
    createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
    targetUnit: 'glasses',
    targetValue: 8,
    frequency: 'daily',
    timeOfDay: 'anytime',
  },
];

export const PROGRESS_PHOTO_PRESETS: { id: string; label: string; caption: string; dataUrl: string }[] = [
  {
    id: 'meal-prep-bowl',
    label: 'Healthy Meal Plate',
    caption: '30g Protein Breakfast Plate · Eggs, Avocado, Greens & Berries',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#132a26"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#bg1)"/>
        <circle cx="220" cy="185" r="118" fill="#1e293b" stroke="#334155" stroke-width="4"/>
        <circle cx="220" cy="185" r="98" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <!-- Greens -->
        <circle cx="178" cy="155" r="34" fill="#10b981" opacity="0.85"/>
        <circle cx="162" cy="185" r="28" fill="#059669" opacity="0.9"/>
        <!-- Eggs -->
        <circle cx="252" cy="152" r="28" fill="#f8fafc"/>
        <circle cx="252" cy="152" r="13" fill="#f59e0b"/>
        <circle cx="264" cy="198" r="26" fill="#f8fafc"/>
        <circle cx="264" cy="198" r="12" fill="#f59e0b"/>
        <!-- Berries / Tomatoes -->
        <circle cx="205" cy="226" r="14" fill="#f43f5e"/>
        <circle cx="230" cy="234" r="12" fill="#e11d48"/>
        <!-- Herbal Tea Mug -->
        <rect x="380" y="135" width="76" height="92" rx="14" fill="#1e293b" stroke="#2dd4bf" stroke-width="3"/>
        <path d="M456 155 C482 155, 482 205, 456 205" fill="none" stroke="#2dd4bf" stroke-width="5"/>
        <path d="M402 118 Q410 100 402 86 M426 118 Q434 100 426 86" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        <!-- Badge -->
        <rect x="380" y="250" width="210" height="44" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5"/>
        <text x="396" y="270" fill="#2dd4bf" font-family="monospace" font-size="12" font-weight="bold">DAY 18 PROGRESS SNAPSHOT</text>
        <text x="396" y="286" fill="#e2e8f0" font-family="sans-serif" font-size="11">32g Protein · Zero Refined Sugar</text>
      </svg>`),
  },
  {
    id: 'workout-check',
    label: 'Workout Complete',
    caption: '35-Min Strength & Posture Session Completed · Kettlebell & Mat',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#172554"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#bg2)"/>
        <!-- Yoga / Exercise Mat -->
        <rect x="80" y="210" width="320" height="65" rx="12" fill="#0d9488" opacity="0.35" stroke="#2dd4bf" stroke-width="2"/>
        <!-- Dumbbells -->
        <g transform="translate(150, 165)">
          <rect x="0" y="12" width="18" height="44" rx="5" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
          <rect x="18" y="27" width="54" height="14" rx="3" fill="#64748b"/>
          <rect x="72" y="12" width="18" height="44" rx="5" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
        </g>
        <!-- Kettlebell -->
        <g transform="translate(295, 135)">
          <path d="M22 35 C22 10, 68 10, 68 35" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
          <circle cx="45" cy="65" r="34" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
          <text x="45" y="70" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">16KG</text>
        </g>
        <!-- Stats Card -->
        <rect x="425" y="95" width="170" height="180" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="445" y="128" fill="#2dd4bf" font-family="monospace" font-size="11" font-weight="bold">WORKOUT LOGGED</text>
        <text x="445" y="162" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">35 mins</text>
        <text x="445" y="185" fill="#94a3b8" font-family="sans-serif" font-size="12">4/4 Movements Done</text>
        <line x1="445" y1="205" x2="575" y2="205" stroke="#1e293b" stroke-width="2"/>
        <text x="445" y="230" fill="#10b981" font-family="monospace" font-size="12">✓ Squat + RDL + Row</text>
        <text x="445" y="252" fill="#e2e8f0" font-family="monospace" font-size="11">Posture & Core Strong</text>
      </svg>`),
  },
  {
    id: 'screen-detox-desk',
    label: 'Unplugged Desk & Book',
    caption: 'Evening Analog Wind-Down · Paper Book, Journal & Phone Out of Bedroom',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
        <defs>
          <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#bg3)"/>
        <!-- Open Hardcover Book -->
        <g transform="translate(110, 95)">
          <rect x="0" y="0" width="130" height="170" rx="6" fill="#1e293b" stroke="#818cf8" stroke-width="2.5"/>
          <rect x="130" y="0" width="130" height="170" rx="6" fill="#1e293b" stroke="#818cf8" stroke-width="2.5"/>
          <line x1="22" y1="35" x2="108" y2="35" stroke="#64748b" stroke-width="3"/>
          <line x1="22" y1="58" x2="108" y2="58" stroke="#64748b" stroke-width="3"/>
          <line x1="22" y1="81" x2="96" y2="81" stroke="#64748b" stroke-width="3"/>
          <line x1="152" y1="35" x2="238" y2="35" stroke="#64748b" stroke-width="3"/>
          <line x1="152" y1="58" x2="238" y2="58" stroke="#64748b" stroke-width="3"/>
          <line x1="152" y1="81" x2="215" y2="81" stroke="#64748b" stroke-width="3"/>
          <rect x="124" y="0" width="12" height="178" rx="4" fill="#6366f1"/>
        </g>
        <!-- Screen Time Down Card -->
        <rect x="405" y="95" width="185" height="170" rx="14" fill="#0f172a" stroke="#4f46e5" stroke-width="2"/>
        <text x="425" y="128" fill="#818cf8" font-family="monospace" font-size="11" font-weight="bold">SCREEN TIME DETOX</text>
        <text x="425" y="164" fill="#ffffff" font-family="monospace" font-size="26" font-weight="bold">42m / day</text>
        <text x="425" y="188" fill="#10b981" font-family="monospace" font-size="12">↓ Down from 4h 30m</text>
        <text x="425" y="222" fill="#cbd5e1" font-family="sans-serif" font-size="11">31 Days Doomscroll-Free</text>
        <text x="425" y="242" fill="#94a3b8" font-family="sans-serif" font-size="11">Phone docked in hallway</text>
      </svg>`),
  },
  {
    id: 'streak-milestone-badge',
    label: 'Clean Streak Milestone',
    caption: '45 Days Alcohol-Free · Sparkling Lime Ritual & $540 Saved',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
        <defs>
          <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#0c4a6e"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#bg4)"/>
        <circle cx="200" cy="180" r="95" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
        <text x="200" y="170" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="44" font-weight="bold">45</text>
        <text x="200" y="198" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">DAYS CLEAN</text>
        <text x="200" y="222" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Clear Glass Circle</text>
        <rect x="335" y="105" width="245" height="150" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <text x="358" y="140" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">RECOVERY MILESTONE</text>
        <text x="358" y="172" fill="#10b981" font-family="monospace" font-size="20" font-weight="bold">+$540.00 Saved</text>
        <text x="358" y="200" fill="#e2e8f0" font-family="sans-serif" font-size="13">67 Hours of Clarity Reclaimed</text>
        <text x="358" y="226" fill="#94a3b8" font-family="sans-serif" font-size="11">Deep REM Sleep & Zero Hangovers</text>
      </svg>`),
  },
];

export const DEFAULT_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    circleId: 'eating',
    authorName: 'Maya Lin',
    authorHandle: '@maya_nourish',
    authorAvatarId: 'cloud-bunny',
    authorAuraColor: 'rose',
    authorBadge: '18 Days Sugar-Free',
    streakDays: 18,
    content:
      'Closing the kitchen at 8:30 PM with a mug of cinnamon rooibos tea completely changed my evenings. Here is my 30g protein breakfast plate + herbal tea setup that kept me sugar-free for 18 days straight!',
    routineShared: '8:30 PM Herbal Tea & Kitchen Close',
    imageUrl: PROGRESS_PHOTO_PRESETS[0].dataUrl,
    imageCaption: PROGRESS_PHOTO_PRESETS[0].caption,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    cheersCount: 34,
    cheeredByMe: false,
    comments: [
      {
        id: 'c-1',
        authorName: 'Samir K.',
        authorAvatarId: 'zen-capybara',
        authorAuraColor: 'teal',
        text: 'The herbal tea swap is magic! Peppermint tea + brushing teeth early saved me on day 4.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post-2',
    circleId: 'procrastination',
    authorName: 'Devon Brooks',
    authorHandle: '@devon_focus',
    authorAvatarId: 'focus-fox',
    authorAuraColor: 'amber',
    authorBadge: '24-Day Focus Streak',
    streakDays: 24,
    content:
      'Used the 2-Minute Micro-Entry Rule on a proposal I had been dreading for a week. Told myself I only had to write two sentences. Once I started, the anxiety vanished and I finished the whole draft in 40 minutes!',
    routineShared: 'The 2-Minute Micro-Entry Rule',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    cheersCount: 52,
    cheeredByMe: true,
    comments: [
      {
        id: 'c-2',
        authorName: 'Elena R.',
        authorAvatarId: 'starry-owl',
        authorAuraColor: 'indigo',
        text: 'Action always cures anxiety! Starting is 90% of the battle.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post-3',
    circleId: 'screen_time',
    authorName: 'Sora Takahashi',
    authorHandle: '@sora_unplugged',
    authorAvatarId: 'resilient-panda',
    authorAuraColor: 'indigo',
    authorBadge: '31 Days Doomscroll-Free',
    streakDays: 31,
    content:
      'Charging my phone in the hallway overnight + turning on Grayscale at 8 PM dropped my daily screen time from 4.5 hours down to 42 minutes. Sharing my evening reading setup!',
    routineShared: 'Out-of-Bedroom Charging Station',
    imageUrl: PROGRESS_PHOTO_PRESETS[2].dataUrl,
    imageCaption: PROGRESS_PHOTO_PRESETS[2].caption,
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    cheersCount: 68,
    cheeredByMe: false,
    comments: [],
  },
  {
    id: 'post-4',
    circleId: 'drinking',
    authorName: 'Liam O’Connor',
    authorHandle: '@liam_clearglass',
    authorAvatarId: 'hydration-otter',
    authorAuraColor: 'sky',
    authorBadge: '45 Days Alcohol-Free',
    streakDays: 45,
    content:
      'Survived a Friday night dinner party completely sober using the First-Drink Delay & Sparkling Bitters ritual. Woke up at 6:30 AM Saturday feeling like a superhero while everyone else was hungover.',
    routineShared: '5:00 PM Sparkling Bitters & Lime Ritual Swap',
    imageUrl: PROGRESS_PHOTO_PRESETS[3].dataUrl,
    imageCaption: PROGRESS_PHOTO_PRESETS[3].caption,
    timestamp: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    cheersCount: 89,
    cheeredByMe: true,
    comments: [],
  },
];

// Generate check-ins for the past 21 days for the seed habits
export function generateSeedCheckIns(): DailyCheckIn[] {
  const checkIns: DailyCheckIn[] = [];
  const today = new Date();

  for (let i = 0; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Eating tracker
    if (i <= 10 && i !== 4) {
      checkIns.push({
        id: `seed-eat-${dateStr}`,
        habitId: 'habit-eating',
        date: dateStr,
        completed: true,
        value: 1,
        loggedAt: d.toISOString(),
      });
    }

    // Drinking tracker
    if (i <= 15) {
      checkIns.push({
        id: `seed-drk-${dateStr}`,
        habitId: 'habit-drinking',
        date: dateStr,
        completed: true,
        loggedAt: d.toISOString(),
      });
    }

    // Procrastination tracker
    if (i <= 9 && i !== 2) {
      checkIns.push({
        id: `seed-prc-${dateStr}`,
        habitId: 'habit-procrastination',
        date: dateStr,
        completed: true,
        loggedAt: d.toISOString(),
      });
    }

    // Mindfulness
    if (i !== 3 && i !== 11) {
      checkIns.push({
        id: `seed-mind-${dateStr}`,
        habitId: 'habit-mindfulness',
        date: dateStr,
        completed: true,
        value: 10,
        loggedAt: d.toISOString(),
      });
    }

    // Hydration
    if (i !== 5) {
      checkIns.push({
        id: `seed-hydr-${dateStr}`,
        habitId: 'habit-hydration',
        date: dateStr,
        completed: true,
        value: i === 0 ? 6 : 8,
        loggedAt: d.toISOString(),
      });
    }

    // Nicotine Quit check-ins
    if (i <= 13) {
      checkIns.push({
        id: `seed-nic-${dateStr}`,
        habitId: 'habit-quit-nicotine',
        date: dateStr,
        completed: true,
        loggedAt: d.toISOString(),
      });
    }

    // Screen Time harm reduction
    if (i <= 18) {
      checkIns.push({
        id: `seed-scr-${dateStr}`,
        habitId: 'habit-screen-time',
        date: dateStr,
        completed: true,
        value: Math.max(25, 45 - Math.floor(i / 3)),
        loggedAt: d.toISOString(),
      });
    }
  }

  return checkIns;
}

export const DEFAULT_URGES: UrgeLog[] = [
  {
    id: 'urge-1',
    habitId: 'habit-quit-nicotine',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    intensity: 7,
    trigger: 'stress',
    surfedMinutes: 4,
    resisted: true,
    notes: 'Triggered right after a stressful work call. Did 4 rounds of box breathing and the craving evaporated.',
  },
  {
    id: 'urge-2',
    habitId: 'habit-eating',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    intensity: 6,
    trigger: 'fatigue',
    surfedMinutes: 5,
    resisted: true,
    notes: 'Wanted late-night ice cream at 10 PM. Brewed peppermint tea and did the 10-minute HALT pause instead.',
  },
  {
    id: 'urge-3',
    habitId: 'habit-screen-time',
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    intensity: 8,
    trigger: 'boredom',
    surfedMinutes: 5,
    resisted: true,
    notes: 'Laying in bed feeling restless. Put phone across the room and picked up my paperback book instead.',
  },
];

export function getHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      saveHabits(DEFAULT_HABITS);
      return DEFAULT_HABITS;
    }
    const parsed: Habit[] = JSON.parse(raw);
    // Ensure new default categories (Eating, Drinking, Procrastination) and routines are migrated into existing sessions
    let mutated = false;
    const existingIds = new Set(parsed.map(h => h.id));
    const merged = [...parsed];

    for (const def of DEFAULT_HABITS) {
      if (!existingIds.has(def.id)) {
        merged.unshift(def);
        mutated = true;
      } else {
        const idx = merged.findIndex(h => h.id === def.id);
        if (idx >= 0 && (!merged[idx].routines || merged[idx].routines.length === 0) && def.routines) {
          merged[idx] = {
            ...merged[idx],
            routines: def.routines,
            communityCircleId: merged[idx].communityCircleId || def.communityCircleId,
          };
          mutated = true;
        }
      }
    }

    if (mutated) {
      saveHabits(merged);
    }
    return merged;
  } catch {
    return DEFAULT_HABITS;
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveUserProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getCommunityPosts(): CommunityPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (!raw) {
      saveCommunityPosts(DEFAULT_COMMUNITY_POSTS);
      return DEFAULT_COMMUNITY_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_COMMUNITY_POSTS;
  }
}

export function saveCommunityPosts(posts: CommunityPost[]): void {
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
}

export function getCheckIns(): DailyCheckIn[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
    if (!raw) {
      const seeds = generateSeedCheckIns();
      saveCheckIns(seeds);
      return seeds;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCheckIns(checkIns: DailyCheckIn[]): void {
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
}

export function getUrgeLogs(): UrgeLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.URGE_LOGS);
    if (!raw) {
      saveUrgeLogs(DEFAULT_URGES);
      return DEFAULT_URGES;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUrgeLogs(urges: UrgeLog[]): void {
  localStorage.setItem(STORAGE_KEYS.URGE_LOGS, JSON.stringify(urges));
}

export function getCurrencySymbol(): string {
  return localStorage.getItem(STORAGE_KEYS.CURRENCY) || '$';
}

export function setCurrencySymbol(sym: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENCY, sym);
}

export function getAppearanceSettings(): AppearanceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPEARANCE);
    if (!raw) return DEFAULT_APPEARANCE;
    return { ...DEFAULT_APPEARANCE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function saveAppearanceSettings(settings: AppearanceSettings): void {
  localStorage.setItem(STORAGE_KEYS.APPEARANCE, JSON.stringify(settings));
  applyAppearanceToDOM(settings);
}

export function applyAppearanceToDOM(settings: AppearanceSettings): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.setAttribute('data-theme', settings.displayTheme);
  html.setAttribute('data-accent', settings.accentColor);
  html.setAttribute('data-text-size', settings.textSize);
  html.setAttribute('data-font-style', settings.fontStyle || 'clean');
  html.setAttribute('data-text-color', settings.textColor || 'default');

  const fontSizeMap: Record<AppearanceSettings['textSize'], string> = {
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  };
  html.style.fontSize = fontSizeMap[settings.textSize] || '16px';

  const brightness = typeof settings.brightnessLevel === 'number' ? settings.brightnessLevel : 100;
  const intensity = typeof settings.colorIntensity === 'number' ? settings.colorIntensity : 100;
  html.style.setProperty('--app-brightness', String(brightness / 100));
  html.style.setProperty('--app-saturate', String(intensity / 100));
}

// Check-in helper
export function toggleCheckIn(
  habitId: string,
  dateStr: string,
  value?: number,
  notes?: string
): DailyCheckIn[] {
  const checkIns = getCheckIns();
  const existingIdx = checkIns.findIndex(c => c.habitId === habitId && c.date === dateStr);

  let updated: DailyCheckIn[];
  if (existingIdx >= 0) {
    const existing = checkIns[existingIdx];
    if (value !== undefined) {
      // update value
      updated = [...checkIns];
      updated[existingIdx] = {
        ...existing,
        value,
        completed: value > 0,
        notes: notes ?? existing.notes,
        loggedAt: new Date().toISOString(),
      };
    } else {
      // toggle completion
      updated = [...checkIns];
      updated[existingIdx] = {
        ...existing,
        completed: !existing.completed,
        notes: notes ?? existing.notes,
        loggedAt: new Date().toISOString(),
      };
    }
  } else {
    // create new check-in
    const newCheckIn: DailyCheckIn = {
      id: `check-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      habitId,
      date: dateStr,
      completed: value !== undefined ? value > 0 : true,
      value,
      notes,
      loggedAt: new Date().toISOString(),
    };
    updated = [newCheckIn, ...checkIns];
  }

  saveCheckIns(updated);
  return updated;
}

// Streak & Consistency metrics calculation
export interface HabitStreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate30Days: number; // 0-100%
}

export function calculateHabitStats(habit: Habit, checkIns: DailyCheckIn[]): HabitStreakStats {
  const habitChecks = checkIns
    .filter(c => c.habitId === habit.id && c.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalCompletions = habitChecks.length;

  // Set of dates completed
  const completedDateSet = new Set(habitChecks.map(c => c.date));

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  let checkDate = new Date(today);

  // Check if today or yesterday was completed to keep streak alive
  if (completedDateSet.has(todayStr)) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (completedDateSet.has(yesterdayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    currentStreak = 0;
  }

  if (currentStreak > 0 || completedDateSet.has(yesterdayStr)) {
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (completedDateSet.has(dStr)) {
        if (!completedDateSet.has(todayStr) && currentStreak === 0) {
          currentStreak = 1;
        } else if (dStr !== todayStr) {
          currentStreak++;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across history
  const allDates = Array.from(completedDateSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of allDates) {
    const curDate = new Date(dStr + 'T00:00:00');
    if (prevDate) {
      const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (86400 * 1000));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = curDate;
  }

  // 30 days completion rate
  let last30DaysCompleted = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    if (completedDateSet.has(dStr)) {
      last30DaysCompleted++;
    }
  }
  const completionRate30Days = Math.round((last30DaysCompleted / 30) * 100);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalCompletions,
    completionRate30Days,
  };
}

// Addiction sobriety time breakdown helper
export interface CleanTimeBreakdown {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  moneySaved: number;
  hoursReclaimed: number;
}

export function getCleanTimeBreakdown(habit: Habit): CleanTimeBreakdown {
  if (habit.type !== 'quit' || !habit.quitDate) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      moneySaved: 0,
      hoursReclaimed: 0,
    };
  }

  const start = new Date(habit.quitDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - start);
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const dayFraction = diffMs / (86400 * 1000);
  const moneySaved = habit.dailyCostSaved ? Number((habit.dailyCostSaved * dayFraction).toFixed(2)) : 0;
  const hoursReclaimed = habit.dailyMinutesReclaimed
    ? Number(((habit.dailyMinutesReclaimed * dayFraction) / 60).toFixed(1))
    : 0;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    moneySaved,
    hoursReclaimed,
  };
}

// Export / Import helpers
export function exportAllData(): string {
  const data = {
    version: '1.2',
    exportedAt: new Date().toISOString(),
    habits: getHabits(),
    checkIns: getCheckIns(),
    urgeLogs: getUrgeLogs(),
    currency: getCurrencySymbol(),
    appearance: getAppearanceSettings(),
    profile: getUserProfile(),
    communityPosts: getCommunityPosts(),
    vitality: getUserVitalityState(),
    notes: getDocumentationNotes(),
    moodLogs: getDailyMoodLogs(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.habits)) {
      return { success: false, message: 'Invalid data format: missing habits array.' };
    }
    saveHabits(parsed.habits);
    if (Array.isArray(parsed.checkIns)) {
      saveCheckIns(parsed.checkIns);
    }
    if (Array.isArray(parsed.urgeLogs)) {
      saveUrgeLogs(parsed.urgeLogs);
    }
    if (parsed.currency) {
      setCurrencySymbol(parsed.currency);
    }
    if (parsed.appearance) {
      saveAppearanceSettings({ ...DEFAULT_APPEARANCE, ...parsed.appearance });
    }
    if (parsed.profile) {
      saveUserProfile({ ...DEFAULT_PROFILE, ...parsed.profile });
    }
    if (Array.isArray(parsed.communityPosts)) {
      saveCommunityPosts(parsed.communityPosts);
    }
    if (parsed.vitality) {
      saveUserVitalityState({ ...DEFAULT_VITALITY_STATE, ...parsed.vitality });
    }
    if (Array.isArray(parsed.notes)) {
      saveDocumentationNotes(parsed.notes);
    }
    if (Array.isArray(parsed.moodLogs)) {
      saveDailyMoodLogs(parsed.moodLogs);
    }
    return { success: true, message: 'Successfully imported all habits, notes, profile, and history!' };
  } catch (err: any) {
    return { success: false, message: `Failed to parse file: ${err?.message || 'Invalid JSON'}` };
  }
}

export function getUserSubscription(): UserSubscription {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) return DEFAULT_SUBSCRIPTION;
    return { ...DEFAULT_SUBSCRIPTION, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
}

export function saveUserSubscription(sub: UserSubscription): void {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
}

export const EXERCISE_PLANS: ExercisePlan[] = [
  {
    id: 'ex-longevity-strength',
    numberLabel: '01',
    title: 'Everyday Strength & Good Posture',
    subtitle: 'Simple full-body exercises to build strong muscles, healthy joints, and steady energy',
    level: 'All Levels · Easy to Follow',
    daysPerWeek: 4,
    sessionMinutes: 35,
    primaryGoal: 'Build tone, protect your back and knees, and feel stronger every day',
    overview:
      'Focuses on four natural movements—squatting, bending, pushing, and pulling—using body weight or light dumbbells at home or the gym.',
    weeklySchedule: [
      {
        dayLabel: 'Day 1 · Legs, Hips & Core',
        focus: 'Strong legs and a stable stomach and lower back',
        durationMinutes: 35,
        intensity: 'Moderate',
        movements: [
          {
            id: 'mov-goblet-squat',
            name: 'Slow Chest-Hold Squat (Goblet Squat)',
            Prescription: '3 sets × 10 reps · Rest 60s',
            focusCue: 'Lower down slowly for 3 seconds, keep your chest proud, and stand back up.',
            description:
              'Strengthens your thighs, hips, and stomach while teaching your knees and hips to bend smoothly and safely.',
            stepByStep: [
              'Stand with feet shoulder-width apart. Hold one weight (or water bottle) against your chest with both hands.',
              'Sit your hips down and back as if sitting into a chair, keeping your heels flat on the floor.',
              'Pause for 1 second at the bottom, then press through your whole foot to stand tall.',
            ],
            visualDirection: 'Hips lower straight down ↓ while chest stays upright ↑. Knees track in line with toes.',
            musclesWorked: 'Front Thighs, Glutes & Core',
            visualGuideType: 'squat',
            category: 'strength',
          },
          {
            id: 'mov-rdl',
            name: 'Hip Hinge Bend (Romanian Deadlift)',
            Prescription: '3 sets × 10 reps · Rest 60s',
            focusCue: 'Push your hips straight back like closing a car door with your bum.',
            description:
              'Protects your lower back and strengthens the back of your legs and hips after hours of sitting.',
            stepByStep: [
              'Stand tall holding weights in front of your thighs with a soft, slight bend in your knees.',
              'Push your hips straight backward while keeping your back flat, letting the weights slide down to mid-shin.',
              'Feel a gentle stretch in the back of your thighs, then squeeze your hips forward to stand tall.',
            ],
            visualDirection: 'Hips push backward ← while spine stays flat —, then hips drive forward → to stand.',
            musclesWorked: 'Hamstrings, Glutes & Lower Back',
            visualGuideType: 'hinge',
            category: 'strength',
          },
          {
            id: 'mov-split-squat',
            name: 'Step-Back Split Lunge',
            Prescription: '3 sets × 8 reps each leg · Rest 60s',
            focusCue: 'Keep most of your weight on your front heel and lower straight down.',
            description:
              'Improves balance and strengthens each leg one at a time so both sides of your body stay even.',
            stepByStep: [
              'Take a comfortable step backward with one foot, resting your back toes on the floor or a low step.',
              'Bend both knees to lower your back knee toward the floor while keeping your front knee over your ankle.',
              'Push firmly through your front foot to rise back to the starting position.',
            ],
            visualDirection: 'Staggered stance; body lowers straight down ↓ and rises straight up ↑ without leaning forward.',
            musclesWorked: 'Quads, Glutes & Balance Muscles',
            visualGuideType: 'lunge',
            category: 'strength',
          },
          {
            id: 'mov-plank-carry',
            name: 'One-Hand Weight Walk (Suitcase Carry)',
            Prescription: '3 rounds × 45 seconds walk each side',
            focusCue: 'Walk slowly and tall without letting the weight pull you sideways.',
            description:
              'Works your deep stomach muscles, grip, and shoulder stability simply by walking tall with a weight in one hand.',
            stepByStep: [
              'Pick up a weight in your right hand and let it hang naturally by your side.',
              'Pull your shoulders back and tighten your stomach so you stand completely straight.',
              'Walk slowly forward for 45 seconds, then switch the weight to your left hand and repeat.',
            ],
            visualDirection: 'Shoulders stay level — while walking forward →; resist leaning toward the weight.',
            musclesWorked: 'Side Core (Obliques), Grip & Shoulders',
            visualGuideType: 'carry',
            category: 'mobility',
          },
        ],
      },
      {
        dayLabel: 'Day 2 · Upper Body & Posture',
        focus: 'Strong shoulders, arms, and upper back to fix slouching',
        durationMinutes: 35,
        intensity: 'Moderate',
        movements: [
          {
            id: 'mov-pushup-press',
            name: 'Elevated Push-Ups or Dumbbell Chest Press',
            Prescription: '3 sets × 10 reps · Rest 60s',
            focusCue: 'Keep your body in a straight line from head to heels.',
            description:
              'Builds upper body pushing strength in your chest, shoulders, and the back of your arms.',
            stepByStep: [
              'Place hands slightly wider than shoulders on a bench, sturdy table, or the floor.',
              'Lower your chest smoothly toward your hands while keeping elbows tucked at a 45-degree angle.',
              'Push the floor away until your arms are straight.',
            ],
            visualDirection: 'Body forms a straight plank ╲; chest lowers ↓ toward hands and presses straight up ↑.',
            musclesWorked: 'Chest, Front Shoulders & Triceps',
            visualGuideType: 'push',
            category: 'strength',
          },
          {
            id: 'mov-row',
            name: 'One-Arm Supported Row',
            Prescription: '3 sets × 10 reps each side · Rest 60s',
            focusCue: 'Pull your elbow back toward your hip pocket and squeeze your shoulder blade.',
            description:
              'Strengthens your upper back and pulls rounded shoulders back into a healthy, upright posture.',
            stepByStep: [
              'Place your left hand and knee on a bench or chair so your back is flat like a tabletop.',
              'Hold a weight in your right hand hanging straight down.',
              'Pull your elbow up and back toward your hip, pause 1 second at the top, and lower slowly.',
            ],
            visualDirection: 'Flat back —; elbow pulls upward and backward ↗ toward hip, then lowers smoothly ↙.',
            musclesWorked: 'Upper Back (Lats & Rhomboids) & Biceps',
            visualGuideType: 'row',
            category: 'strength',
          },
          {
            id: 'mov-ohp',
            name: 'Kneeling Overhead Shoulder Press',
            Prescription: '3 sets × 9 reps each side · Rest 60s',
            focusCue: 'Press straight up until your arm is beside your ear without arching your back.',
            description:
              'Builds healthy overhead reach and strong shoulders while keeping your lower back safe.',
            stepByStep: [
              'Kneel on one knee with your other foot planted in front of you at a 90-degree angle.',
              'Hold a weight at shoulder height on the same side as your back knee.',
              'Press the weight straight overhead until your arm is straight, then lower with control.',
            ],
            visualDirection: 'Half-kneeling base; hand presses vertically ↑ overhead and lowers ↓ to shoulder.',
            musclesWorked: 'Shoulders, Triceps & Core',
            visualGuideType: 'press',
            category: 'strength',
          },
          {
            id: 'mov-facepull',
            name: 'Chest & Shoulder Opener Stretch',
            Prescription: '3 sets × 12 slow reps · Rest 45s',
            focusCue: 'Pull your thumbs backward and open your chest wide.',
            description:
              'Relieves tight neck and shoulder muscles caused by phones and computers.',
            stepByStep: [
              'Stand tall holding a light resistance band (or towel) in front of your chest with both hands.',
              'Keep your elbows slightly bent and pull your hands apart until the band touches your chest.',
              'Squeeze between your shoulder blades for 2 seconds, then slowly return.',
            ],
            visualDirection: 'Arms open wide outward ← → while shoulder blades squeeze together.',
            musclesWorked: 'Rear Shoulders & Upper Back Posture',
            visualGuideType: 'stretch',
            category: 'mobility',
          },
        ],
      },
      {
        dayLabel: 'Day 3 · Easy Cardio & Hip Stretch',
        focus: 'Heart health, fat burning, and loosening tight hips',
        durationMinutes: 30,
        intensity: 'Low',
        movements: [
          {
            id: 'mov-zone2-brisk',
            name: 'Brisk Walk, Bike, or Easy Jog',
            Prescription: '25 mins steady pace',
            focusCue: 'Go at a steady pace where you can still talk in full sentences.',
            description:
              'Builds heart endurance, clears stress hormones, and boosts mood without leaving you exhausted.',
            stepByStep: [
              'Step outside or hop on a bike/treadmill and start with 3 minutes of easy walking.',
              'Pick up the pace until you are breathing deeper but can still breathe comfortably through your nose.',
              'Keep that steady rhythm for 25 minutes while swinging your arms naturally.',
            ],
            visualDirection: 'Tall posture ↑, steady forward stride →, relaxed shoulders.',
            musclesWorked: 'Heart, Lungs & Full Lower Body',
            visualGuideType: 'walk',
            category: 'cardio',
          },
          {
            id: 'mov-world-greatest',
            name: 'Seated 90/90 Hip & Back Twist',
            Prescription: '5 mins gentle stretching',
            focusCue: 'Breathe out slowly as you rotate your knees from side to side.',
            description:
              'Unlocks stiff hips and lower back tension so walking and squatting feel effortless.',
            stepByStep: [
              'Sit on the floor with knees bent wide in front of you and heels on the ground.',
              'Slowly let both knees drop to the right side until they form two 90-degree angles.',
              'Sit tall, take a deep breath, and smoothly rotate both knees over to the left side.',
            ],
            visualDirection: 'Seated tall; knees sweep smoothly side-to-side ↺ ↻ while spine stays long.',
            musclesWorked: 'Hips, Pelvis & Mid-Back',
            visualGuideType: 'stretch',
            category: 'mobility',
          },
        ],
      },
      {
        dayLabel: 'Day 4 · Full-Body Energy Session',
        focus: 'Total body movement, grip strength, and spine stretch',
        durationMinutes: 32,
        intensity: 'High',
        movements: [
          {
            id: 'mov-kb-swing',
            name: 'Two-Hand Dumbbell or Kettlebell Swing',
            Prescription: '4 sets × 15 reps · Rest 60s',
            focusCue: 'Snap your hips forward to float the weight up—do not lift with your lower back.',
            description:
              'Gets your heart pumping and builds power in your hips, glutes, and core in just a few minutes.',
            stepByStep: [
              'Stand with feet slightly wider than shoulders, holding one weight with both hands between your legs.',
              'Hinge your hips back slightly, then quickly squeeze your glutes to stand tall and let the weight swing up to chest height.',
              'Control the weight as it swings back between your legs for the next rep.',
            ],
            visualDirection: 'Hips hinge back ← then snap forward →, swinging weight in a smooth arc ⌒ to chest height.',
            musclesWorked: 'Glutes, Hamstrings, Core & Heart',
            visualGuideType: 'hinge',
            category: 'cardio',
          },
          {
            id: 'mov-stepup',
            name: 'Step-Ups onto Bench or Sturdy Stair',
            Prescription: '3 sets × 10 reps each leg · Rest 60s',
            focusCue: 'Press through your top foot to stand all the way up.',
            description:
              'Builds strong, practical leg power for climbing stairs and hiking without knee pain.',
            stepByStep: [
              'Stand facing a sturdy step, box, or low bench and place your whole right foot flat on top.',
              'Lean slightly forward and push through your right heel to bring your body all the way up.',
              'Step back down slowly with control and repeat on both legs.',
            ],
            visualDirection: 'One foot plants on box; body drives vertically ↑ to full stand and lowers slowly ↓.',
            musclesWorked: 'Thighs, Glutes & Calves',
            visualGuideType: 'lunge',
            category: 'strength',
          },
          {
            id: 'mov-pull-hang',
            name: 'Bar Hang or Doorframe Stretch',
            Prescription: '3 sets × 30–40 seconds · Rest 45s',
            focusCue: 'Let your ribs and lower back gently lengthen as you breathe.',
            description:
              'Stretches out your spine, opens tight shoulders, and builds hand and forearm strength.',
            stepByStep: [
              'Grip an overhead pull-up bar (or hold the sides of a sturdy doorframe and lean back).',
              'Let your body weight gently stretch your shoulders and back while keeping feet lightly supported if needed.',
              'Take 5 slow, deep breaths before stepping down.',
            ],
            visualDirection: 'Arms reach overhead ↑ while spine and hips gently lengthen downward ↓.',
            musclesWorked: 'Grip, Shoulders & Spine Decompression',
            visualGuideType: 'hang',
            category: 'recovery',
          },
        ],
      },
    ],
    routineStepsForHabit: [
      {
        title: '5-Minute Joint Warmup',
        timing: 'Before Exercise',
        description: 'Roll your shoulders, circle your hips, and take 10 slow deep breaths.',
      },
      {
        title: '30-Minute Main Workout',
        timing: 'Main Session',
        description: 'Complete today’s 3–4 exercises with smooth, controlled form.',
      },
      {
        title: '3-Minute Cool-Down Stretch',
        timing: 'After Exercise',
        description: 'Stretch your chest and hips and drink a full glass of water.',
      },
    ],
  },
  {
    id: 'ex-cardio-vo2',
    numberLabel: '02',
    title: 'Heart Health & Stamina Plan',
    subtitle: 'Easy walks, intervals, and outdoor movement for better energy and deeper sleep',
    level: 'Beginner to Advanced',
    daysPerWeek: 5,
    sessionMinutes: 30,
    primaryGoal: 'Boost heart health, melt away stress cravings, and sleep deeply at night',
    overview:
      'Combines four easy, enjoyable cardio days with one faster interval day each week so you build stamina without feeling burnt out.',
    weeklySchedule: [
      {
        dayLabel: 'Session 1 · Steady Fat-Burn Walk or Jog',
        focus: 'Build all-day stamina and clear your mind',
        durationMinutes: 30,
        intensity: 'Low',
        movements: [
          {
            id: 'mov-z2-steady',
            name: 'Steady Brisk Walk, Jog, or Cycle',
            Prescription: '25 mins steady pace',
            focusCue: 'Keep a comfortable pace where you can breathe calmly through your nose.',
            description:
              'Trains your heart and muscles to burn fat for energy and lowers daily stress levels.',
            stepByStep: [
              'Start with 3 minutes of easy strolling to warm up your ankles and knees.',
              'Increase to a brisk, purposeful walk or light jog for 20–25 minutes.',
              'Keep your chin level and swing your arms naturally at your sides.',
            ],
            visualDirection: 'Upright posture ↑, smooth rhythmic stride →, steady nasal breathing.',
            musclesWorked: 'Heart, Lungs & Legs',
            visualGuideType: 'walk',
            category: 'cardio',
          },
          {
            id: 'mov-calf-ankle',
            name: 'Heel Raises & Ankle Circles',
            Prescription: '2 sets × 15 reps · 4 mins',
            focusCue: 'Rise all the way up onto the balls of your feet, then lower slowly.',
            description:
              'Pumps fresh blood flow through your lower legs and keeps ankles and calves strong.',
            stepByStep: [
              'Stand tall near a wall or chair for light balance support.',
              'Lift both heels high off the floor onto your tiptoes and hold for 1 second.',
              'Lower your heels slowly back to the ground.',
            ],
            visualDirection: 'Heels lift straight up ↑ onto toes and lower smoothly ↓ to floor.',
            musclesWorked: 'Calves & Ankles',
            visualGuideType: 'squat',
            category: 'mobility',
          },
        ],
      },
      {
        dayLabel: 'Session 2 · 4×4 Stamina Intervals',
        focus: 'Boost heart power and release feel-good endorphins',
        durationMinutes: 30,
        intensity: 'High',
        movements: [
          {
            id: 'mov-warmup-jog',
            name: 'Easy Warmup Walk or Light Jog',
            Prescription: '5 mins easy pace',
            focusCue: 'Start gentle and let your body warm up naturally.',
            description:
              'Gets your heart, lungs, and leg muscles warm and ready for faster movement.',
            stepByStep: [
              'Walk briskly or jog lightly for 5 minutes.',
              'Roll your shoulders back and shake out any tension in your hands.',
              'Take deep breaths in through your nose and out through your mouth.',
            ],
            visualDirection: 'Relaxed forward movement → with gradually increasing pace.',
            musclesWorked: 'Heart & Full Body Warmup',
            visualGuideType: 'walk',
            category: 'cardio',
          },
          {
            id: 'mov-4x4-interval',
            name: '4 Rounds: 4 Mins Fast Pace + 3 Mins Easy Walk',
            Prescription: '4 rounds total · 25 mins',
            focusCue: 'Move briskly for 4 minutes (fast walk uphill, jog, or bike), then stroll easily for 3 minutes.',
            description:
              'One of the most proven workouts to keep your heart young and boost daily energy.',
            stepByStep: [
              'Go at a fast, challenging pace for 4 minutes where breathing feels noticeably hard.',
              'Slow down to an easy, relaxed stroll for 3 minutes to catch your breath completely.',
              'Repeat this 4-minute fast / 3-minute easy cycle 4 times total.',
            ],
            visualDirection: 'Alternate 4 mins brisk drive ⇒ with 3 mins easy recovery walk →.',
            musclesWorked: 'Heart Capacity, Lungs & Legs',
            visualGuideType: 'walk',
            category: 'cardio',
          },
        ],
      },
      {
        dayLabel: 'Session 3 · Sunshine Walk & Hip Stretch',
        focus: 'Calm your mind and release desk stiffness',
        durationMinutes: 25,
        intensity: 'Low',
        movements: [
          {
            id: 'mov-sunlight-walk',
            name: 'Phone-Free Outdoor Walk',
            Prescription: '20 mins relaxed pace',
            focusCue: 'Leave your phone in your pocket and look far ahead at trees or the sky.',
            description:
              'Natural daylight and looking at distant objects calms brain stress and stops cravings in their tracks.',
            stepByStep: [
              'Step outside into natural daylight without looking at a screen.',
              'Walk at a comfortable, unhurried pace for 20 minutes.',
              'Let your eyes look far ahead into the distance to relax eye and neck strain.',
            ],
            visualDirection: 'Eyes look toward horizon →, shoulders relaxed ↓, easy natural stride.',
            musclesWorked: 'Nervous System Calm & Gentle Circulation',
            visualGuideType: 'walk',
            category: 'recovery',
          },
          {
            id: 'mov-hip-flexor',
            name: 'Kneeling Hip & Thigh Stretch',
            Prescription: '2 mins each side',
            focusCue: 'Gently tuck your tailbone under until you feel a stretch down the front of your hip.',
            description:
              'Opens up tight front hip muscles that shorten when we sit in chairs all day.',
            stepByStep: [
              'Kneel on your right knee (put a pillow or folded towel under your knee) with your left foot in front.',
              'Sit tall and gently shift your hips forward just an inch until your right hip feels a nice stretch.',
              'Hold and breathe slowly for 90–120 seconds, then switch legs.',
            ],
            visualDirection: 'Half-kneeling pose; hips shift gently forward → while torso stays tall ↑.',
            musclesWorked: 'Hip Flexors & Front Thighs',
            visualGuideType: 'lunge',
            category: 'mobility',
          },
        ],
      },
    ],
    routineStepsForHabit: [
      {
        title: '15-Minute Morning Daylight Walk',
        timing: 'Morning',
        description: 'Step outside for fresh air and daylight before scrolling on your phone.',
      },
      {
        title: '25-Minute Afternoon Cardio Session',
        timing: 'Afternoon',
        description: 'Beats the afternoon tired slump and stops snack or vape cravings.',
      },
    ],
  },
  {
    id: 'ex-dopamine-reset',
    numberLabel: '03',
    title: 'Gentle Daily Stretch & Craving Reset',
    subtitle: 'Easy 20-minute home movements to relax stress, fix desk posture, and calm cravings',
    level: 'Beginner Friendly · No Equipment Needed',
    daysPerWeek: 7,
    sessionMinutes: 20,
    primaryGoal: 'Calm stress, loosen stiff joints, and replace cravings with healthy movement',
    overview:
      'Perfect for anyone quitting sugar, alcohol, smoking, or screen-time who wants gentle daily movement without heavy gym workouts.',
    weeklySchedule: [
      {
        dayLabel: 'Daily Routine · Morning Wake-Up & Evening Relax',
        focus: 'Loosen stiff joints, wake up your body, and wind down for sleep',
        durationMinutes: 20,
        intensity: 'Low',
        movements: [
          {
            id: 'mov-cars',
            name: 'Full-Body Joint Circles (Neck, Shoulders & Hips)',
            Prescription: '5 mins slow circles',
            focusCue: 'Move slowly and smoothly—never force a joint past where it feels comfortable.',
            description:
              'Lubricates stiff joints first thing in the morning or after sitting at a desk.',
            stepByStep: [
              'Stand tall and make 5 slow, gentle circles with your head and neck in each direction.',
              'Roll your shoulders forward, up, back, and down 8 times.',
              'Place hands on your hips and make 8 wide, smooth hip circles each way.',
            ],
            visualDirection: 'Slow circular motion ↻ ↺ through neck, shoulders, and hips.',
            musclesWorked: 'Neck, Shoulders, Spine & Hips',
            visualGuideType: 'stretch',
            category: 'mobility',
          },
          {
            id: 'mov-air-squat-flow',
            name: 'Easy Bodyweight Squats & Wall Push-Ups',
            Prescription: '3 rounds × 10 squats + 10 wall/counter push-ups',
            focusCue: 'Breathe in on the way down, breathe out on the way up.',
            description:
              'Gets warm blood flowing to your legs and upper body in less than 8 minutes with zero equipment.',
            stepByStep: [
              'Stand with feet shoulder-width apart and do 10 smooth bodyweight squats to chair height.',
              'Place hands on a kitchen counter, desk, or floor and do 10 smooth push-ups.',
              'Rest 45 seconds and repeat for 3 easy rounds.',
            ],
            visualDirection: 'Smooth squats ↓ ↑ followed by incline push-ups ↙ ↗.',
            musclesWorked: 'Legs, Chest, Arms & Core',
            visualGuideType: 'squat',
            category: 'strength',
          },
          {
            id: 'mov-legs-up-wall',
            name: 'Legs-Up-The-Wall Evening Relax',
            Prescription: '7 mins before bed',
            focusCue: 'Let your shoulders sink into the floor and breathe out slowly.',
            description:
              'Drains tired fluid from your legs, slows your heart rate, and quiets late-night snacking or scrolling urges.',
            stepByStep: [
              'Lie on your back on a rug or bed and rest both legs straight up against the wall.',
              'Place your hands on your belly or resting comfortably by your sides.',
              'Breathe in for 4 seconds and breathe out slowly for 6 seconds for 5–7 minutes.',
            ],
            visualDirection: 'Back rests flat on floor — while legs rest vertically up wall ↑.',
            musclesWorked: 'Lower Back Relief, Leg Circulation & Deep Calm',
            visualGuideType: 'hang',
            category: 'recovery',
          },
        ],
      },
    ],
    routineStepsForHabit: [
      {
        title: '5-Minute Morning Stretch & Glass of Water',
        timing: 'Morning',
        description: 'Roll your shoulders and hips right after waking up.',
      },
      {
        title: '10-Minute Walk After Lunch or Dinner',
        timing: 'After Meals',
        description: 'Helps digestion, steadies blood sugar, and clears your head.',
      },
      {
        title: '7-Minute Legs-Up-The-Wall Wind-Down',
        timing: 'Before Bed',
        description: 'Relaxes your body for deep, restful sleep.',
      },
    ],
  },
];

export const EATING_PLANS: EatingPlan[] = [
  {
    id: 'eat-mediterranean-longevity',
    numberLabel: '01',
    title: 'Fresh Mediterranean Whole-Food Plan',
    subtitle: 'Simple meals with olive oil, fish, chicken, eggs, beans, and fresh vegetables',
    philosophy: 'Real, everyday whole foods that keep you full and energized—no strict dieting or complicated recipes.',
    dailyCalories: 2100,
    macroSplit: { proteinGrams: 138, carbsGrams: 185, fatsGrams: 84, fiberGrams: 40 },
    hydrationTargetLiters: 2.8,
    eatingWindow: '8:00 AM – 7:30 PM',
    meals: [
      {
        id: 'meal-med-1',
        slotLabel: '8:00 AM · Breakfast',
        name: 'Eggs, Avocado & Toast with Greens',
        description:
          '3 cooked eggs over a handful of greens, half an avocado, cherry tomatoes, a drizzle of olive oil, and 1 slice of sourdough toast.',
        prepMinutes: 10,
        calories: 540,
        proteinGrams: 32,
        carbsGrams: 34,
        fatsGrams: 30,
        fiberGrams: 9,
        keyIngredients: ['Eggs', 'Spinach or arugula', 'Avocado', 'Olive oil', 'Sourdough bread'],
      },
      {
        id: 'meal-med-2',
        slotLabel: '12:45 PM · Lunch',
        name: 'Grilled Lemon Chicken, Chickpea & Quinoa Bowl',
        description:
          'Sliced grilled chicken breast over cooked quinoa or rice, chickpeas, diced cucumber, tomatoes, feta cheese, and lemon-olive oil dressing.',
        prepMinutes: 15,
        calories: 680,
        proteinGrams: 52,
        carbsGrams: 58,
        fatsGrams: 24,
        fiberGrams: 14,
        keyIngredients: ['Chicken breast', 'Chickpeas', 'Quinoa or brown rice', 'Cucumber & tomato', 'Lemon & olive oil'],
      },
      {
        id: 'meal-med-3',
        slotLabel: '4:00 PM · Afternoon Snack',
        name: 'Greek Yogurt with Berries & Walnuts',
        description:
          '1 bowl of plain Greek yogurt topped with a handful of walnuts, fresh or frozen blueberries, and a sprinkle of cinnamon.',
        prepMinutes: 4,
        calories: 310,
        proteinGrams: 22,
        carbsGrams: 24,
        fatsGrams: 14,
        fiberGrams: 6,
        keyIngredients: ['Plain Greek yogurt', 'Walnuts', 'Blueberries', 'Cinnamon'],
      },
      {
        id: 'meal-med-4',
        slotLabel: '7:00 PM · Dinner',
        name: 'Baked Salmon, Broccoli & Baby Potatoes',
        description:
          'Oven-baked salmon fillet with roasted broccoli and baby potatoes tossed in olive oil, garlic, and herbs.',
        prepMinutes: 20,
        calories: 570,
        proteinGrams: 42,
        carbsGrams: 49,
        fatsGrams: 22,
        fiberGrams: 11,
        keyIngredients: ['Salmon fillet', 'Broccoli', 'Baby potatoes', 'Garlic & olive oil'],
      },
    ],
    stapleGroceryList: [
      {
        category: 'Proteins',
        items: ['Salmon fillets', 'Eggs (1–2 dozen)', 'Chicken breast', 'Plain Greek yogurt'],
      },
      {
        category: 'Fruits & Vegetables',
        items: ['Spinach & salad greens', 'Broccoli', 'Avocados (4)', 'Blueberries', 'Lemons, cucumbers & tomatoes'],
      },
      {
        category: 'Pantry & Healthy Carbs',
        items: ['Extra-virgin olive oil', 'Canned chickpeas', 'Quinoa or brown rice', 'Walnuts', 'Baby potatoes & sourdough bread'],
      },
    ],
    routineStepsForHabit: [
      {
        title: 'Eat a High-Protein Breakfast',
        timing: 'Morning',
        description: 'Keeps you full all morning and stops mid-day sugar cravings.',
      },
      {
        title: 'Include Greens or Veggies at Lunch & Dinner',
        timing: 'Lunch & Dinner',
        description: 'Fill half your plate with colorful vegetables for fiber and vitamins.',
      },
      {
        title: 'Finish Dinner 2–3 Hours Before Bed',
        timing: 'Evening',
        description: 'Switch to water or herbal tea after dinner so you sleep better.',
      },
    ],
  },
  {
    id: 'eat-glycemic-craving-shield',
    numberLabel: '02',
    title: 'Steady Energy & Craving-Free Plan',
    subtitle: 'High-protein, low-sugar meals that stop afternoon crashes and late-night snacking',
    philosophy: 'When your blood sugar stays steady, cravings for sweets, junk food, and alcohol naturally fade away.',
    dailyCalories: 1950,
    macroSplit: { proteinGrams: 152, carbsGrams: 130, fatsGrams: 88, fiberGrams: 36 },
    hydrationTargetLiters: 3.0,
    eatingWindow: '8:30 AM – 7:00 PM',
    meals: [
      {
        id: 'meal-gly-1',
        slotLabel: '8:30 AM · Breakfast',
        name: 'Scrambled Eggs, Smoked Salmon & Cucumber Plate',
        description:
          '3 scrambled eggs with smoked salmon (or turkey bacon), sliced cucumber, avocado, and 1 seeded cracker or toast.',
        prepMinutes: 8,
        calories: 510,
        proteinGrams: 40,
        carbsGrams: 16,
        fatsGrams: 31,
        fiberGrams: 7,
        keyIngredients: ['Eggs', 'Smoked salmon or turkey', 'Cucumber', 'Seeded crackers'],
      },
      {
        id: 'meal-gly-2',
        slotLabel: '1:00 PM · Lunch',
        name: 'Lean Beef or Turkey Burrito Salad Bowl',
        description:
          'Cooked lean ground beef or turkey over chopped romaine lettuce, black beans, salsa, pumpkin seeds, and guacamole.',
        prepMinutes: 15,
        calories: 640,
        proteinGrams: 50,
        carbsGrams: 38,
        fatsGrams: 30,
        fiberGrams: 13,
        keyIngredients: ['Lean ground beef or turkey', 'Black beans', 'Avocado guacamole', 'Romaine lettuce & salsa'],
      },
      {
        id: 'meal-gly-3',
        slotLabel: '4:15 PM · Afternoon Snack',
        name: 'Cottage Cheese (or Protein Shake) with Raspberries & Almonds',
        description:
          '1 cup cottage cheese or a simple protein shake with fresh raspberries and a small handful of almonds.',
        prepMinutes: 3,
        calories: 320,
        proteinGrams: 28,
        carbsGrams: 18,
        fatsGrams: 15,
        fiberGrams: 6,
        keyIngredients: ['Cottage cheese or protein powder', 'Raspberries', 'Almonds'],
      },
      {
        id: 'meal-gly-4',
        slotLabel: '6:45 PM · Dinner',
        name: 'Baked White Fish (or Chicken), Sweet Potato & Asparagus',
        description:
          'Oven-baked cod, halibut, or chicken breast with roasted asparagus spears and a baked sweet potato with a little butter.',
        prepMinutes: 20,
        calories: 480,
        proteinGrams: 38,
        carbsGrams: 42,
        fatsGrams: 16,
        fiberGrams: 10,
        keyIngredients: ['White fish or chicken', 'Asparagus', 'Sweet potato', 'Butter or olive oil'],
      },
    ],
    stapleGroceryList: [
      {
        category: 'Proteins',
        items: ['Lean ground beef or turkey', 'White fish or chicken', 'Eggs', 'Cottage cheese'],
      },
      {
        category: 'Fresh Produce',
        items: ['Raspberries & berries', 'Asparagus', 'Sweet potatoes', 'Romaine lettuce, avocados & limes'],
      },
      {
        category: 'Healthy Snacks & Pantry',
        items: ['Almonds & pumpkin seeds', 'Canned black beans', 'Fresh salsa', 'Sparkling water'],
      },
    ],
    routineStepsForHabit: [
      {
        title: 'Have Your 4 PM Protein Snack',
        timing: '4:00 PM',
        description: 'So you never arrive at dinner starving or tempted by fast food.',
      },
      {
        title: 'Drink Sparkling Water with Lime Before Dinner',
        timing: '6:30 PM',
        description: 'A refreshing evening drink ritual that replaces soda or alcohol.',
      },
    ],
  },
  {
    id: 'eat-plant-microbiome',
    numberLabel: '03',
    title: 'Plant-Rich Gut & Mood Plan',
    subtitle: 'Colorful plant meals, beans, oats, nuts, and greens for light digestion and happy mood',
    philosophy: 'Eating a wide variety of colorful plants, beans, and seeds feeds a healthy gut and boosts natural energy.',
    dailyCalories: 2050,
    macroSplit: { proteinGrams: 118, carbsGrams: 215, fatsGrams: 76, fiberGrams: 48 },
    hydrationTargetLiters: 2.8,
    eatingWindow: '8:00 AM – 7:30 PM',
    meals: [
      {
        id: 'meal-plant-1',
        slotLabel: '8:00 AM · Breakfast',
        name: 'Warm Oatmeal with Almond Butter, Seeds & Berries',
        description:
          'Rolled or steel-cut oats cooked with hemp seeds, a spoon of almond or peanut butter, protein scoop, and warm berries.',
        prepMinutes: 10,
        calories: 530,
        proteinGrams: 30,
        carbsGrams: 56,
        fatsGrams: 21,
        fiberGrams: 13,
        keyIngredients: ['Oats', 'Hemp or chia seeds', 'Almond or peanut butter', 'Mixed berries'],
      },
      {
        id: 'meal-plant-2',
        slotLabel: '12:30 PM · Lunch',
        name: 'Crispy Tofu or Tempeh, Lentil & Avocado Greens Bowl',
        description:
          'Pan-seared tofu or tempeh cubes over cooked lentils, chopped kale, shredded carrots, and avocado with sesame dressing.',
        prepMinutes: 15,
        calories: 620,
        proteinGrams: 38,
        carbsGrams: 64,
        fatsGrams: 24,
        fiberGrams: 16,
        keyIngredients: ['Tofu or tempeh', 'Cooked lentils', 'Kale & carrots', 'Avocado'],
      },
      {
        id: 'meal-plant-3',
        slotLabel: '3:45 PM · Afternoon Snack',
        name: 'Steamed Edamame Pods, Nuts & Green Tea',
        description:
          'A bowl of warm steamed edamame pods with a pinch of sea salt, a few mixed nuts, and green or herbal tea.',
        prepMinutes: 5,
        calories: 290,
        proteinGrams: 18,
        carbsGrams: 20,
        fatsGrams: 14,
        fiberGrams: 7,
        keyIngredients: ['Frozen edamame pods', 'Mixed nuts', 'Green tea'],
      },
      {
        id: 'meal-plant-4',
        slotLabel: '7:00 PM · Dinner',
        name: 'Warm Chickpea, Spinach & Sweet Potato Coconut Curry',
        description:
          'Chickpeas, diced sweet potato, and tofu simmered in mild curry spices and light coconut milk with spinach over brown rice.',
        prepMinutes: 20,
        calories: 610,
        proteinGrams: 32,
        carbsGrams: 75,
        fatsGrams: 17,
        fiberGrams: 12,
        keyIngredients: ['Chickpeas & tofu', 'Spinach & sweet potato', 'Light coconut milk', 'Brown rice'],
      },
    ],
    stapleGroceryList: [
      {
        category: 'Plant Proteins',
        items: ['Firm tofu & tempeh', 'Frozen edamame pods', 'Hemp seeds & almond butter', 'Lentils & chickpeas'],
      },
      {
        category: 'Grains & Pantry',
        items: ['Rolled oats', 'Brown rice', 'Light coconut milk', 'Olive & sesame oil'],
      },
      {
        category: 'Fruits & Veggies',
        items: ['Baby spinach & kale', 'Sweet potatoes & carrots', 'Avocados', 'Mixed berries'],
      },
    ],
    routineStepsForHabit: [
      {
        title: 'Eat 5 Different Colors of Fruits & Veggies Today',
        timing: 'All Day',
        description: 'Mix greens, berries, orange veggies, beans, and nuts across your meals.',
      },
      {
        title: 'Drink 8 Glasses of Water Today',
        timing: 'All Day',
        description: 'Keeps digestion smooth and energy high.',
      },
    ],
  },
];

export const DEFAULT_VITALITY_STATE: UserVitalityState = {
  activeExercisePlanId: EXERCISE_PLANS[0].id,
  activeEatingPlanId: EATING_PLANS[0].id,
  completedMovementsByDate: {},
  completedMealsByDate: {},
  waterGlassesByDate: {},
  checkedGroceryItems: [],
};

export function getUserVitalityState(): UserVitalityState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VITALITY);
    if (!raw) return DEFAULT_VITALITY_STATE;
    return { ...DEFAULT_VITALITY_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_VITALITY_STATE;
  }
}

export function saveUserVitalityState(state: UserVitalityState): void {
  localStorage.setItem(STORAGE_KEYS.VITALITY, JSON.stringify(state));
}

export const DEFAULT_DOCUMENTATION_NOTES: DocumentationNote[] = [
  {
    id: 'note-why-pledge',
    title: 'My Personal Why & Daily Pledge',
    content:
      'I am building a calmer, stronger life one day at a time. When I skip late-night sugar, alcohol, and endless phone scrolling, I wake up at 7:00 AM with a clear head, steady energy, and pride in myself.',
    category: 'milestone_win',
    mood: 'great',
    tags: ['my-why', 'morning-clarity', 'pledge'],
    pinned: true,
    actionSteps: [
      'Drink 1 full glass of water right after waking up',
      'Eat 30g of protein at breakfast to keep blood sugar steady',
      'Put phone on the dresser across the room by 10:00 PM',
    ],
    createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: 'note-craving-pattern',
    title: 'What Triggers My 9:00 PM Snack & Scroll Urges',
    content:
      'Noticed that my strongest cravings happen between 8:30 PM and 10:00 PM when I am tired on the couch after work. It is not real hunger—it is just brain fatigue looking for a quick comfort hit.',
    category: 'craving_trigger',
    linkedHabitId: 'habit-sugar-binge',
    mood: 'good',
    tags: ['evening-trigger', 'sugar-free', 'screen-time'],
    pinned: true,
    actionSteps: [
      'Brew peppermint or chamomile tea at 8:30 PM',
      'Brush teeth right after tea so the kitchen is officially closed',
      'Do 5 minutes of Legs-Up-The-Wall stretch before bed',
    ],
    createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
  },
  {
    id: 'note-workout-log',
    title: 'Week 2 Exercise & Meal Check-In Notes',
    content:
      'Completed Day 1 (Legs & Core) and Day 2 (Upper Body & Posture) from the Everyday Strength plan. My lower back feels much looser from the Hip Hinge Bend, and the 30g protein breakfast completely stopped my afternoon slump.',
    category: 'workout_meal',
    mood: 'great',
    tags: ['workout-log', 'posture', 'protein-meals'],
    pinned: false,
    actionSteps: [
      'Keep slow 3-second lowering pace on Goblet Squats',
      'Prep overnight oats and berries on Sunday evening',
    ],
    createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getDocumentationNotes(): DocumentationNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEFAULT_DOCUMENTATION_NOTES));
      return DEFAULT_DOCUMENTATION_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DOCUMENTATION_NOTES;
  }
}

export function saveDocumentationNotes(notes: DocumentationNote[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getDailyMoodLogs(): DailyMoodLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOOD_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDailyMoodLogs(logs: DailyMoodLog[]): void {
  localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(logs));
}

export function getAIChatHistory(): AIChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CHAT);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAIChatHistory(messages: AIChatMessage[]): void {
  localStorage.setItem(STORAGE_KEYS.AI_CHAT, JSON.stringify(messages));
}

export const DEFAULT_DM_CONVERSATIONS: DMConversation[] = [
  {
    id: 'dm-maya',
    peerName: 'Maya Lin',
    peerHandle: '@maya_nourish',
    peerAvatarId: 'cloud-bunny',
    peerAuraColor: 'rose',
    peerBadge: '18 Days Sugar-Free',
    peerCircleId: 'eating',
    peerOnline: true,
    unreadCount: 1,
    messages: [
      {
        id: 'm-1',
        senderHandle: '@maya_nourish',
        senderName: 'Maya Lin',
        text: 'Hey Alex! Saw you in the Mindful Eating group. How is the 8:30 PM herbal tea kitchen close working for you this week?',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'dm-devon',
    peerName: 'Devon Brooks',
    peerHandle: '@devon_focus',
    peerAvatarId: 'focus-fox',
    peerAuraColor: 'amber',
    peerBadge: '24-Day Focus Streak',
    peerCircleId: 'procrastination',
    peerOnline: true,
    unreadCount: 0,
    messages: [
      {
        id: 'm-2',
        senderHandle: '@me',
        senderName: 'Alex Rivera',
        text: 'Your 2-minute rule post inspired me to tackle my morning work block today!',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      },
      {
        id: 'm-3',
        senderHandle: '@devon_focus',
        senderName: 'Devon Brooks',
        text: 'That is awesome! Ping me anytime you want to run a 25-minute accountability sprint together.',
        timestamp: new Date(Date.now() - 17 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'dm-liam',
    peerName: 'Liam O’Connor',
    peerHandle: '@liam_clearglass',
    peerAvatarId: 'hydration-otter',
    peerAuraColor: 'sky',
    peerBadge: '45 Days Alcohol-Free',
    peerCircleId: 'drinking',
    peerOnline: false,
    unreadCount: 0,
    messages: [
      {
        id: 'm-4',
        senderHandle: '@liam_clearglass',
        senderName: 'Liam O’Connor',
        text: 'Welcome to Clear Glass! Sparkling water with lime and bitters at 5 PM makes weekends so much easier.',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

export function getDMConversations(): DMConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DM_CONVERSATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DM_CONVERSATIONS, JSON.stringify(DEFAULT_DM_CONVERSATIONS));
      return DEFAULT_DM_CONVERSATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DM_CONVERSATIONS;
  }
}

export function saveDMConversations(conversations: DMConversation[]): void {
  localStorage.setItem(STORAGE_KEYS.DM_CONVERSATIONS, JSON.stringify(conversations));
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  receiveFeatureUpdateEmails: true,
  receiveWeeklyDigestEmails: true,
  emailAddress: 'alex.rivera@example.com',
  phoneNumber: '+1 (555) 234-8910',
  notificationsEnabled: true,
  emailAlertsEnabled: true,
  textSmsAlertsEnabled: true,
  systemPopupsEnabled: true,
  overrideAppScreens: true,
  screenOverrideDurationSeconds: 60,
};

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATION_PREFS,
        JSON.stringify(DEFAULT_NOTIFICATION_PREFS)
      );
      return DEFAULT_NOTIFICATION_PREFS;
    }
    return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(prefs));
}

export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-morning-anchor',
    title: 'Morning Hydration & Protein Anchor',
    time: '07:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    habitId: 'habit-eating',
    channels: {
      email: false,
      text: true,
      systemPopup: true,
      overrideScreen: false,
    },
  },
  {
    id: 'rem-deep-work',
    title: '2-Minute Rule Focus Sprint Start',
    time: '09:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    habitId: 'habit-procrastination',
    channels: {
      email: true,
      text: false,
      systemPopup: true,
      overrideScreen: true,
    },
  },
  {
    id: 'rem-kitchen-close',
    title: '8:30 PM Herbal Tea & Kitchen Close',
    time: '20:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    habitId: 'habit-eating',
    channels: {
      email: true,
      text: true,
      systemPopup: true,
      overrideScreen: true,
    },
  },
  {
    id: 'rem-screen-curfew',
    title: 'Phone Out-of-Bedroom & Screen Curfew',
    time: '21:45',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    habitId: 'habit-screen-time',
    channels: {
      email: false,
      text: true,
      systemPopup: true,
      overrideScreen: true,
    },
  },
];

export function getReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
      return DEFAULT_REMINDERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(reminders: ReminderItem[]): void {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
}

function makeStickerSvgDataUrl(
  bgStart: string,
  bgEnd: string,
  accent: string,
  iconText: string,
  topText: string,
  bottomText: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgStart}"/>
        <stop offset="100%" stop-color="${bgEnd}"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="204" height="204" rx="38" fill="url(#g)" stroke="${accent}" stroke-width="5"/>
    <circle cx="110" cy="84" r="42" fill="#090d16" stroke="${accent}" stroke-width="3"/>
    <text x="110" y="99" text-anchor="middle" font-size="40">${iconText}</text>
    <text x="110" y="156" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="800">${topText}</text>
    <text x="110" y="180" text-anchor="middle" fill="${accent}" font-family="monospace" font-size="12" font-weight="700">${bottomText}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const BUILTIN_STICKERS: StickerItem[] = [
  {
    id: 'stk-clean-day',
    label: '100% Clean Today',
    category: 'builtin',
    tags: ['clean', 'streak', 'win', 'sober'],
    imageUrl: makeStickerSvgDataUrl('#0f172a', '#064e3b', '#2dd4bf', '🛡️', '100% CLEAN', 'STREAK LOCKED'),
  },
  {
    id: 'stk-sugar-free',
    label: 'Sugar-Free Hero',
    category: 'builtin',
    tags: ['eating', 'sugar', 'kitchen', 'tea'],
    imageUrl: makeStickerSvgDataUrl('#0f172a', '#4c0519', '#fb7185', '🍵', 'KITCHEN CLOSED', 'SUGAR-FREE WIN'),
  },
  {
    id: 'stk-focus-sprint',
    label: '2-Min Action Taken',
    category: 'builtin',
    tags: ['focus', 'procrastination', 'work', 'sprint'],
    imageUrl: makeStickerSvgDataUrl('#0f172a', '#451a03', '#fbbf24', '⚡', '2-MIN RULE', 'FOCUS UNLOCKED'),
  },
  {
    id: 'stk-unplugged',
    label: 'Zero Doomscroll',
    category: 'builtin',
    tags: ['screen', 'phone', 'sleep', 'detox'],
    imageUrl: makeStickerSvgDataUrl('#0f172a', '#1e1b4b', '#818cf8', '📵', 'UNPLUGGED', 'NO DOOMSCROLL'),
  },
  {
    id: 'stk-workout-done',
    label: 'Workout Crushed',
    category: 'builtin',
    tags: ['workout', 'exercise', 'strength', 'gym'],
    imageUrl: makeStickerSvgDataUrl('#0f172a', '#042f2e', '#34d399', '💪', 'WORKOUT DONE', 'STRONG BODY'),
  },
  {
    id: 'stk-hydrated',
    label: 'Hydration Goal Hit',
    category: 'builtin',
    tags: ['water', 'drink', 'clear', 'hydration'],
    imageUrl: makeStickerSvgDataUrl('#0f172a', '#0c4a6e', '#38bdf8', '💧', 'FULLY HYDRATED', 'CLEAR GLASS'),
  },
];

export const INTERNET_STICKER_CATALOG: StickerItem[] = [
  {
    id: 'web-stk-1',
    label: ' Urge Surfed Like a Pro',
    category: 'internet',
    tags: ['urge', 'wave', 'calm', 'breathe', 'surf'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#164e63', '#22d3ee', '🌊', 'URGE SURFED', 'CRAVING GONE'),
  },
  {
    id: 'web-stk-2',
    label: '30 Days Milestone Crown',
    category: 'internet',
    tags: ['30', 'milestone', 'crown', 'gold', 'celebrate'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#713f12', '#facc15', '👑', '30 DAYS STRONG', 'ROYAL DISCIPLINE'),
  },
  {
    id: 'web-stk-3',
    label: 'Protein & Greens Plate',
    category: 'internet',
    tags: ['food', 'meal', 'protein', 'healthy', 'eating'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#14532d', '#4ade80', '🥗', '30g PROTEIN', 'CLEAN FUEL'),
  },
  {
    id: 'web-stk-4',
    label: 'Deep Sleep 8 Hours',
    category: 'internet',
    tags: ['sleep', 'night', 'rest', 'recovery', 'bed'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#312e81', '#a5b4fc', '🌙', '8 HRS SLEEP', 'REM RESTORED'),
  },
  {
    id: 'web-stk-5',
    label: 'Money Saved Piggy Vault',
    category: 'internet',
    tags: ['money', 'savings', 'wealth', 'cash', 'quit'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#065f46', '#6ee7b7', '💎', 'SAVINGS UP', 'WEALTH RECLAIMED'),
  },
  {
    id: 'web-stk-6',
    label: 'Zero Alcohol Clear Morning',
    category: 'internet',
    tags: ['sober', 'alcohol', 'morning', 'coffee', 'fresh'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#075985', '#7dd3fc', '☀️', 'ZERO HANGOVER', '6 AM CLARITY'),
  },
  {
    id: 'web-stk-7',
    label: 'Community High Five',
    category: 'internet',
    tags: ['cheers', 'support', 'love', 'friend', 'proud'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#831843', '#f472b6', '🙌', 'PROUD OF YOU', 'KEEP GOING!'),
  },
  {
    id: 'web-stk-8',
    label: 'Zen Capybara Peace',
    category: 'internet',
    tags: ['zen', 'cute', 'peace', 'mindful', 'chill'],
    imageUrl: makeStickerSvgDataUrl('#090d16', '#134e4a', '#5eead4', '🧘', 'ZEN STATE', 'CALM & PRESENT'),
  },
];

export function getCustomStickers(): StickerItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_STICKERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomStickers(stickers: StickerItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_STICKERS, JSON.stringify(stickers));
}

export function resetAllDataToDefault(): void {
  saveHabits(DEFAULT_HABITS);
  saveCheckIns(generateSeedCheckIns());
  saveUrgeLogs(DEFAULT_URGES);
  saveAppearanceSettings(DEFAULT_APPEARANCE);
  saveUserProfile(DEFAULT_PROFILE);
  saveCommunityPosts(DEFAULT_COMMUNITY_POSTS);
  saveUserSubscription(DEFAULT_SUBSCRIPTION);
  saveUserVitalityState(DEFAULT_VITALITY_STATE);
  saveDocumentationNotes(DEFAULT_DOCUMENTATION_NOTES);
  saveDailyMoodLogs([]);
  saveAIChatHistory([]);
  saveDMConversations(DEFAULT_DM_CONVERSATIONS);
  saveNotificationPreferences(DEFAULT_NOTIFICATION_PREFS);
  saveReminders(DEFAULT_REMINDERS);
  saveCustomStickers([]);
}
