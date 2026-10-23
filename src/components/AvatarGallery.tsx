import React from 'react';

export interface CuteAvatarOption {
  id: string;
  name: string;
  species: string;
  vibe: string;
  collection: 'woodland' | 'aquatic' | 'companions';
  defaultBg: string;
}

export const CUTE_AVATAR_GALLERY: CuteAvatarOption[] = [
  {
    id: 'zen-capybara',
    name: 'Mochi the Zen Capybara',
    species: 'Capybara',
    vibe: 'Unbothered peace & mindful eating',
    collection: 'aquatic',
    defaultBg: 'from-teal-500/30 to-emerald-500/20',
  },
  {
    id: 'focus-fox',
    name: 'Pippin the Focus Fox',
    species: 'Red Fox',
    vibe: 'Procrastination breaker & deep work',
    collection: 'woodland',
    defaultBg: 'from-amber-500/30 to-orange-500/20',
  },
  {
    id: 'hydration-otter',
    name: 'Boba the Sea Otter',
    species: 'Sea Otter',
    vibe: 'Pure hydration & alcohol-free joy',
    collection: 'aquatic',
    defaultBg: 'from-sky-500/30 to-cyan-500/20',
  },
  {
    id: 'resilient-panda',
    name: 'Kiko the Red Panda',
    species: 'Red Panda',
    vibe: 'Screen-time detox & outdoor energy',
    collection: 'woodland',
    defaultBg: 'from-rose-500/30 to-amber-500/20',
  },
  {
    id: 'starry-owl',
    name: 'Luna the Night Owl',
    species: 'Snowy Owl',
    vibe: 'Late-night scrolling guardian',
    collection: 'woodland',
    defaultBg: 'from-indigo-500/30 to-violet-500/20',
  },
  {
    id: 'matcha-frog',
    name: 'Taro the Matcha Frog',
    species: 'Tree Frog',
    vibe: 'Calm routines & gentle mornings',
    collection: 'aquatic',
    defaultBg: 'from-emerald-500/30 to-lime-500/20',
  },
  {
    id: 'cloud-bunny',
    name: 'Mimi the Cloud Bunny',
    species: 'Lop Bunny',
    vibe: 'Self-compassion & sugar-free glow',
    collection: 'companions',
    defaultBg: 'from-pink-500/30 to-rose-500/20',
  },
  {
    id: 'sunny-shiba',
    name: 'Yuzu the Sunny Shiba',
    species: 'Shiba Inu',
    vibe: 'Loyal streak keeper & daily movement',
    collection: 'companions',
    defaultBg: 'from-amber-400/30 to-yellow-500/20',
  },
  {
    id: 'cozy-bear',
    name: 'Barnaby the Honey Bear',
    species: 'Brown Bear',
    vibe: 'Grounded breathwork & steady recovery',
    collection: 'woodland',
    defaultBg: 'from-amber-600/30 to-stone-500/20',
  },
  {
    id: 'botanical-cat',
    name: 'Clover the Sprout Cat',
    species: 'Calico Cat',
    vibe: 'Boundaries & digital minimalism',
    collection: 'companions',
    defaultBg: 'from-teal-400/30 to-indigo-500/20',
  },
  {
    id: 'cosmic-axolotl',
    name: 'Nova the Axolotl',
    species: 'Axolotl',
    vibe: 'Neuroplasticity & brain regeneration',
    collection: 'aquatic',
    defaultBg: 'from-fuchsia-500/30 to-purple-500/20',
  },
  {
    id: 'sprout-penguin',
    name: 'Pebble the Penguin',
    species: 'Little Penguin',
    vibe: 'Cool-headed urge surfer',
    collection: 'aquatic',
    defaultBg: 'from-sky-400/30 to-indigo-500/20',
  },
];

export const AVATAR_AURA_COLORS: { id: string; label: string; className: string }[] = [
  { id: 'teal', label: 'Mint Lagoon', className: 'bg-gradient-to-br from-teal-500/30 to-emerald-600/30 border-teal-400/50' },
  { id: 'amber', label: 'Golden Honey', className: 'bg-gradient-to-br from-amber-500/30 to-orange-600/30 border-amber-400/50' },
  { id: 'indigo', label: 'Starlight Indigo', className: 'bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border-indigo-400/50' },
  { id: 'rose', label: 'Sakura Blossom', className: 'bg-gradient-to-br from-rose-500/30 to-pink-600/30 border-rose-400/50' },
  { id: 'sky', label: 'Ocean Breeze', className: 'bg-gradient-to-br from-sky-500/30 to-cyan-600/30 border-sky-400/50' },
  { id: 'emerald', label: 'Forest Moss', className: 'bg-gradient-to-br from-emerald-500/30 to-green-600/30 border-emerald-400/50' },
];

interface CuteAvatarProps {
  avatarId: string;
  auraColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CuteAvatar: React.FC<CuteAvatarProps> = ({
  avatarId,
  auraColor = 'teal',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const aura =
    AVATAR_AURA_COLORS.find(a => a.id === auraColor)?.className ||
    AVATAR_AURA_COLORS[0].className;

  return (
    <div
      className={`relative rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 select-none ${sizeMap[size]} ${aura} ${className}`}
    >
      {renderCharacterSvg(avatarId)}
    </div>
  );
};

function renderCharacterSvg(avatarId: string) {
  switch (avatarId) {
    case 'zen-capybara':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Tiny leaf sprout on head */}
          <path d="M50 22 C50 12 40 10 38 15 C36 20 46 22 50 22 Z" fill="#34d399" />
          <path d="M50 22 C52 12 62 10 64 15 C66 20 54 22 50 22 Z" fill="#10b981" />
          <line x1="50" y1="20" x2="50" y2="28" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          {/* Ears */}
          <ellipse cx="28" cy="34" rx="7" ry="9" fill="#92400e" />
          <ellipse cx="72" cy="34" rx="7" ry="9" fill="#92400e" />
          {/* Head */}
          <rect x="22" y="26" width="56" height="52" rx="26" fill="#d97706" />
          {/* Snout area */}
          <rect x="33" y="44" width="34" height="26" rx="13" fill="#b45309" />
          {/* Peaceful closed zen eyes */}
          <path d="M29 44 Q33 48 37 44" stroke="#1c1917" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M63 44 Q67 48 71 44" stroke="#1c1917" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <ellipse cx="28" cy="52" rx="4.5" ry="2.5" fill="#fb7185" opacity="0.7" />
          <ellipse cx="72" cy="52" rx="4.5" ry="2.5" fill="#fb7185" opacity="0.7" />
          {/* Nose & smile */}
          <ellipse cx="45" cy="52" rx="2.5" ry="3.5" fill="#292524" />
          <ellipse cx="55" cy="52" rx="2.5" ry="3.5" fill="#292524" />
          <path d="M46 61 Q50 65 54 61" stroke="#292524" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'focus-fox':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Pointy Fox Ears */}
          <polygon points="22,45 18,14 42,28" fill="#ea580c" />
          <polygon points="24,40 22,20 38,29" fill="#fed7aa" />
          <polygon points="78,45 82,14 58,28" fill="#ea580c" />
          <polygon points="76,40 78,20 62,29" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="50" cy="54" rx="30" ry="26" fill="#f97316" />
          {/* White cheek fur */}
          <path d="M20 56 Q35 48 50 72 L24 72 Z" fill="#fff7ed" />
          <path d="M80 56 Q65 48 50 72 L76 72 Z" fill="#fff7ed" />
          {/* Eyes */}
          <circle cx="37" cy="50" r="3.5" fill="#1e293b" />
          <circle cx="63" cy="50" r="3.5" fill="#1e293b" />
          {/* Cute Round Reading Glasses */}
          <circle cx="37" cy="50" r="9" stroke="#fde047" strokeWidth="2.5" fill="none" />
          <circle cx="63" cy="50" r="9" stroke="#fde047" strokeWidth="2.5" fill="none" />
          <line x1="46" y1="50" x2="54" y2="50" stroke="#fde047" strokeWidth="2.5" />
          {/* Nose */}
          <polygon points="46,61 54,61 50,67" fill="#1e293b" />
          <path d="M45 70 Q50 74 55 70" stroke="#1e293b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'hydration-otter':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Water droplet badge above */}
          <path d="M50 10 C50 10 42 20 42 25 A8 8 0 0 0 58 25 C58 20 50 10 50 10 Z" fill="#38bdf8" />
          {/* Ears */}
          <circle cx="24" cy="44" r="7" fill="#78350f" />
          <circle cx="76" cy="44" r="7" fill="#78350f" />
          {/* Head */}
          <ellipse cx="50" cy="56" rx="28" ry="25" fill="#92400e" />
          {/* Cream muzzle */}
          <ellipse cx="43" cy="59" rx="9" ry="7" fill="#fef3c7" />
          <ellipse cx="57" cy="59" rx="9" ry="7" fill="#fef3c7" />
          {/* Sparkling Eyes */}
          <circle cx="36" cy="48" r="4" fill="#1c1917" />
          <circle cx="34.5" cy="46.5" r="1.4" fill="#ffffff" />
          <circle cx="64" cy="48" r="4" fill="#1c1917" />
          <circle cx="62.5" cy="46.5" r="1.4" fill="#ffffff" />
          {/* Cute diamond nose */}
          <polygon points="50,51 45,56 50,60 55,56" fill="#451a03" />
          {/* Blush */}
          <ellipse cx="29" cy="56" rx="4" ry="2.2" fill="#fb7185" opacity="0.65" />
          <ellipse cx="71" cy="56" rx="4" ry="2.2" fill="#fb7185" opacity="0.65" />
          {/* Whiskers */}
          <line x1="25" y1="60" x2="32" y2="59" stroke="#d6d3d1" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="75" y1="60" x2="68" y2="59" stroke="#d6d3d1" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'resilient-panda':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Round fluffy ears */}
          <circle cx="24" cy="30" r="11" fill="#7c2d12" />
          <circle cx="24" cy="30" r="6" fill="#ffedd5" />
          <circle cx="76" cy="30" r="11" fill="#7c2d12" />
          <circle cx="76" cy="30" r="6" fill="#ffedd5" />
          {/* Head */}
          <ellipse cx="50" cy="54" rx="29" ry="26" fill="#c2410c" />
          {/* White eyebrow patches & cheeks */}
          <ellipse cx="37" cy="41" rx="6" ry="3.5" fill="#fff7ed" transform="rotate(-12 37 41)" />
          <ellipse cx="63" cy="41" rx="6" ry="3.5" fill="#fff7ed" transform="rotate(12 63 41)" />
          <ellipse cx="30" cy="60" rx="8" ry="6" fill="#fff7ed" />
          <ellipse cx="70" cy="60" rx="8" ry="6" fill="#fff7ed" />
          {/* Muzzle */}
          <ellipse cx="50" cy="61" rx="11" ry="9" fill="#fff7ed" />
          {/* Eyes */}
          <circle cx="38" cy="50" r="3.8" fill="#1c1917" />
          <circle cx="37" cy="48.8" r="1.2" fill="#ffffff" />
          <circle cx="62" cy="50" r="3.8" fill="#1c1917" />
          <circle cx="61" cy="48.8" r="1.2" fill="#ffffff" />
          {/* Nose & happy mouth */}
          <ellipse cx="50" cy="58" rx="4" ry="3" fill="#1c1917" />
          <path d="M46 64 Q50 68 54 64" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Cozy Explorer Scarf */}
          <rect x="27" y="75" width="46" height="10" rx="5" fill="#10b981" />
          <rect x="54" y="78" width="9" height="14" rx="3" fill="#059669" />
        </svg>
      );

    case 'starry-owl':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Crescent Moon Crown */}
          <path d="M53 13 A6 6 0 1 1 45 21 A5 5 0 1 0 53 13 Z" fill="#fde047" />
          {/* Owl Body/Head */}
          <ellipse cx="50" cy="56" rx="28" ry="28" fill="#6366f1" />
          {/* Ear tufts */}
          <polygon points="24,38 18,22 36,30" fill="#4f46e5" />
          <polygon points="76,38 82,22 64,30" fill="#4f46e5" />
          {/* Double eye rings */}
          <circle cx="38" cy="50" r="12" fill="#e0e7ff" />
          <circle cx="62" cy="50" r="12" fill="#e0e7ff" />
          <circle cx="38" cy="50" r="6" fill="#1e1b4b" />
          <circle cx="36" cy="48" r="2" fill="#ffffff" />
          <circle cx="62" cy="50" r="6" fill="#1e1b4b" />
          <circle cx="60" cy="48" r="2" fill="#ffffff" />
          {/* Golden Beak */}
          <polygon points="46,54 54,54 50,62" fill="#f59e0b" />
          {/* Belly feather scallops */}
          <path d="M36 72 Q40 76 44 72 Q50 76 56 72 Q60 76 64 72" stroke="#c7d2fe" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'matcha-frog':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Big frog eye bumps */}
          <circle cx="33" cy="36" r="12" fill="#4ade80" />
          <circle cx="67" cy="36" r="12" fill="#4ade80" />
          {/* Main frog head */}
          <ellipse cx="50" cy="58" rx="31" ry="23" fill="#4ade80" />
          {/* Cream belly */}
          <ellipse cx="50" cy="66" rx="22" ry="12" fill="#dcfce7" />
          {/* Eyes */}
          <circle cx="33" cy="36" r="6.5" fill="#ffffff" />
          <circle cx="33" cy="36" r="3.8" fill="#14532d" />
          <circle cx="67" cy="36" r="6.5" fill="#ffffff" />
          <circle cx="67" cy="36" r="3.8" fill="#14532d" />
          {/* Blush */}
          <ellipse cx="26" cy="54" rx="5" ry="2.8" fill="#fb7185" opacity="0.65" />
          <ellipse cx="74" cy="54" rx="5" ry="2.8" fill="#fb7185" opacity="0.65" />
          {/* Big gentle frog smile */}
          <path d="M36 53 Q50 61 64 53" stroke="#14532d" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'cloud-bunny':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Long floppy bunny ears */}
          <ellipse cx="37" cy="26" rx="8" ry="19" fill="#f8fafc" transform="rotate(-10 37 26)" />
          <ellipse cx="37" cy="27" rx="4" ry="13" fill="#fda4af" transform="rotate(-10 37 27)" />
          <ellipse cx="63" cy="26" rx="8" ry="19" fill="#f8fafc" transform="rotate(10 63 26)" />
          <ellipse cx="63" cy="27" rx="4" ry="13" fill="#fda4af" transform="rotate(10 63 27)" />
          {/* Fluffy cheeks/head */}
          <ellipse cx="50" cy="58" rx="28" ry="24" fill="#f8fafc" />
          {/* Eyes */}
          <circle cx="38" cy="54" r="3.8" fill="#334155" />
          <circle cx="36.8" cy="52.5" r="1.3" fill="#ffffff" />
          <circle cx="62" cy="54" r="3.8" fill="#334155" />
          <circle cx="60.8" cy="52.5" r="1.3" fill="#ffffff" />
          {/* Pink nose & Y mouth */}
          <ellipse cx="50" cy="59" rx="3.2" ry="2.2" fill="#fb7185" />
          <path d="M46 64 Q50 67 54 64" stroke="#475569" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <ellipse cx="29" cy="60" rx="4.5" ry="2.5" fill="#fda4af" opacity="0.8" />
          <ellipse cx="71" cy="60" rx="4.5" ry="2.5" fill="#fda4af" opacity="0.8" />
        </svg>
      );

    case 'sunny-shiba':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Shiba Ears */}
          <polygon points="24,42 20,16 42,28" fill="#f59e0b" />
          <polygon points="76,42 80,16 58,28" fill="#f59e0b" />
          {/* Head */}
          <ellipse cx="50" cy="54" rx="29" ry="26" fill="#f59e0b" />
          {/* Cream Shiba lower face & eyebrows */}
          <path d="M22 56 Q36 46 50 56 Q64 46 78 56 C78 72 65 80 50 80 C35 80 22 72 22 56 Z" fill="#fef3c7" />
          <circle cx="38" cy="40" r="3.2" fill="#fef3c7" />
          <circle cx="62" cy="40" r="3.2" fill="#fef3c7" />
          {/* Eyes */}
          <circle cx="38" cy="49" r="3.8" fill="#1c1917" />
          <circle cx="62" cy="49" r="3.8" fill="#1c1917" />
          {/* Nose & happy tongue */}
          <ellipse cx="50" cy="56" rx="4" ry="3" fill="#1c1917" />
          <path d="M44 63 Q50 67 56 63" stroke="#1c1917" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M47 65 Q50 72 53 65 Z" fill="#fb7185" />
        </svg>
      );

    case 'cozy-bear':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Round bear ears */}
          <circle cx="26" cy="30" r="10" fill="#78350f" />
          <circle cx="26" cy="30" r="5" fill="#d97706" />
          <circle cx="74" cy="30" r="10" fill="#78350f" />
          <circle cx="74" cy="30" r="5" fill="#d97706" />
          {/* Head */}
          <circle cx="50" cy="54" r="28" fill="#92400e" />
          {/* Snout */}
          <ellipse cx="50" cy="60" rx="11" ry="9" fill="#fde68a" />
          {/* Eyes */}
          <circle cx="38" cy="48" r="3.6" fill="#1c1917" />
          <circle cx="62" cy="48" r="3.6" fill="#1c1917" />
          {/* Nose */}
          <ellipse cx="50" cy="57" rx="4.5" ry="3.2" fill="#451a03" />
          <path d="M46 63 Q50 66 54 63" stroke="#451a03" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="30" cy="56" rx="4" ry="2.2" fill="#fb7185" opacity="0.6" />
          <ellipse cx="70" cy="56" rx="4" ry="2.2" fill="#fb7185" opacity="0.6" />
        </svg>
      );

    case 'botanical-cat':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Cat Ears */}
          <polygon points="23,46 20,18 44,30" fill="#e2e8f0" />
          <polygon points="26,42 24,24 40,32" fill="#fda4af" />
          <polygon points="77,46 80,18 56,30" fill="#f59e0b" />
          {/* Head */}
          <ellipse cx="50" cy="55" rx="28" ry="25" fill="#f8fafc" />
          {/* Calico patches */}
          <path d="M22 48 A28 25 0 0 1 45 30 C42 42 32 48 22 48 Z" fill="#f59e0b" />
          <path d="M78 48 A28 25 0 0 0 56 30 C58 42 68 48 78 48 Z" fill="#475569" />
          {/* Eyes */}
          <circle cx="38" cy="52" r="4" fill="#0f766e" />
          <circle cx="36.8" cy="50.5" r="1.3" fill="#ffffff" />
          <circle cx="62" cy="52" r="4" fill="#0f766e" />
          <circle cx="60.8" cy="50.5" r="1.3" fill="#ffffff" />
          {/* Pink nose & cat mouth */}
          <polygon points="47,58 53,58 50,62" fill="#fb7185" />
          <path d="M44 64 Q47 67 50 64 Q53 67 56 64" stroke="#334155" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'cosmic-axolotl':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Frilly Axolotl Gill Branches */}
          <path d="M22 42 L10 34 M20 52 L8 50 M22 62 L10 66" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
          <path d="M78 42 L90 34 M80 52 L92 50 M78 62 L90 66" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
          {/* Head */}
          <ellipse cx="50" cy="54" rx="28" ry="23" fill="#fbcfe8" />
          {/* Eyes */}
          <circle cx="37" cy="50" r="3.8" fill="#4c0519" />
          <circle cx="35.8" cy="48.5" r="1.3" fill="#ffffff" />
          <circle cx="63" cy="50" r="3.8" fill="#4c0519" />
          <circle cx="61.8" cy="48.5" r="1.3" fill="#ffffff" />
          {/* Rosy cheeks */}
          <ellipse cx="29" cy="56" rx="4" ry="2.2" fill="#f43f5e" opacity="0.55" />
          <ellipse cx="71" cy="56" rx="4" ry="2.2" fill="#f43f5e" opacity="0.55" />
          {/* Smile */}
          <path d="M44 58 Q50 63 56 58" stroke="#881337" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'sprout-penguin':
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          {/* Head/Body */}
          <ellipse cx="50" cy="56" rx="27" ry="28" fill="#334155" />
          {/* White face heart */}
          <path d="M29 56 C29 42 44 40 50 48 C56 40 71 42 71 56 C71 72 58 80 50 80 C42 80 29 72 29 56 Z" fill="#f8fafc" />
          {/* Eyes */}
          <circle cx="39" cy="52" r="3.6" fill="#0f172a" />
          <circle cx="61" cy="52" r="3.6" fill="#0f172a" />
          {/* Cute Beak */}
          <ellipse cx="50" cy="58" rx="5.5" ry="3.5" fill="#f59e0b" />
          {/* Blush */}
          <ellipse cx="32" cy="58" rx="4" ry="2.2" fill="#fb7185" opacity="0.65" />
          <ellipse cx="68" cy="58" rx="4" ry="2.2" fill="#fb7185" opacity="0.65" />
        </svg>
      );
  }
}
