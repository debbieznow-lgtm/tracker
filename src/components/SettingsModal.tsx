import React, { useRef, useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Monitor,
  Palette,
  Type,
  LayoutGrid,
  List,
  Columns3,
  Sun,
  Moon,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import {
  AccentColor,
  AppearanceSettings,
  DisplayTheme,
  LayoutDisplay,
  TextColorTone,
  TextFontStyle,
  TextSize
} from '../types/habit';
import {
  exportAllData,
  importAllData,
  resetAllDataToDefault,
  setCurrencySymbol
} from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  onCurrencyChange: (sym: string) => void;
  appearance: AppearanceSettings;
  onAppearanceChange: (next: AppearanceSettings) => void;
  onDataReload: () => void;
}

const CURRENCIES = [
  { symbol: '$', label: 'USD / CAD / AUD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY / CNY (¥)' },
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: 'CHF', label: 'CHF' },
  { symbol: 'kr', label: 'SEK / NOK / DKK (kr)' },
];

export const DISPLAY_THEMES: { id: DisplayTheme; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dark', label: 'Dark Mode', desc: 'Soft dark background', icon: Moon },
  { id: 'midnight', label: 'Pure Black', desc: 'Deep black high contrast', icon: Sparkles },
  { id: 'light', label: 'Light Mode', desc: 'Warm paper background', icon: Sun },
];

export const LAYOUT_OPTIONS: { id: LayoutDisplay; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'grid', label: '2 Columns', desc: 'Side-by-side cards', icon: LayoutGrid },
  { id: 'list', label: '1 Column List', desc: 'Simple wide list', icon: List },
  { id: 'compact', label: 'Compact Grid', desc: 'Smaller cards', icon: Columns3 },
];

export const ACCENT_COLORS: { id: AccentColor; label: string; swatchClass: string }[] = [
  { id: 'teal', label: 'Teal', swatchClass: 'bg-[#14b8a6]' },
  { id: 'emerald', label: 'Green', swatchClass: 'bg-[#10b981]' },
  { id: 'indigo', label: 'Indigo', swatchClass: 'bg-[#6366f1]' },
  { id: 'sky', label: 'Sky Blue', swatchClass: 'bg-[#0ea5e9]' },
  { id: 'amber', label: 'Gold', swatchClass: 'bg-[#f59e0b]' },
  { id: 'rose', label: 'Rose Pink', swatchClass: 'bg-[#f43f5e]' },
  { id: 'violet', label: 'Purple', swatchClass: 'bg-[#8b5cf6]' },
];

export const TEXT_SIZES: { id: TextSize; label: string; scaleLabel: string }[] = [
  { id: 'sm', label: 'Small', scaleLabel: '14px' },
  { id: 'md', label: 'Normal', scaleLabel: '16px' },
  { id: 'lg', label: 'Large', scaleLabel: '18px' },
  { id: 'xl', label: 'Extra Large', scaleLabel: '20px' },
];

export const TEXT_FONT_STYLES: { id: TextFontStyle; label: string; sample: string; fontClass: string }[] = [
  { id: 'clean', label: 'Clean Modern', sample: 'Simple & clear', fontClass: "font-['Plus_Jakarta_Sans']" },
  { id: 'serif', label: 'Classic Book', sample: 'Warm & traditional', fontClass: "font-['Lora']" },
  { id: 'rounded', label: 'Soft Friendly', sample: 'Smooth & rounded', fontClass: "font-['Quicksand']" },
  { id: 'mono', label: 'Typewriter', sample: 'Crisp & structured', fontClass: 'font-mono' },
];

export const TEXT_COLOR_TONES: { id: TextColorTone; label: string; previewClass: string }[] = [
  { id: 'default', label: 'Crisp White / Ink', previewClass: 'bg-white' },
  { id: 'warm', label: 'Warm Cream', previewClass: 'bg-amber-200' },
  { id: 'mint', label: 'Soft Mint', previewClass: 'bg-emerald-200' },
  { id: 'sky', label: 'Calm Sky', previewClass: 'bg-sky-200' },
  { id: 'amber', label: 'Golden Honey', previewClass: 'bg-orange-200' },
  { id: 'rose', label: 'Soft Rose', previewClass: 'bg-rose-200' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  onCurrencyChange,
  appearance,
  onAppearanceChange,
  onDataReload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascent-habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage('Backup exported to your downloads.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = importAllData(content);
      setStatusMessage(res.message);
      if (res.success) {
        onDataReload();
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetDefaults = () => {
    resetAllDataToDefault();
    onDataReload();
    setConfirmingReset(false);
    setStatusMessage('All tracks and display preferences reset to starter defaults.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Display, Colour & Settings</h2>
            <p className="text-xs text-slate-400">
              Personalize your display theme, layout, colour palette, text size, and backups.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-between">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        <div className="space-y-6 mt-6">
          {/* 1. DISPLAY THEME & CARD LAYOUT */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <Monitor className="w-4 h-4" />
              <span>Display Mode & Layout</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Surface Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DISPLAY_THEMES.map(theme => {
                  const Icon = theme.icon;
                  const active = appearance.displayTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() =>
                        onAppearanceChange({ ...appearance, displayTheme: theme.id })
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        active
                          ? 'border-teal-400 bg-teal-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">{theme.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{theme.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Tracker Card Display
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {LAYOUT_OPTIONS.map(layout => {
                  const Icon = layout.icon;
                  const active = appearance.layoutDisplay === layout.id;
                  return (
                    <button
                      key={layout.id}
                      onClick={() =>
                        onAppearanceChange({ ...appearance, layoutDisplay: layout.id })
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        active
                          ? 'border-teal-400 bg-teal-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">{layout.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{layout.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. ACCENT COLOUR, BRIGHTNESS & COLOUR INTENSITY */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>Accent Colour, Brightness & Intensity</span>
              </div>
              {(appearance.brightnessLevel !== 100 || appearance.colorIntensity !== 100) && (
                <button
                  onClick={() =>
                    onAppearanceChange({
                      ...appearance,
                      brightnessLevel: 100,
                      colorIntensity: 100,
                    })
                  }
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
                >
                  Reset Levels (100%)
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ACCENT_COLORS.map(col => {
                const active = appearance.accentColor === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() =>
                      onAppearanceChange({ ...appearance, accentColor: col.id })
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${col.swatchClass} shrink-0 shadow-sm`} />
                      <span>{col.label}</span>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* App Brightness & Colour Intensity Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
              {/* App Brightness Level Adjuster */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>App Brightness Level</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-400 tabular-nums">
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
                    onAppearanceChange({
                      ...appearance,
                      brightnessLevel: Number(e.target.value),
                    })
                  }
                  className="w-full accent-teal-400 cursor-pointer"
                  aria-label="App Brightness Level"
                />

                <div className="flex items-center justify-between gap-1">
                  {[
                    { label: 'Dim (70%)', val: 70 },
                    { label: 'Normal (100%)', val: 100 },
                    { label: 'Bright (120%)', val: 120 },
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() =>
                        onAppearanceChange({
                          ...appearance,
                          brightnessLevel: preset.val,
                        })
                      }
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        (appearance.brightnessLevel ?? 100) === preset.val
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colour Intensity Adjuster */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Colour Intensity</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-400 tabular-nums">
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
                    onAppearanceChange({
                      ...appearance,
                      colorIntensity: Number(e.target.value),
                    })
                  }
                  className="w-full accent-teal-400 cursor-pointer"
                  aria-label="Colour Intensity"
                />

                <div className="flex items-center justify-between gap-1">
                  {[
                    { label: 'Muted (50%)', val: 50 },
                    { label: 'Natural (100%)', val: 100 },
                    { label: 'Vivid (140%)', val: 140 },
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() =>
                        onAppearanceChange({
                          ...appearance,
                          colorIntensity: preset.val,
                        })
                      }
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        (appearance.colorIntensity ?? 100) === preset.val
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. TEXT DESIGN, TEXT COLOUR & TEXT SIZE */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Type className="w-4 h-4" />
                <span>Text Design, Text Colour & Size</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Size: {TEXT_SIZES.find(t => t.id === appearance.textSize)?.scaleLabel}
              </span>
            </div>

            {/* Text Design (Font Style) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Text Design (Font Style)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TEXT_FONT_STYLES.map(font => {
                  const active = (appearance.fontStyle || 'clean') === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() =>
                        onAppearanceChange({ ...appearance, fontStyle: font.id })
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className={`text-sm font-semibold ${font.fontClass}`}>
                        {font.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{font.sample}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Colour */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Text Colour Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TEXT_COLOR_TONES.map(tone => {
                  const active = (appearance.textColor || 'default') === tone.id;
                  return (
                    <button
                      key={tone.id}
                      onClick={() =>
                        onAppearanceChange({ ...appearance, textColor: tone.id })
                      }
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                        active
                          ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${tone.previewClass} border border-slate-700 shrink-0`} />
                      <span>{tone.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Text Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TEXT_SIZES.map(sz => {
                  const active = appearance.textSize === sz.id;
                  return (
                    <button
                      key={sz.id}
                      onClick={() =>
                        onAppearanceChange({ ...appearance, textSize: sz.id })
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-semibold">{sz.label}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {sz.scaleLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Currency setting */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Currency Symbol for Savings Calculations
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CURRENCIES.map(c => (
                <button
                  key={c.symbol}
                  onClick={() => {
                    setCurrencySymbol(c.symbol);
                    onCurrencyChange(c.symbol);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                    currencySymbol === c.symbol
                      ? 'border-teal-400 text-teal-300 bg-teal-500/10 font-bold'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Pledge Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">100% Private & Local:</strong> Addiction recovery and
              sensitive habits belong solely to you. All sobriety timers, urge journals, and
              display preferences are kept on your device in local storage.
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Data Backup & Portability
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span>Export Data (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" />
                <span>Import Data (JSON)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white">Reset to Starter Data</div>
              <div className="text-[11px] text-slate-500">Restore default habits & display settings</div>
            </div>

            {confirmingReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmingReset(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingReset(true)}
                className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

