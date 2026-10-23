import { HealthMilestone } from '../types/habit';

export const HEALTH_MILESTONES: HealthMilestone[] = [
  // Nicotine / Vaping / Smoking
  {
    id: 'nic-20m',
    viceType: 'nicotine',
    timeSeconds: 20 * 60, // 20 minutes
    title: 'Pulse & Blood Pressure Normalize',
    description: 'Heart rate and vascular pressure begin to drop back toward baseline resting levels.',
    benefitCategory: 'cardiovascular',
  },
  {
    id: 'nic-8h',
    viceType: 'nicotine',
    timeSeconds: 8 * 3600, // 8 hours
    title: 'Carbon Monoxide Levels Halved',
    description: 'Bloodstream oxygen levels increase significantly as carbon monoxide clears.',
    benefitCategory: 'physical',
  },
  {
    id: 'nic-24h',
    viceType: 'nicotine',
    timeSeconds: 24 * 3600, // 24 hours
    title: 'Cardiac Overload Drops',
    description: 'Acute coronary strain declines; lungs start mobilizing residual debris.',
    benefitCategory: 'cardiovascular',
  },
  {
    id: 'nic-48h',
    viceType: 'nicotine',
    timeSeconds: 48 * 3600, // 48 hours
    title: 'Nerve Endings Regrow & Senses Awaken',
    description: 'Damaged taste buds and olfactory receptors begin regenerating; food tastes richer.',
    benefitCategory: 'physical',
  },
  {
    id: 'nic-72h',
    viceType: 'nicotine',
    timeSeconds: 72 * 3600, // 3 days
    title: 'Nicotine 100% Depleted from Body',
    description: 'Chemical dependency breaks. Bronchial tubes relax and lung volume increases.',
    benefitCategory: 'physical',
  },
  {
    id: 'nic-2w',
    viceType: 'nicotine',
    timeSeconds: 14 * 86400, // 2 weeks
    title: 'Circulation & Lung Function Surge',
    description: 'Walking and physical stamina noticeably improve; coughing and shortness of breath diminish.',
    benefitCategory: 'cardiovascular',
  },
  {
    id: 'nic-1m',
    viceType: 'nicotine',
    timeSeconds: 30 * 86400, // 1 month
    title: 'Cilia Regeneration',
    description: 'Microscopic cilia in airways are active again, dramatically reducing infection risk.',
    benefitCategory: 'physical',
  },
  {
    id: 'nic-3m',
    viceType: 'nicotine',
    timeSeconds: 90 * 86400, // 3 months
    title: 'Dopamine Receptor Normalization',
    description: 'Brain dopamine circuits rewire to find natural pleasure in everyday experiences.',
    benefitCategory: 'neuro',
  },

  // Alcohol
  {
    id: 'alc-24h',
    viceType: 'alcohol',
    timeSeconds: 24 * 3600,
    title: 'Blood Detox & Rehydration',
    description: 'Kidneys and liver process residual toxins; blood sugar stabilizes.',
    benefitCategory: 'physical',
  },
  {
    id: 'alc-72h',
    viceType: 'alcohol',
    timeSeconds: 72 * 3600,
    title: 'Acute Withdrawal Window Clears',
    description: 'Sleep cycles start restoring REM stages; tremors and physiological restlessness taper off.',
    benefitCategory: 'sleep',
  },
  {
    id: 'alc-1w',
    viceType: 'alcohol',
    timeSeconds: 7 * 86400,
    title: 'Deep REM Sleep Restored',
    description: 'Wakefulness during night drops by over 60%; mental clarity sharply rises.',
    benefitCategory: 'sleep',
  },
  {
    id: 'alc-2w',
    viceType: 'alcohol',
    timeSeconds: 14 * 86400,
    title: 'Gastric Lining & Acid Balance Recover',
    description: 'Acid reflux subsides; stomach irritation diminishes and nutrient absorption improves.',
    benefitCategory: 'physical',
  },
  {
    id: 'alc-1m',
    viceType: 'alcohol',
    timeSeconds: 30 * 86400,
    title: 'Liver Fat Reduction (Up to 15%)',
    description: 'Hepatic inflammation drops substantially; skin appears visibly hydrated and bright.',
    benefitCategory: 'physical',
  },
  {
    id: 'alc-90d',
    viceType: 'alcohol',
    timeSeconds: 90 * 86400,
    title: 'Prefrontal Cortex Gray Matter Recovery',
    description: 'Executive function, emotional regulation, and impulse resistance reach new peaks.',
    benefitCategory: 'mental',
  },

  // Digital / Screen Addiction / Doomscrolling
  {
    id: 'scr-24h',
    viceType: 'screen',
    timeSeconds: 24 * 3600,
    title: 'Attention Span Re-anchoring',
    description: 'Phantom vibration syndrome and restless check-in reflex begin to decline.',
    benefitCategory: 'mental',
  },
  {
    id: 'scr-3d',
    viceType: 'screen',
    timeSeconds: 72 * 3600,
    title: 'Melatonin Sleep Phase Reset',
    description: 'Circadian rhythm recalibrates without late-night blue light spikes; deeper rest.',
    benefitCategory: 'sleep',
  },
  {
    id: 'scr-1w',
    viceType: 'screen',
    timeSeconds: 7 * 86400,
    title: 'Boredom Tolerance Rebuilt',
    description: 'The brain regains the ability to stay focused without constant hyper-stimulation.',
    benefitCategory: 'neuro',
  },
  {
    id: 'scr-30d',
    viceType: 'screen',
    timeSeconds: 30 * 86400,
    title: 'Deep Work Cognitive Bandwidth',
    description: 'Sustained focus duration increases 3-fold. Anxiety from comparison feeds drops.',
    benefitCategory: 'mental',
  },

  // Mindful Eating / Sugar & Binge Reduction
  {
    id: 'eat-24h',
    viceType: 'sugar',
    timeSeconds: 24 * 3600,
    title: 'Insulin & Blood Glucose Stabilize',
    description: 'Sharp post-meal insulin spikes and afternoon sugar crashes begin leveling out.',
    benefitCategory: 'physical',
  },
  {
    id: 'eat-3d',
    viceType: 'sugar',
    timeSeconds: 3 * 86400,
    title: 'Ghrelin Hunger Hormone Reset',
    description: 'False emotional hunger signals subside; natural satiety cues become clearer.',
    benefitCategory: 'neuro',
  },
  {
    id: 'eat-14d',
    viceType: 'sugar',
    timeSeconds: 14 * 86400,
    title: 'Palate & Taste Bud Recalibration',
    description: 'Whole foods, fruits, and natural textures taste vibrant without hyper-palatable sugar overload.',
    benefitCategory: 'physical',
  },
  {
    id: 'eat-30d',
    viceType: 'sugar',
    timeSeconds: 30 * 86400,
    title: 'Gut Microbiome & Energy Renewal',
    description: 'Systemic inflammation drops; steady all-day metabolic energy replaces binge-restrict cycles.',
    benefitCategory: 'physical',
  },

  // Procrastination & Task Avoidance
  {
    id: 'proc-24h',
    viceType: 'procrastination',
    timeSeconds: 24 * 3600,
    title: 'Activation Friction Broken',
    description: 'Starting tasks within 2 minutes quiets the amygdala threat response around unfinished work.',
    benefitCategory: 'mental',
  },
  {
    id: 'proc-7d',
    viceType: 'procrastination',
    timeSeconds: 7 * 86400,
    title: 'Evening Guilt Loop Dissolved',
    description: 'Going to sleep after completing your top priority restores restful, guilt-free evenings.',
    benefitCategory: 'sleep',
  },
  {
    id: 'proc-21d',
    viceType: 'procrastination',
    timeSeconds: 21 * 86400,
    title: 'Self-Trust & Executive Momentum',
    description: 'Your brain begins associating action with relief rather than dread; deep focus feels automatic.',
    benefitCategory: 'neuro',
  },

  // General Addiction / Behavioral Milestones
  {
    id: 'gen-24h',
    viceType: 'general',
    timeSeconds: 86400,
    title: 'First 24 Hours Conquered',
    description: 'You proved that you can endure through a full cycle of day and night.',
    benefitCategory: 'mental',
  },
  {
    id: 'gen-3d',
    viceType: 'general',
    timeSeconds: 3 * 86400,
    title: 'The 72-Hour Hump',
    description: 'The hardest initial physiological peak has been overcome.',
    benefitCategory: 'physical',
  },
  {
    id: 'gen-7d',
    viceType: 'general',
    timeSeconds: 7 * 86400,
    title: 'One Full Week Free',
    description: '7 days of freedom. You survived every day-of-week context cue without giving in.',
    benefitCategory: 'mental',
  },
  {
    id: 'gen-14d',
    viceType: 'general',
    timeSeconds: 14 * 86400,
    title: 'Two Weeks of Momentum',
    description: 'Initial habit loops are destabilizing; alternative healthy routines are solidifying.',
    benefitCategory: 'neuro',
  },
  {
    id: 'gen-30d',
    viceType: 'general',
    timeSeconds: 30 * 86400,
    title: 'The 30-Day Transformation',
    description: 'Neuroplastic rewiring is underway. Cravings are now visitors rather than commanders.',
    benefitCategory: 'neuro',
  },
  {
    id: 'gen-60d',
    viceType: 'general',
    timeSeconds: 60 * 86400,
    title: '60 Days of Resilience',
    description: 'New baseline neural pathways are dominant. High-risk situations are manageable.',
    benefitCategory: 'mental',
  },
  {
    id: 'gen-90d',
    viceType: 'general',
    timeSeconds: 90 * 86400,
    title: 'The 90-Day Brain Reset',
    description: 'Addiction science benchmarks 90 days as the turning point for permanent lifestyle shift.',
    benefitCategory: 'neuro',
  },
  {
    id: 'gen-180d',
    viceType: 'general',
    timeSeconds: 180 * 86400,
    title: 'Half a Year of Mastery',
    description: '6 months clean. Your identity has shifted from someone trying to quit to someone who is free.',
    benefitCategory: 'mental',
  },
  {
    id: 'gen-365d',
    viceType: 'general',
    timeSeconds: 365 * 86400,
    title: 'One Year Monument',
    description: '365 continuous days. Every holiday, birthday, and stressful season lived in victory.',
    benefitCategory: 'mental',
  },
];

export function getRelevantMilestones(substanceOrVice?: string): HealthMilestone[] {
  if (!substanceOrVice) {
    return HEALTH_MILESTONES.filter(m => m.viceType === 'general');
  }

  const query = substanceOrVice.toLowerCase();
  let specificType: HealthMilestone['viceType'] = 'general';

  if (query.includes('vape') || query.includes('smoke') || query.includes('nicotine') || query.includes('cigarette')) {
    specificType = 'nicotine';
  } else if (query.includes('alcohol') || query.includes('drink') || query.includes('beer') || query.includes('wine')) {
    specificType = 'alcohol';
  } else if (query.includes('screen') || query.includes('phone') || query.includes('doom') || query.includes('social') || query.includes('media')) {
    specificType = 'screen';
  } else if (query.includes('eat') || query.includes('sugar') || query.includes('binge') || query.includes('snack') || query.includes('junk') || query.includes('food')) {
    specificType = 'sugar';
  } else if (query.includes('procrastinat') || query.includes('delay') || query.includes('focus') || query.includes('avoid')) {
    specificType = 'procrastination';
  }

  const specificList = HEALTH_MILESTONES.filter(m => m.viceType === specificType);
  const generalList = HEALTH_MILESTONES.filter(m => m.viceType === 'general');

  // Combined and sorted by timeSeconds
  return [...specificList, ...generalList].sort((a, b) => a.timeSeconds - b.timeSeconds);
}

