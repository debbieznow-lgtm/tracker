import React, { useState } from 'react';
import { X, Sparkles, Check, Award, Users, ShieldCheck } from 'lucide-react';
import { Habit, UserProfile } from '../types/habit';
import {
  AVATAR_AURA_COLORS,
  CUTE_AVATAR_GALLERY,
  CuteAvatar
} from './AvatarGallery';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  habits: Habit[];
}

const TITLE_BADGES = [
  'Mindful Wave Rider',
  'Procrastination Breaker',
  'Sugar-Free Nourisher',
  'Clear Glass Champion',
  'Unplugged Digital Minimalist',
  'Pure Breath Guardian',
  'Daily Habit Architect',
  'Resilient Soul',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  habits,
}) => {
  if (!isOpen) return null;

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [handle, setHandle] = useState(profile.handle);
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [auraColor, setAuraColor] = useState(profile.auraColor);
  const [titleBadge, setTitleBadge] = useState(profile.titleBadge);
  const [bio, setBio] = useState(profile.bio);
  const [collectionFilter, setCollectionFilter] = useState<
    'all' | 'woodland' | 'aquatic' | 'companions'
  >('all');

  const selectedAvatarMeta =
    CUTE_AVATAR_GALLERY.find(a => a.id === avatarId) || CUTE_AVATAR_GALLERY[0];

  const filteredAvatars = CUTE_AVATAR_GALLERY.filter(
    a => collectionFilter === 'all' || a.collection === collectionFilter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      displayName: displayName.trim() || 'Explorer',
      handle: handle.trim().startsWith('@')
        ? handle.trim()
        : `@${handle.trim() || 'ascent_member'}`,
      avatarId,
      auraColor,
      titleBadge,
      bio: bio.trim(),
    });
    onClose();
  };

  const activeTrackCount = habits.filter(h => !h.archived).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <CuteAvatar avatarId={avatarId} auraColor={auraColor} size="md" />
          <div>
            <h2 className="text-xl font-bold text-white">
              Your Profile & Cute Avatar Gallery
            </h2>
            <p className="text-xs text-slate-400">
              Choose your companion avatar and customize how you appear in community circles.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Live Profile Card Preview */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CuteAvatar avatarId={avatarId} auraColor={auraColor} size="xl" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-white">
                    {displayName || 'Alex Rivera'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {handle || '@alex_ascent'}
                  </span>
                </div>
                <div className="text-xs font-medium text-teal-400 mt-0.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{titleBadge}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    Companion: {selectedAvatarMeta.name}
                  </span>
                </div>
                {bio && (
                  <p className="text-xs text-slate-300 mt-2 max-w-md italic">
                    "{bio}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span className="font-mono text-white font-bold">{activeTrackCount}</span>
                <span>Active Tracks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="font-mono text-white font-bold">
                  {profile.joinedCircles.length}
                </span>
                <span>Circles Joined</span>
              </div>
            </div>
          </div>

          {/* Cute Profile Image Gallery Picker */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cute Profile Image Gallery (12 Illustrated Companions)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick the character that best represents your current recovery or focus energy.
                </p>
              </div>

              {/* Collection Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
                {[
                  { id: 'all', label: 'All (12)' },
                  { id: 'woodland', label: 'Woodland' },
                  { id: 'aquatic', label: 'Zen & Aquatic' },
                  { id: 'companions', label: 'Companions' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCollectionFilter(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      collectionFilter === tab.id
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredAvatars.map(av => {
                const isSelected = av.id === avatarId;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarId(av.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'border-teal-400 bg-teal-500/10 shadow-md shadow-teal-500/10'
                        : 'border-slate-800 bg-slate-900/70 hover:bg-slate-800/80'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <CuteAvatar avatarId={av.id} auraColor={auraColor} size="lg" />
                    <div className="text-xs font-bold text-white mt-2.5 line-clamp-1">
                      {av.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                      {av.vibe}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Aura Backdrop Picker */}
            <div className="pt-3 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Avatar Backdrop Aura
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {AVATAR_AURA_COLORS.map(aura => {
                  const active = auraColor === aura.id;
                  return (
                    <button
                      key={aura.id}
                      type="button"
                      onClick={() => setAuraColor(aura.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        active
                          ? 'border-teal-400 bg-teal-500/15 text-white font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${aura.className}`} />
                      <span className="truncate">{aura.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Identity & Bio Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Community Handle
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={e => setHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Identity Title Badge
              </label>
              <select
                value={titleBadge}
                onChange={e => setTitleBadge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {TITLE_BADGES.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Personal Recovery / Habit Mantra
              </label>
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="One sentence that keeps you grounded..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-teal-500/20"
            >
              Save Profile & Avatar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
