import React, { useState, useRef } from 'react';
import {
  Smile,
  Sticker,
  Upload,
  Globe,
  Search,
  Lock,
  Crown,
  X,
  Plus,
  Check,
  Trash2
} from 'lucide-react';
import { StickerItem, UserSubscription } from '../types/habit';
import {
  BUILTIN_STICKERS,
  INTERNET_STICKER_CATALOG,
  getCustomStickers,
  saveCustomStickers
} from '../utils/storage';

interface EmojiStickerPickerProps {
  subscription: UserSubscription;
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (sticker: StickerItem) => void;
  onNavigateToPricing: () => void;
  onClose?: () => void;
  compact?: boolean;
}

const EMOJI_CATEGORIES: { id: string; label: string; emojis: string[] }[] = [
  {
    id: 'wins',
    label: 'Wins & Streaks',
    emojis: ['🔥', '🏆', '👑', '⚡', '🎯', '🌟', '💎', '🚀', '🎉', '🙌', '👏', '💯'],
  },
  {
    id: 'health',
    label: 'Health, Food & Fitness',
    emojis: ['💪', '🥗', '🍵', '💧', '🍎', '🥑', '🏃', '🧘', '🚴', '🏋️', '🥦', '🍋'],
  },
  {
    id: 'calm',
    label: 'Calm, Sleep & Detox',
    emojis: ['🛡️', '🌊', '📵', '🌙', '☀️', '🌿', '🧠', '🕊️', '⏳', '📖', '✨', '❄️'],
  },
  {
    id: 'support',
    label: 'Support & Kindness',
    emojis: ['❤️', '🧡', '💚', '🩵', '🤝', '🙏', '🫂', '😊', '🥳', '🫡', '🌱', '🌈'],
  },
];

export const EmojiStickerPicker: React.FC<EmojiStickerPickerProps> = ({
  subscription,
  onSelectEmoji,
  onSelectSticker,
  onNavigateToPricing,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'emojis' | 'stickers' | 'upload' | 'internet'>(
    'emojis'
  );
  const [customStickers, setCustomStickers] = useState<StickerItem[]>(() => getCustomStickers());

  // Upload state
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Internet browse state
  const [internetQuery, setInternetQuery] = useState('');
  const [customWebUrl, setCustomWebUrl] = useState('');
  const [customWebLabel, setCustomWebLabel] = useState('');
  const [webUrlAddedToast, setWebUrlAddedToast] = useState(false);

  // Check if user is on one of the two highest plans: Recovery Pro ('pro') or Sanctuary Mastery ('mastery')
  const isTopTwoPlan =
    subscription.active && (subscription.tierId === 'pro' || subscription.tierId === 'mastery');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadPreview(reader.result);
        if (!uploadLabel.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').slice(0, 22);
          setUploadLabel(cleanName || 'My Custom Sticker');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveUploadedSticker = () => {
    if (!uploadPreview) return;
    const newSticker: StickerItem = {
      id: `cust-stk-${Date.now()}`,
      label: uploadLabel.trim() || 'Custom Sticker',
      imageUrl: uploadPreview,
      category: 'uploaded',
      tags: ['custom', 'uploaded'],
      createdAt: new Date().toISOString(),
    };
    const next = [newSticker, ...customStickers];
    setCustomStickers(next);
    saveCustomStickers(next);
    setUploadPreview(null);
    setUploadLabel('');
    onSelectSticker(newSticker);
  };

  const handleDeleteCustomSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = customStickers.filter(s => s.id !== id);
    setCustomStickers(next);
    saveCustomStickers(next);
  };

  const handleAddInternetUrlSticker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWebUrl.trim()) return;
    const newSticker: StickerItem = {
      id: `web-url-${Date.now()}`,
      label: customWebLabel.trim() || 'Web Sticker',
      imageUrl: customWebUrl.trim(),
      category: 'internet',
      tags: ['internet', 'web'],
      createdAt: new Date().toISOString(),
    };
    const next = [newSticker, ...customStickers];
    setCustomStickers(next);
    saveCustomStickers(next);
    setCustomWebUrl('');
    setCustomWebLabel('');
    setWebUrlAddedToast(true);
    setTimeout(() => setWebUrlAddedToast(false), 2000);
    onSelectSticker(newSticker);
  };

  const filteredInternetStickers = INTERNET_STICKER_CATALOG.filter(stk => {
    if (!internetQuery.trim()) return true;
    const q = internetQuery.toLowerCase();
    return (
      stk.label.toLowerCase().includes(q) ||
      (stk.tags && stk.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
      {/* Top Header & Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('emojis')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'emojis'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Emojis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stickers')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sticker className="w-3.5 h-3.5" />
            <span>Stickers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Upload Sticker</span>
            {!isTopTwoPlan && <Lock className="w-3 h-3 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('internet')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'internet'
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>Browse Internet</span>
            {!isTopTwoPlan && <Lock className="w-3 h-3 text-amber-400" />}
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
            title="Close Picker"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* TAB 1: EMOJIS */}
      {activeTab === 'emojis' && (
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {EMOJI_CATEGORIES.map(cat => (
            <div key={cat.id} className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {cat.label}
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {cat.emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onSelectEmoji(emoji)}
                    className="h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-teal-400 text-base flex items-center justify-center transition-all cursor-pointer"
                    title={`Insert ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BUILT-IN & SAVED STICKERS */}
      {activeTab === 'stickers' && (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {customStickers.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                Your Uploaded & Saved Stickers ({customStickers.length})
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {customStickers.map(stk => (
                  <div
                    key={stk.id}
                    onClick={() => onSelectSticker(stk)}
                    className="group relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-400 flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <img
                      src={stk.imageUrl}
                      alt={stk.label}
                      className="w-14 h-14 object-contain rounded"
                    />
                    <span className="text-[10px] text-slate-200 font-medium truncate max-w-full">
                      {stk.label}
                    </span>
                    <button
                      type="button"
                      onClick={e => handleDeleteCustomSticker(stk.id, e)}
                      className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 p-1 rounded bg-slate-950/90 text-rose-400 hover:text-rose-300 cursor-pointer"
                      title="Delete sticker"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Ascent Habit & Milestone Stickers
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BUILTIN_STICKERS.map(stk => (
                <button
                  key={stk.id}
                  type="button"
                  onClick={() => onSelectSticker(stk)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-400 flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <img
                    src={stk.imageUrl}
                    alt={stk.label}
                    className="w-14 h-14 object-contain rounded"
                  />
                  <span className="text-[10px] text-slate-200 font-medium truncate max-w-full">
                    {stk.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UPLOAD CUSTOM STICKERS (TWO HIGHEST PLANS: PRO & MASTERY) */}
      {activeTab === 'upload' && (
        <div>
          {!isTopTwoPlan ? (
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                  Recovery Pro & Sanctuary Mastery Feature
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Upload Your Own Custom Stickers
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Members on our two highest plans (<strong className="text-slate-200">Recovery Pro</strong> and{' '}
                  <strong className="text-slate-200">Sanctuary Mastery</strong>) can upload custom stickers from their device and build a personal sticker pack.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToPricing}
                className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Unlock on Recovery Pro or Mastery</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider">
                  Upload Custom Sticker from Device ({subscription.tierId.toUpperCase()} Unlocked)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-400" />
                  <span>Choose Image / Sticker File</span>
                </button>
              </div>

              {uploadPreview ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                  <img
                    src={uploadPreview}
                    alt="Uploaded sticker preview"
                    className="w-16 h-16 object-contain rounded-lg bg-slate-950 border border-slate-800 p-1 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={uploadLabel}
                      onChange={e => setUploadLabel(e.target.value)}
                      placeholder="Sticker name (e.g., My Victory Badge)..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveUploadedSticker}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save & Attach Sticker</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadPreview(null)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-xl border border-dashed border-slate-800 hover:border-teal-500/50 bg-slate-900/40 text-center cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-300 font-medium">
                    Click to upload any PNG, SVG, GIF, or JPG sticker from your device
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Saved automatically to your personal sticker collection
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BROWSE THE INTERNET FOR STICKERS (TWO HIGHEST PLANS: PRO & MASTERY) */}
      {activeTab === 'internet' && (
        <div>
          {!isTopTwoPlan ? (
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                  Recovery Pro & Sanctuary Mastery Feature
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Browse the Internet for Stickers
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Upgrade to <strong className="text-slate-200">Recovery Pro</strong> or{' '}
                  <strong className="text-slate-200">Sanctuary Mastery</strong> to search online sticker packs or import any sticker URL directly from the web.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToPricing}
                className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Unlock Internet Sticker Browser</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search Online Sticker Catalog */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={internetQuery}
                    onChange={e => setInternetQuery(e.target.value)}
                    placeholder="Search online stickers (e.g., crown, sleep, protein, zen, money, wave)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
                <span className="text-[10px] font-mono text-teal-400 shrink-0">
                  {filteredInternetStickers.length} online results
                </span>
              </div>

              {/* Online Sticker Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredInternetStickers.map(stk => (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => onSelectSticker(stk)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-400 flex items-center gap-2 text-left transition-all cursor-pointer"
                  >
                    <img
                      src={stk.imageUrl}
                      alt={stk.label}
                      className="w-11 h-11 object-contain rounded shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-white truncate">
                        {stk.label}
                      </div>
                      <div className="text-[9px] font-mono text-teal-400">Web Sticker</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Paste Any Web Sticker Image / GIF URL */}
              <form
                onSubmit={handleAddInternetUrlSticker}
                className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  type="url"
                  value={customWebUrl}
                  onChange={e => setCustomWebUrl(e.target.value)}
                  placeholder="Or paste any internet sticker / GIF image URL (https://...)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
                <input
                  type="text"
                  value={customWebLabel}
                  onChange={e => setCustomWebLabel(e.target.value)}
                  placeholder="Sticker label..."
                  className="sm:w-36 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  disabled={!customWebUrl.trim()}
                  className="px-3 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{webUrlAddedToast ? 'Added!' : 'Add Web Sticker'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
