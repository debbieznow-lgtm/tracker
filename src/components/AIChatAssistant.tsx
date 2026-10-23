import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  BookmarkPlus,
  Check,
  Trash2,
  MessageSquareHeart,
  Minimize2,
  Maximize2
} from 'lucide-react';
import {
  AIChatMessage,
  DocumentationNote,
  EatingPlan,
  ExercisePlan,
  Habit,
  UserProfile
} from '../types/habit';
import { getCleanTimeBreakdown } from '../utils/storage';

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  messages: AIChatMessage[];
  onUpdateMessages: (messages: AIChatMessage[]) => void;
  userProfile: UserProfile;
  habits: Habit[];
  notes: DocumentationNote[];
  activeExercisePlan: ExercisePlan;
  activeEatingPlan: EatingPlan;
  currencySymbol: string;
  onSaveReplyToNotes: (title: string, content: string, actionSteps?: string[]) => void;
  pendingPrompt?: string | null;
  onClearPendingPrompt?: () => void;
}

const STARTER_PROMPTS = [
  'Help me beat a craving right now',
  'Suggest a quick 5-minute exercise I can do at home',
  'What should I eat today to stop sugar cravings?',
  'Review my streaks and give me a pep talk',
  'Help me write a daily progress note',
];

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  isOpen,
  onClose,
  onOpen,
  messages,
  onUpdateMessages,
  userProfile,
  habits,
  notes,
  activeExercisePlan,
  activeEatingPlan,
  currencySymbol,
  onSaveReplyToNotes,
  pendingPrompt,
  onClearPendingPrompt,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedMsgId, setSavedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeHabits = habits.filter(h => !h.archived);
  const quitHabits = activeHabits.filter(h => h.type === 'quit');

  const totals = quitHabits.reduce(
    (acc, h) => {
      const b = getCleanTimeBreakdown(h);
      return {
        money: acc.money + b.moneySaved,
        hours: acc.hours + Math.round(b.hoursReclaimed),
      };
    },
    { money: 0, hours: 0 }
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && pendingPrompt) {
      handleSendMessage(pendingPrompt);
      if (onClearPendingPrompt) onClearPendingPrompt();
    }
  }, [isOpen, pendingPrompt]);

  const buildUserContext = () => {
    const habitsSummary = activeHabits
      .map(h => {
        if (h.type === 'quit') {
          const st = getCleanTimeBreakdown(h);
          return `${h.title} (${st.days} days clean)`;
        }
        return `${h.title} (Daily habit)`;
      })
      .join(', ');

    const recentNotesSummary = notes
      .slice(0, 3)
      .map(n => `${n.title}: ${n.content.slice(0, 80)}`)
      .join(' | ');

    return {
      userName: userProfile.displayName,
      habitsSummary,
      moneySaved: `${currencySymbol}${totals.money.toFixed(0)}`,
      hoursSaved: totals.hours,
      activeExercisePlan: activeExercisePlan.title,
      activeEatingPlan: activeEatingPlan.title,
      recentNotesSummary,
    };
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    const updatedWithUser = [...messages, userMsg];
    onUpdateMessages(updatedWithUser);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedWithUser.slice(-6),
          userContext: buildUserContext(),
        }),
      });

      const data = await response.json();
      const assistantMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text:
          data.reply ||
          'I am right here with you! Take a slow breath, drink a glass of water, and focus on just the next 5 minutes.',
        timestamp: new Date().toISOString(),
        suggestedActions: Array.isArray(data.suggestedActions)
          ? data.suggestedActions
          : undefined,
      };

      onUpdateMessages([...updatedWithUser, assistantMsg]);
    } catch {
      const fallbackMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: `I'm here with you, ${userProfile.displayName.split(' ')[0]}! Remember: cravings only last a few minutes. Drink a glass of cold water, stretch your shoulders, and check off one easy step on your Today list.`,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          'Drink 1 glass of water',
          'Take 3 slow deep breaths',
          'Write a quick note in Notes & Docs',
        ],
      };
      onUpdateMessages([...updatedWithUser, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMessageAsNote = (msg: AIChatMessage) => {
    onSaveReplyToNotes(
      `AI Coach Advice · ${new Date(msg.timestamp).toLocaleDateString()}`,
      msg.text,
      msg.suggestedActions
    );
    setSavedMsgId(msg.id);
    const updated = messages.map(m =>
      m.id === msg.id ? { ...m, savedToNotes: true } : m
    );
    onUpdateMessages(updated);
    setTimeout(() => setSavedMsgId(null), 2500);
  };

  const handleClearChat = () => {
    onUpdateMessages([]);
  };

  return (
    <>
      {/* Floating Quick-Open Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-16 md:bottom-6 right-5 z-40 px-4 py-3 rounded-full bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-slate-950"
          title="Chat with your Ascent AI Coach"
        >
          <MessageSquareHeart className="w-4 h-4 stroke-[2.5]" />
          <span>Ask AI Coach</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
        </button>
      )}

      {/* Slide-Over / Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div
            className={`relative w-full ${
              isExpanded ? 'max-w-3xl' : 'max-w-md'
            } bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl transition-all`}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white">
                      Ascent AI Coach
                    </h2>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      Online 24/7
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Friendly advice for cravings, workouts, meals & notes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Clear conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isExpanded ? 'Compact width' : 'Expand width'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close AI Coach"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Summary Pill Strip */}
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>
                Tracking <strong className="text-slate-200">{activeHabits.length}</strong> habits
              </span>
              <span>·</span>
              <span>
                Saved <strong className="text-emerald-400">{currencySymbol}{totals.money.toFixed(0)}</strong>
              </span>
              <span>·</span>
              <span>
                <strong className="text-teal-400">{notes.length}</strong> saved notes
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Hi {userProfile.displayName.split(' ')[0]}! How can I help you today?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I know your active habits, your clean streaks, and your{' '}
                  <strong className="text-white">{activeExercisePlan.title}</strong> &{' '}
                  <strong className="text-white">{activeEatingPlan.title}</strong> plans. Ask me anything in simple words, or tap a quick topic below:
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isLoading}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-teal-500/15 text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation History */}
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-400 text-slate-950 font-medium rounded-br-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Suggested Actions from AI */}
                    {msg.role === 'assistant' &&
                      msg.suggestedActions &&
                      msg.suggestedActions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                            Quick Action Steps:
                          </div>
                          {msg.suggestedActions.map((act, i) => (
                            <div
                              key={i}
                              className="text-xs text-slate-300 flex items-start gap-1.5"
                            >
                              <span className="text-teal-400 font-mono">✓</span>
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Save AI Reply to Documentation Notes */}
                    {msg.role === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <button
                          onClick={() => handleSaveMessageAsNote(msg)}
                          className="text-[11px] font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                        >
                          {savedMsgId === msg.id || msg.savedToNotes ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Saved to Notes!</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span>Save to My Notes</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-xl bg-slate-900/60 border border-slate-800 w-fit">
                  <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                  <span>Ascent AI Coach is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about cravings, exercises, meals, or notes..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
