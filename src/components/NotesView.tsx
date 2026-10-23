import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Sparkles,
  Download,
  Copy,
  Check,
  Tag,
  CheckCircle2,
  Edit3,
  BookOpen,
  Calendar,
  Bot
} from 'lucide-react';
import {
  DocumentationNote,
  Habit,
  MoodLevel,
  NoteCategory
} from '../types/habit';

interface NotesViewProps {
  notes: DocumentationNote[];
  habits: Habit[];
  onSaveNotes: (updated: DocumentationNote[]) => void;
  initialHabitId?: string;
  onOpenAIChatWithPrompt?: (prompt: string) => void;
}

export const NOTE_CATEGORIES: {
  id: NoteCategory;
  label: string;
  badgeColor: string;
  description: string;
}[] = [
  {
    id: 'daily_log',
    label: 'Daily Progress Note',
    badgeColor: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
    description: 'How today went, wins, and energy levels',
  },
  {
    id: 'craving_trigger',
    label: 'Craving & Trigger Record',
    badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    description: 'What caused an urge and how you handled it',
  },
  {
    id: 'workout_meal',
    label: 'Exercise & Meal Log',
    badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    description: 'Workout weights, body feel, and healthy meals',
  },
  {
    id: 'doctor_therapy',
    label: 'Doctor / Counselor Notes',
    badgeColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    description: 'Questions, check-up notes, and advice to remember',
  },
  {
    id: 'milestone_win',
    label: 'My Why & Milestones',
    badgeColor: 'text-violet-300 bg-violet-500/15 border-violet-500/30',
    description: 'Personal pledges, proud moments, and big wins',
  },
  {
    id: 'general',
    label: 'General Documentation',
    badgeColor: 'text-slate-300 bg-slate-800 border-slate-700',
    description: 'Any personal thoughts, ideas, or checklists',
  },
];

const QUICK_TEMPLATES: {
  title: string;
  category: NoteCategory;
  mood: MoodLevel;
  tags: string[];
  content: string;
  actionSteps: string[];
}[] = [
  {
    title: 'Daily Check-In & Wins Log',
    category: 'daily_log',
    mood: 'good',
    tags: ['daily-log', 'gratitude'],
    content:
      'What went well today:\n- Showed up for my main habits and drank plenty of water.\n\nHow my body and mind felt:\n- Energy was steady in the morning; felt a little tired around 4 PM.\n\nOne thing I am proud of today:\n- Kept my promise to myself.',
    actionSteps: [
      'Prep water glass and morning plan tonight',
      'Get to bed 20 minutes earlier tonight',
    ],
  },
  {
    title: 'Craving & Trigger Documentation',
    category: 'craving_trigger',
    mood: 'okay',
    tags: ['trigger-log', 'craving-reset'],
    content:
      'Time & Place the urge happened:\n- Evening on the couch after a long workday.\n\nWhat triggered it (Stress, Boredom, Tired, Social):\n- Feeling mentally tired and looking for an easy distraction.\n\nWhat I did instead:\n- Drank a cold glass of water and waited 10 minutes before reacting.',
    actionSteps: [
      'Use the 3-Minute Calm SOS breathing timer when stressed',
      'Replace evening scrolling/snacking with herbal tea',
    ],
  },
  {
    title: 'Doctor / Counselor Visit Summary',
    category: 'doctor_therapy',
    mood: 'good',
    tags: ['check-up', 'health-docs'],
    content:
      'Main topics we talked about:\n- Sleep quality, daily stress levels, and progress cutting back on bad habits.\n\nKey advice or instructions to follow:\n- Keep walking 20–25 minutes outdoors in morning daylight and eating protein first thing.',
    actionSteps: [
      'Bring my 30-day habit streak summary to next appointment',
      'Keep tracking sleep and afternoon energy levels',
    ],
  },
  {
    title: 'Workout & Healthy Meals Note',
    category: 'workout_meal',
    mood: 'great',
    tags: ['exercise-log', 'meal-prep'],
    content:
      'Exercises completed today:\n- Slow Chest-Hold Squats, Hip Hinge Bends, and Supported Rows.\n\nHow my joints and muscles felt:\n- Posture felt much taller and lower back felt strong.\n\nMeals that kept me full and energized:\n- High-protein breakfast + big midday bowl.',
    actionSteps: [
      'Drink 8 glasses of water tomorrow',
      'Add 2 extra reps on squats next session',
    ],
  },
];

const MOOD_OPTIONS: { id: MoodLevel; label: string; emoji: string; colorClass: string }[] = [
  { id: 'great', label: 'Feeling Great', emoji: '🌟', colorClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { id: 'good', label: 'Good & Steady', emoji: '🙂', colorClass: 'border-teal-500/40 bg-teal-500/10 text-teal-300' },
  { id: 'okay', label: 'Getting By', emoji: '😐', colorClass: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { id: 'tough', label: 'Tough Day', emoji: '🌧️', colorClass: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
];

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  habits,
  onSaveNotes,
  initialHabitId,
  onOpenAIChatWithPrompt,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<NoteCategory | 'all'>('all');
  const [filterHabitId, setFilterHabitId] = useState<string>(initialHabitId || 'all');

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<NoteCategory>('daily_log');
  const [editLinkedHabitId, setEditLinkedHabitId] = useState<string>('');
  const [editMood, setEditMood] = useState<MoodLevel>('good');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editActionSteps, setEditActionSteps] = useState<string[]>([]);
  const [newActionStep, setNewActionStep] = useState('');

  // AI Polish state
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSummaryBanner, setAiSummaryBanner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0] || null;

  const filteredNotes = notes
    .filter(n => {
      if (filterCategory !== 'all' && n.category !== filterCategory) return false;
      if (filterHabitId !== 'all' && n.linkedHabitId !== filterHabitId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchTag = n.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTag) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  const startNewNote = (template?: typeof QUICK_TEMPLATES[0]) => {
    const now = new Date().toISOString();
    const newNote: DocumentationNote = {
      id: `note-${Date.now()}`,
      title: template ? template.title : 'New Personal Note',
      content: template ? template.content : '',
      category: template ? template.category : 'daily_log',
      linkedHabitId: filterHabitId !== 'all' ? filterHabitId : undefined,
      mood: template ? template.mood : 'good',
      tags: template ? [...template.tags] : ['daily-note'],
      pinned: false,
      actionSteps: template ? [...template.actionSteps] : [],
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newNote, ...notes];
    onSaveNotes(updated);
    setSelectedNoteId(newNote.id);
    openEditorForNote(newNote);
  };

  const openEditorForNote = (note: DocumentationNote) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
    setEditLinkedHabitId(note.linkedHabitId || '');
    setEditMood(note.mood || 'good');
    setEditTagsInput(note.tags.join(', '));
    setEditActionSteps(note.actionSteps || []);
    setAiSummaryBanner(null);
    setIsEditing(true);
  };

  const handleSaveCurrentEdit = () => {
    if (!activeNote) return;
    const parsedTags = editTagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedNote: DocumentationNote = {
      ...activeNote,
      title: editTitle.trim() || 'Untitled Note',
      content: editContent,
      category: editCategory,
      linkedHabitId: editLinkedHabitId || undefined,
      mood: editMood,
      tags: parsedTags.length > 0 ? parsedTags : ['note'],
      actionSteps: editActionSteps,
      updatedAt: new Date().toISOString(),
    };

    const nextNotes = notes.map(n => (n.id === activeNote.id ? updatedNote : n));
    onSaveNotes(nextNotes);
    setIsEditing(false);
  };

  const handleTogglePin = (noteId: string) => {
    const nextNotes = notes.map(n =>
      n.id === noteId ? { ...n, pinned: !n.pinned } : n
    );
    onSaveNotes(nextNotes);
  };

  const handleDeleteNote = (noteId: string) => {
    const remaining = notes.filter(n => n.id !== noteId);
    onSaveNotes(remaining);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(remaining[0]?.id || '');
      setIsEditing(false);
    }
  };

  const handleAddActionStep = () => {
    if (!newActionStep.trim()) return;
    setEditActionSteps([...editActionSteps, newActionStep.trim()]);
    setNewActionStep('');
  };

  const handleRemoveActionStep = (idx: number) => {
    setEditActionSteps(editActionSteps.filter((_, i) => i !== idx));
  };

  const handleRunAINoteHelper = async () => {
    const targetTitle = isEditing ? editTitle : activeNote?.title || '';
    const targetContent = isEditing ? editContent : activeNote?.content || '';
    const targetCategory = isEditing ? editCategory : activeNote?.category || 'daily_log';

    if (!targetContent.trim()) return;
    setIsAILoading(true);
    setAiSummaryBanner(null);

    try {
      const response = await fetch('/api/ai/note-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetTitle,
          content: targetContent,
          category: targetCategory,
        }),
      });
      const data = await response.json();
      if (data.summary) {
        setAiSummaryBanner(data.summary);
      }
      if (Array.isArray(data.actionSteps) && data.actionSteps.length > 0) {
        if (isEditing) {
          const merged = Array.from(new Set([...editActionSteps, ...data.actionSteps]));
          setEditActionSteps(merged);
        } else if (activeNote) {
          const merged = Array.from(
            new Set([...(activeNote.actionSteps || []), ...data.actionSteps])
          );
          const updated = notes.map(n =>
            n.id === activeNote.id
              ? { ...n, actionSteps: merged, updatedAt: new Date().toISOString() }
              : n
          );
          onSaveNotes(updated);
        }
      }
    } catch {
      setAiSummaryBanner('Added helpful action steps based on your note!');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleCopyNote = (note: DocumentationNote) => {
    const text = `${note.title}\nDate: ${new Date(note.updatedAt).toLocaleDateString()}\nCategory: ${note.category}\n\n${note.content}\n\nAction Steps:\n${(note.actionSteps || []).map(s => `- ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAllNotes = () => {
    const lines = [
      '# ASCENT PERSONAL DOCUMENTATION & RECOVERY NOTES',
      `Exported on: ${new Date().toLocaleString()}`,
      `Total Notes: ${notes.length}`,
      '================================================\n',
    ];

    notes.forEach((n, idx) => {
      const cat = NOTE_CATEGORIES.find(c => c.id === n.category)?.label || n.category;
      const linkedHabit = habits.find(h => h.id === n.linkedHabitId)?.title;
      lines.push(`## ${idx + 1}. ${n.title}${n.pinned ? ' [PINNED]' : ''}`);
      lines.push(`- Topic: ${cat}`);
      lines.push(`- Last Updated: ${new Date(n.updatedAt).toLocaleString()}`);
      if (linkedHabit) lines.push(`- Linked Habit: ${linkedHabit}`);
      if (n.mood) lines.push(`- Mood: ${n.mood.toUpperCase()}`);
      if (n.tags.length > 0) lines.push(`- Tags: ${n.tags.join(', ')}`);
      lines.push('\n' + n.content + '\n');
      if (n.actionSteps && n.actionSteps.length > 0) {
        lines.push('Action Steps & Reminders:');
        n.actionSteps.forEach(s => lines.push(`  [ ] ${s}`));
        lines.push('');
      }
      lines.push('------------------------------------------------\n');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascent-documentation-notes-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="studio-card rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-l-2 border-l-teal-400">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-teal-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Personal Documentation & Recovery Notes</span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl text-white mt-1">
            My Notes & Documentation Book
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Keep all your daily reflections, craving triggers, workout logs, and doctor or counselor notes organized in one private place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => startNewNote()}
            className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Write New Note</span>
          </button>

          <button
            onClick={handleExportAllNotes}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download all notes as a clean document file"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Download All Notes (.md)</span>
          </button>
        </div>
      </div>

      {/* 1-Click Note Templates Strip */}
      <div className="studio-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Quick Start Templates (Click to Create)
          </span>
          <span className="text-[11px] text-slate-500">
            Pre-filled outlines in simple everyday words
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {QUICK_TEMPLATES.map((tpl, idx) => {
            const catMeta = NOTE_CATEGORIES.find(c => c.id === tpl.category);
            return (
              <button
                key={idx}
                onClick={() => startNewNote(tpl)}
                className="p-3 rounded-lg bg-slate-950/70 hover:bg-slate-900 border border-slate-800/90 hover:border-teal-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                    {catMeta?.label}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                </div>
                <div className="text-xs font-semibold text-white mt-1 truncate">
                  {tpl.title}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {tpl.content.replace(/\n/g, ' ')}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Documentation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 5 COLUMNS: Search, Filters & Note List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="studio-card rounded-xl p-4 space-y-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your notes, triggers, or tags..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Category & Linked Habit Filters */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value as NoteCategory | 'all')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-teal-400"
                aria-label="Filter by note topic"
              >
                <option value="all">All Note Topics ({notes.length})</option>
                {NOTE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={filterHabitId}
                onChange={e => setFilterHabitId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-teal-400"
                aria-label="Filter by linked habit"
              >
                <option value="all">All Linked Habits</option>
                {habits
                  .filter(h => !h.archived)
                  .map(h => (
                    <option key={h.id} value={h.id}>
                      {h.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2.5">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => {
                const isSelected = activeNote?.id === note.id;
                const catMeta = NOTE_CATEGORIES.find(c => c.id === note.category);
                const moodMeta = MOOD_OPTIONS.find(m => m.id === note.mood);
                const linkedHabit = habits.find(h => h.id === note.linkedHabitId);

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsEditing(false);
                      setAiSummaryBanner(null);
                    }}
                    className={`studio-card rounded-xl p-4 cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-teal-400 bg-slate-900/95'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {catMeta && (
                          <span
                            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${catMeta.badgeColor}`}
                          >
                            {catMeta.label}
                          </span>
                        )}
                        {moodMeta && (
                          <span className="text-xs" title={moodMeta.label}>
                            {moodMeta.emoji}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleTogglePin(note.id);
                          }}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            note.pinned
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={note.pinned ? 'Pinned note' : 'Pin note to top'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white mt-2 leading-snug">
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {note.content || 'Empty note — click to write...'}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      {linkedHabit ? (
                        <span className="text-teal-400 truncate max-w-[160px]">
                          Linked: {linkedHabit.title}
                        </span>
                      ) : (
                        <span>{(note.actionSteps || []).length} action steps</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="studio-card rounded-xl p-8 text-center">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-3">
                  No documentation notes match this filter yet.
                </p>
                <button
                  onClick={() => startNewNote()}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  Write Your First Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 7 COLUMNS: Note Reader & Editor */}
        <div className="lg:col-span-7">
          {activeNote ? (
            <div className="studio-card rounded-xl p-6 space-y-5">
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => openEditorForNote(activeNote)}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Note</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveCurrentEdit}
                        className="px-4 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleRunAINoteHelper}
                    disabled={isAILoading}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Let AI summarize this note and create practical action steps"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isAILoading ? 'Organizing...' : 'AI Summarize & Add Steps'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {onOpenAIChatWithPrompt && (
                    <button
                      onClick={() =>
                        onOpenAIChatWithPrompt(
                          `Can you review my note titled "${activeNote.title}" and give me friendly advice? Here is what I wrote: ${activeNote.content}`
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Discuss this note with your AI Coach"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ask AI Coach</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyNote(activeNote)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                    title="Copy note text"
                  >
                    {copiedId === activeNote.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Optional AI Summary Banner */}
              {aiSummaryBanner && (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-200 leading-relaxed">
                    <strong className="text-white block mb-0.5">AI Coach Note Summary:</strong>
                    {aiSummaryBanner}
                  </div>
                </div>
              )}

              {/* EDIT MODE */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Note Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-teal-400"
                      placeholder="Give your note a clear title..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Topic / Folder
                      </label>
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value as NoteCategory)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                      >
                        {NOTE_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Link to a Habit (Optional)
                      </label>
                      <select
                        value={editLinkedHabitId}
                        onChange={e => setEditLinkedHabitId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                      >
                        <option value="">No specific habit linked</option>
                        {habits
                          .filter(h => !h.archived)
                          .map(h => (
                            <option key={h.id} value={h.id}>
                              {h.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Mood Selector */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      How Were You Feeling?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MOOD_OPTIONS.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setEditMood(m.id)}
                          className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editMood === m.id
                              ? m.colorClass
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{m.emoji}</span>
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Documentation Textarea */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Your Notes & Documentation
                    </label>
                    <textarea
                      rows={8}
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      placeholder="Write freely in simple words—what happened today, what triggered a craving, workout weights, or questions for your doctor..."
                      className="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 leading-relaxed focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  {/* Action Steps / Next Steps List */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Action Steps & Reminders
                    </label>
                    <div className="space-y-2 mb-2">
                      {editActionSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                        >
                          <span>• {step}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveActionStep(idx)}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActionStep}
                        onChange={e => setNewActionStep(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddActionStep();
                          }
                        }}
                        placeholder="Add a simple action step (e.g., Drink water at 4 PM)..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddActionStep}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white cursor-pointer"
                      >
                        + Add Step
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editTagsInput}
                      onChange={e => setEditTagsInput(e.target.value)}
                      placeholder="morning-routine, craving-log, workout..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              ) : (
                /* READ MODE */
                <div className="space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {(() => {
                        const cat = NOTE_CATEGORIES.find(c => c.id === activeNote.category);
                        return cat ? (
                          <span
                            className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border ${cat.badgeColor}`}
                          >
                            {cat.label}
                          </span>
                        ) : null;
                      })()}
                      {(() => {
                        const mood = MOOD_OPTIONS.find(m => m.id === activeNote.mood);
                        return mood ? (
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded border ${mood.colorClass}`}
                          >
                            {mood.emoji} {mood.label}
                          </span>
                        ) : null;
                      })()}
                      {activeNote.linkedHabitId && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300">
                          Habit: {habits.find(h => h.id === activeNote.linkedHabitId)?.title}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif-editorial text-2xl text-white">
                      {activeNote.title}
                    </h2>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      Last updated {new Date(activeNote.updatedAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Note Body */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                    {activeNote.content || 'No content written yet. Click "Edit Note" above to start writing.'}
                  </div>

                  {/* Action Steps Box */}
                  {activeNote.actionSteps && activeNote.actionSteps.length > 0 && (
                    <div className="p-4 rounded-xl bg-teal-500/[0.06] border border-teal-500/25 space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Action Steps & Takeaways</span>
                      </div>
                      <ul className="space-y-1.5">
                        {activeNote.actionSteps.map((step, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-200 flex items-start gap-2"
                          >
                            <span className="text-teal-400 font-mono">→</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags Footer */}
                  {activeNote.tags && activeNote.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/70">
                      <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                      {activeNote.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
