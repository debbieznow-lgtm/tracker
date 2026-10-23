import React, { useState, useRef } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Send,
  Plus,
  Check,
  Edit3,
  Camera,
  Image as ImageIcon,
  Lock,
  Crown,
  X,
  Copy,
  ExternalLink,
  Shield,
  Smile
} from 'lucide-react';
import {
  CommunityCircle,
  CommunityPost,
  DMConversation,
  DirectMessage,
  Habit,
  StickerItem,
  UserProfile,
  UserSubscription
} from '../types/habit';
import {
  COMMUNITY_CIRCLES,
  PROGRESS_PHOTO_PRESETS,
  getDMConversations,
  saveDMConversations
} from '../utils/storage';
import { CuteAvatar } from './AvatarGallery';
import { EmojiStickerPicker } from './EmojiStickerPicker';
import confetti from 'canvas-confetti';

interface CommunityHubProps {
  profile: UserProfile;
  habits: Habit[];
  posts: CommunityPost[];
  subscription: UserSubscription;
  selectedCircleId?: string;
  onSelectCircleId: (id: string | undefined) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdatePosts: (posts: CommunityPost[]) => void;
  onAdoptRoutine: (
    circle: CommunityCircle,
    routine: { title: string; timing: string; description: string }
  ) => void;
  onOpenProfileModal: () => void;
  onNavigateToPricing: () => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  profile,
  habits,
  posts,
  subscription,
  selectedCircleId,
  onSelectCircleId,
  onUpdateProfile,
  onUpdatePosts,
  onAdoptRoutine,
  onOpenProfileModal,
  onNavigateToPricing,
}) => {
  const [activeCircleTab, setActiveCircleTab] = useState<string>(selectedCircleId || 'all');
  const [viewSection, setViewSection] = useState<'feed' | 'messages'>('feed');

  // Post Composer State
  const [newPostText, setNewPostText] = useState('');
  const [newPostCircle, setNewPostCircle] = useState<string>('eating');
  const [newPostRoutine, setNewPostRoutine] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | undefined>(undefined);
  const [newPostImageCaption, setNewPostImageCaption] = useState('');
  const [newPostSticker, setNewPostSticker] = useState<StickerItem | null>(null);
  const [showPhotoPresets, setShowPhotoPresets] = useState(false);
  const [showPostEmojiPicker, setShowPostEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Comments & Routine Adoption
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentStickers, setCommentStickers] = useState<Record<string, StickerItem | null>>({});
  const [activeCommentPickerPostId, setActiveCommentPickerPostId] = useState<string | null>(null);
  const [adoptedRoutines, setAdoptedRoutines] = useState<Record<string, boolean>>({});
  const [expandedImagePost, setExpandedImagePost] = useState<CommunityPost | null>(null);

  // WhatsApp & Telegram Optional Support Modal
  const [channelModal, setChannelModal] = useState<{
    platform: 'whatsapp' | 'telegram';
    circle: CommunityCircle;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Direct Messaging (DM) State
  const [conversations, setConversations] = useState<DMConversation[]>(() =>
    getDMConversations()
  );
  const [activeConversationId, setActiveConversationId] = useState<string>(
    () => getDMConversations()[0]?.id || 'dm-maya'
  );
  const [dmInputText, setDmInputText] = useState('');
  const [dmSticker, setDmSticker] = useState<StickerItem | null>(null);
  const [showDmEmojiPicker, setShowDmEmojiPicker] = useState(false);

  React.useEffect(() => {
    if (selectedCircleId) {
      setActiveCircleTab(selectedCircleId);
      setNewPostCircle(selectedCircleId);
    }
  }, [selectedCircleId]);

  const isHighestPlan = subscription.tierId === 'mastery' && subscription.active;
  const isDmEnabled = profile.dmEnabled !== false;

  const totalUnreadDMs = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const handleSelectCircle = (id: string) => {
    setActiveCircleTab(id);
    if (id !== 'all') {
      setNewPostCircle(id);
      onSelectCircleId(id);
    } else {
      onSelectCircleId(undefined);
    }
  };

  const handleToggleJoinCircle = (circleId: string) => {
    const joined = profile.joinedCircles.includes(circleId);
    const updatedCircles = joined
      ? profile.joinedCircles.filter(id => id !== circleId)
      : [...profile.joinedCircles, circleId];
    onUpdateProfile({
      ...profile,
      joinedCircles: updatedCircles,
    });
  };

  const handleToggleWhatsAppCircle = (circleId: string) => {
    const current = profile.joinedWhatsAppCircles || [];
    const exists = current.includes(circleId);
    const next = exists ? current.filter(id => id !== circleId) : [...current, circleId];
    onUpdateProfile({
      ...profile,
      joinedWhatsAppCircles: next,
    });
  };

  const handleToggleTelegramCircle = (circleId: string) => {
    const current = profile.joinedTelegramCircles || [];
    const exists = current.includes(circleId);
    const next = exists ? current.filter(id => id !== circleId) : [...current, circleId];
    onUpdateProfile({
      ...profile,
      joinedTelegramCircles: next,
    });
  };

  const handleToggleDmEnabled = () => {
    onUpdateProfile({
      ...profile,
      dmEnabled: !isDmEnabled,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPostImage(reader.result);
        if (!newPostImageCaption) {
          setNewPostImageCaption('My daily progress snapshot');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImage && !newPostSticker) return;

    confetti({
      particleCount: 22,
      spread: 50,
      origin: { y: 0.75 },
    });

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      circleId: newPostCircle,
      authorName: profile.displayName,
      authorHandle: profile.handle,
      authorAvatarId: profile.avatarId,
      authorAuraColor: profile.auraColor,
      authorBadge: profile.titleBadge,
      streakDays: 14,
      content:
        newPostText.trim() ||
        (newPostSticker ? `Shared sticker: ${newPostSticker.label}` : 'Sharing a progress picture from today!'),
      routineShared: newPostRoutine.trim() || undefined,
      imageUrl: newPostImage,
      imageCaption: newPostImage ? newPostImageCaption.trim() || 'Progress Snapshot' : undefined,
      stickerUrl: newPostSticker?.imageUrl,
      stickerLabel: newPostSticker?.label,
      timestamp: new Date().toISOString(),
      cheersCount: 1,
      cheeredByMe: true,
      comments: [],
    };

    onUpdatePosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostRoutine('');
    setNewPostImage(undefined);
    setNewPostImageCaption('');
    setNewPostSticker(null);
    setShowPhotoPresets(false);
    setShowPostEmojiPicker(false);
  };

  const handleToggleCheer = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      const nextCheered = !p.cheeredByMe;
      return {
        ...p,
        cheeredByMe: nextCheered,
        cheersCount: nextCheered ? p.cheersCount + 1 : Math.max(0, p.cheersCount - 1),
      };
    });
    onUpdatePosts(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    const attachedSticker = commentStickers[postId];
    if (!text && !attachedSticker) return;

    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [
          ...p.comments,
          {
            id: `c-${Date.now()}`,
            authorName: profile.displayName,
            authorAvatarId: profile.avatarId,
            authorAuraColor: profile.auraColor,
            text: text || (attachedSticker ? attachedSticker.label : ''),
            stickerUrl: attachedSticker?.imageUrl,
            stickerLabel: attachedSticker?.label,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    });

    onUpdatePosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setCommentStickers(prev => ({ ...prev, [postId]: null }));
    setActiveCommentPickerPostId(null);
  };

  const handleOpenDMWithAuthor = (post: CommunityPost) => {
    setViewSection('messages');
    if (!isHighestPlan || !isDmEnabled) return;

    const existing = conversations.find(
      c => c.peerHandle.toLowerCase() === post.authorHandle.toLowerCase()
    );
    if (existing) {
      const cleared = conversations.map(c =>
        c.id === existing.id ? { ...c, unreadCount: 0 } : c
      );
      setConversations(cleared);
      saveDMConversations(cleared);
      setActiveConversationId(existing.id);
      return;
    }

    const newConvo: DMConversation = {
      id: `dm-${Date.now()}`,
      peerName: post.authorName,
      peerHandle: post.authorHandle,
      peerAvatarId: post.authorAvatarId,
      peerAuraColor: post.authorAuraColor,
      peerBadge: post.authorBadge,
      peerCircleId: post.circleId,
      peerOnline: true,
      unreadCount: 0,
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          senderHandle: post.authorHandle,
          senderName: post.authorName,
          text: `Hi ${profile.displayName.split(' ')[0]}! Always happy to connect and support each other here.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const next = [newConvo, ...conversations];
    setConversations(next);
    saveDMConversations(next);
    setActiveConversationId(newConvo.id);
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!dmInputText.trim() && !dmSticker) || !isHighestPlan || !isDmEnabled) return;

    const activeConvo = conversations.find(c => c.id === activeConversationId);
    if (!activeConvo) return;

    const userMsg: DirectMessage = {
      id: `dm-msg-${Date.now()}`,
      senderHandle: '@me',
      senderName: profile.displayName,
      text: dmInputText.trim() || (dmSticker ? `Sent sticker: ${dmSticker.label}` : ''),
      stickerUrl: dmSticker?.imageUrl,
      stickerLabel: dmSticker?.label,
      timestamp: new Date().toISOString(),
    };

    const replyTemplates = [
      `Thank you for reaching out, ${profile.displayName.split(' ')[0]}! Let's stay consistent today—one small step at a time.`,
      `I completely relate! Stick to your evening routine tonight and message me tomorrow morning with how it went.`,
      `You've got this! Drinking a glass of water and doing a 5-minute walk always helps me reset when cravings hit.`,
    ];
    const autoReply: DirectMessage = {
      id: `dm-reply-${Date.now() + 1}`,
      senderHandle: activeConvo.peerHandle,
      senderName: activeConvo.peerName,
      text: replyTemplates[activeConvo.messages.length % replyTemplates.length],
      timestamp: new Date(Date.now() + 1000).toISOString(),
    };

    const updated = conversations.map(c =>
      c.id === activeConvo.id
        ? { ...c, unreadCount: 0, messages: [...c.messages, userMsg, autoReply] }
        : c
    );
    setConversations(updated);
    saveDMConversations(updated);
    setDmInputText('');
    setDmSticker(null);
    setShowDmEmojiPicker(false);
  };

  const filteredPosts =
    activeCircleTab === 'all' ? posts : posts.filter(p => p.circleId === activeCircleTab);

  const currentCircleObj = COMMUNITY_CIRCLES.find(c => c.id === activeCircleTab);
  const activeConversation =
    conversations.find(c => c.id === activeConversationId) || conversations[0];

  const formatTimeAgo = (iso: string) => {
    const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-7">
      {/* Header & Top Controls: Feed vs Direct Messages + DM On/Off Toggle */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-1.5">
            Peer Support & Accountability
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-white tracking-tight">
            Community Support Groups
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Share progress pictures, join optional WhatsApp & Telegram support groups, and message peers who are building the same healthy habits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Feed vs Direct Messages Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewSection('feed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewSection === 'feed'
                  ? 'bg-slate-100 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community Feed</span>
            </button>

            <button
              type="button"
              onClick={() => setViewSection('messages')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewSection === 'messages'
                  ? 'bg-slate-100 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Direct Messages</span>
              {!isHighestPlan ? (
                <Lock className="w-3 h-3 text-amber-400" />
              ) : (
                totalUnreadDMs > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-teal-500 text-slate-950 font-mono text-[10px] font-bold">
                    {totalUnreadDMs}
                  </span>
                )
              )}
            </button>
          </div>

          {/* Direct Message On/Off Privacy Toggle */}
          <button
            type="button"
            onClick={handleToggleDmEnabled}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              isDmEnabled
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Turn Direct Messaging ON or OFF anytime for privacy"
          >
            <Shield className={`w-3.5 h-3.5 ${isDmEnabled ? 'text-teal-400' : 'text-slate-500'}`} />
            <span>DMs:</span>
            <span
              className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                isDmEnabled
                  ? 'bg-teal-500/15 text-teal-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isDmEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <CuteAvatar avatarId={profile.avatarId} auraColor={profile.auraColor} size="sm" />
            <span className="hidden sm:inline">{profile.displayName.split(' ')[0]}</span>
            <Edit3 className="w-3.5 h-3.5 text-teal-400" />
          </button>
        </div>
      </div>

      {/* ==================== SECTION A: DIRECT MESSAGES (DM) ==================== */}
      {viewSection === 'messages' && (
        <div className="space-y-5">
          {/* Privacy & Plan Status Bar */}
          <div className="studio-card rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-teal-400">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-white">
                    1-on-1 Peer Direct Messaging
                  </h2>
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Mastery Plan Feature
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Message community members privately and receive support messages. You can turn DMs ON or OFF anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300">Allow Direct Messages:</span>
              <button
                type="button"
                onClick={handleToggleDmEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isDmEnabled
                    ? 'bg-teal-400 text-slate-950 border-teal-400'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {isDmEnabled ? 'ON (Active)' : 'OFF (Paused)'}
              </button>
            </div>
          </div>

          {/* Gate 1: If user is NOT on the Highest Plan ('mastery'), show Upgrade Gate */}
          {!isHighestPlan ? (
            <div className="studio-card rounded-xl p-8 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400">
                  Highest Plan Exclusive
                </span>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-white">
                  Unlock 1-on-1 Direct Messaging with Sanctuary Mastery
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Direct messaging is reserved for our highest plan (<strong className="text-slate-200">Sanctuary Mastery</strong>) to keep private conversations safe, spam-free, and genuinely supportive.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto pt-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <strong className="text-white block mb-0.5">Message Any Member</strong>
                  Send & receive private 1-on-1 messages with peers.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <strong className="text-white block mb-0.5">Accountability Partners</strong>
                  Pair up for daily check-ins and focus sprints.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <strong className="text-white block mb-0.5">Full Privacy Switch</strong>
                  Turn your DM inbox ON or OFF with one click.
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="px-5 py-2.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to Sanctuary Mastery Plan</span>
                </button>
              </div>
            </div>
          ) : !isDmEnabled ? (
            /* Gate 2: User is on Mastery Plan, but turned DMs OFF */
            <div className="studio-card rounded-xl p-8 text-center max-w-xl mx-auto space-y-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Direct Messaging is Currently Turned OFF
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You have paused Direct Messages for privacy. While OFF, nobody can send you new direct messages. Turn it back ON anytime to chat with your peers.
              </p>
              <button
                type="button"
                onClick={handleToggleDmEnabled}
                className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                Turn Direct Messages ON
              </button>
            </div>
          ) : (
            /* Full 2-Column Direct Message Inbox & Active Chat (Mastery Plan + DM ON) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left 4 Columns: Peer Conversations List */}
              <div className="lg:col-span-4 studio-card rounded-xl p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Conversations ({conversations.length})
                    </span>
                    <span className="text-[11px] font-mono text-teal-400">Mastery Unlocked</span>
                  </div>

                  <div className="space-y-1.5">
                    {conversations.map(convo => {
                      const active = convo.id === activeConversation?.id;
                      const lastMsg = convo.messages[convo.messages.length - 1];
                      return (
                        <button
                          key={convo.id}
                          type="button"
                          onClick={() => {
                            setActiveConversationId(convo.id);
                            const cleared = conversations.map(c =>
                              c.id === convo.id ? { ...c, unreadCount: 0 } : c
                            );
                            setConversations(cleared);
                            saveDMConversations(cleared);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 cursor-pointer border ${
                            active
                              ? 'bg-slate-950 border-teal-500/40'
                              : 'bg-transparent border-transparent hover:bg-slate-950/50'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <CuteAvatar
                              avatarId={convo.peerAvatarId}
                              auraColor={convo.peerAuraColor}
                              size="sm"
                            />
                            {convo.peerOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold text-white truncate">
                                {convo.peerName}
                              </span>
                              {convo.unreadCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-teal-400 text-slate-950 font-mono text-[10px] font-bold">
                                  {convo.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-teal-400 truncate">
                              {convo.peerBadge}
                            </div>
                            {lastMsg && (
                              <p className="text-[11px] text-slate-400 truncate mt-1">
                                {lastMsg.senderHandle === '@me' ? 'You: ' : ''}
                                {lastMsg.text}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  Tip: Click <strong className="text-slate-200">Message</strong> on any post in the Community Feed to start a new chat.
                </div>
              </div>

              {/* Right 8 Columns: Active Chat Thread */}
              {activeConversation && (
                <div className="lg:col-span-8 studio-card rounded-xl p-5 flex flex-col justify-between min-h-[420px]">
                  {/* Conversation Header */}
                  <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <CuteAvatar
                        avatarId={activeConversation.peerAvatarId}
                        auraColor={activeConversation.peerAuraColor}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {activeConversation.peerName}
                          </h3>
                          <span className="text-xs font-mono text-slate-400">
                            {activeConversation.peerHandle}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-teal-400">
                          {activeConversation.peerBadge} ·{' '}
                          {activeConversation.peerOnline ? 'Online now' : 'Active today'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewSection('feed')}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      ← Back to Feed
                    </button>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[300px] pr-1">
                    {activeConversation.messages.map(msg => {
                      const isMe = msg.senderHandle === '@me';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed space-y-2 ${
                              isMe
                                ? 'bg-teal-400 text-slate-950 font-medium'
                                : 'bg-slate-950 border border-slate-800 text-slate-200'
                            }`}
                          >
                            {msg.stickerUrl && (
                              <img
                                src={msg.stickerUrl}
                                alt={msg.stickerLabel || 'Sticker'}
                                className="w-20 h-20 object-contain rounded-lg bg-slate-950/20 p-1"
                              />
                            )}
                            <div>{msg.text}</div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 mt-1">
                            {msg.senderName} · {formatTimeAgo(msg.timestamp)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Attached DM Sticker Preview */}
                  {dmSticker && (
                    <div className="mb-2 p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={dmSticker.imageUrl}
                          alt={dmSticker.label}
                          className="w-10 h-10 object-contain rounded"
                        />
                        <span className="text-xs text-teal-300 font-medium">
                          Sticker: {dmSticker.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDmSticker(null)}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* DM Emoji & Sticker Picker Drawer */}
                  {showDmEmojiPicker && (
                    <div className="mb-2">
                      <EmojiStickerPicker
                        subscription={subscription}
                        onSelectEmoji={emoji => setDmInputText(prev => prev + emoji)}
                        onSelectSticker={stk => {
                          setDmSticker(stk);
                          setShowDmEmojiPicker(false);
                        }}
                        onNavigateToPricing={onNavigateToPricing}
                        onClose={() => setShowDmEmojiPicker(false)}
                      />
                    </div>
                  )}

                  {/* Message Input Bar */}
                  <form
                    onSubmit={handleSendDirectMessage}
                    className="pt-3 border-t border-slate-800/80 flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setShowDmEmojiPicker(!showDmEmojiPicker)}
                      className="px-2.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-teal-400 flex items-center gap-1 cursor-pointer shrink-0"
                      title="Add Emoji or Sticker"
                    >
                      <Smile className="w-4 h-4" />
                      <span className="hidden sm:inline">Stickers</span>
                    </button>
                    <input
                      type="text"
                      value={dmInputText}
                      onChange={e => setDmInputText(e.target.value)}
                      placeholder={`Write a direct message to ${activeConversation.peerName}...`}
                      className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                    <button
                      type="submit"
                      disabled={!dmInputText.trim() && !dmSticker}
                      className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== SECTION B: COMMUNITY CIRCLES & PROGRESS FEED ==================== */}
      {viewSection === 'feed' && (
        <>
          {/* Support Circle Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
            <button
              onClick={() => handleSelectCircle('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                activeCircleTab === 'all'
                  ? 'bg-slate-100 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              All Groups ({COMMUNITY_CIRCLES.reduce((a, b) => a + b.activeNowCount, 0)} online)
            </button>

            {COMMUNITY_CIRCLES.map(circle => {
              const active = activeCircleTab === circle.id;
              return (
                <button
                  key={circle.id}
                  onClick={() => handleSelectCircle(circle.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                    active
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{circle.name.split('·')[0].trim()}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      active ? 'text-slate-700' : 'text-slate-500'
                    }`}
                  >
                    {circle.activeNowCount}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* LEFT 5 COLUMNS: Support Group Details + Optional WhatsApp & Telegram Join Buttons + Shared Routines */}
            <div className="lg:col-span-5 space-y-5">
              {(currentCircleObj ? [currentCircleObj] : COMMUNITY_CIRCLES).map(circle => {
                const isJoined = profile.joinedCircles.includes(circle.id);
                const isWaJoined = (profile.joinedWhatsAppCircles || []).includes(circle.id);
                const isTgJoined = (profile.joinedTelegramCircles || []).includes(circle.id);

                return (
                  <div key={circle.id} className="studio-card rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400">
                          {circle.category.replace('_', ' ')} group ·{' '}
                          {circle.memberCount.toLocaleString()} members
                        </span>
                        <h3 className="text-base font-semibold text-white mt-0.5">
                          {circle.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleToggleJoinCircle(circle.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                          isJoined
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-950 font-semibold hover:bg-white'
                        }`}
                      >
                        {isJoined ? 'Joined ✓' : 'Join Group'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{circle.tagline}</p>

                    {/* Optional WhatsApp & Telegram Support Group Buttons */}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Optional Live Chat Support Channels
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Optional</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* WhatsApp Join Button */}
                        <button
                          type="button"
                          onClick={() => setChannelModal({ platform: 'whatsapp', circle })}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isWaJoined
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate">
                              {isWaJoined ? 'WhatsApp Joined' : 'Join WhatsApp'}
                            </span>
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400 shrink-0">
                            {circle.whatsappMembersCount || 1800}
                          </span>
                        </button>

                        {/* Telegram Join Button */}
                        <button
                          type="button"
                          onClick={() => setChannelModal({ platform: 'telegram', circle })}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isTgJoined
                              ? 'bg-sky-500/15 border-sky-500/40 text-sky-200'
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                            <span className="truncate">
                              {isTgJoined ? 'Telegram Joined' : 'Join Telegram'}
                            </span>
                          </span>
                          <span className="font-mono text-[10px] text-sky-400 shrink-0">
                            {circle.telegramMembersCount || 2500}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Weekly Goal */}
                    <div className="py-2.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-teal-400">
                        This Week's Group Goal
                      </div>
                      <p className="text-xs font-medium text-slate-200 mt-0.5">
                        {circle.weeklyChallenge}
                      </p>
                    </div>

                    {/* Routines List */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        Daily Steps Shared by Members
                      </div>

                      <div className="divide-y divide-slate-800/70 border-t border-slate-800/70">
                        {circle.featuredRoutines.map((rt, idx) => {
                          const key = `${circle.id}-${idx}`;
                          const alreadyInHabit = habits.some(
                            h =>
                              !h.archived &&
                              (h.category === circle.category ||
                                h.communityCircleId === circle.id) &&
                              h.routines?.some(r => r.title === rt.title)
                          );
                          const isAdded = adoptedRoutines[key] || alreadyInHabit;

                          return (
                            <div key={key} className="py-3 flex flex-col gap-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-xs font-semibold text-white">
                                    {rt.title}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                    {rt.timing}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    onAdoptRoutine(circle, rt);
                                    setAdoptedRoutines(prev => ({ ...prev, [key]: true }));
                                  }}
                                  disabled={isAdded}
                                  className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors shrink-0 cursor-pointer ${
                                    isAdded
                                      ? 'text-teal-400 bg-teal-500/10 cursor-default'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      <span>Use Routine</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {rt.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT 7 COLUMNS: Progress Picture Post Composer & Member Feed */}
            <div className="lg:col-span-7 space-y-5">
              {/* Post Composer with Progress Photo Upload */}
              <form onSubmit={handleCreatePost} className="studio-card rounded-xl p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CuteAvatar
                      avatarId={profile.avatarId}
                      auraColor={profile.auraColor}
                      size="sm"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white">
                        {profile.displayName}
                      </span>
                      <span className="text-[11px] font-mono text-teal-400 ml-2">
                        {profile.titleBadge}
                      </span>
                    </div>
                  </div>

                  <select
                    value={newPostCircle}
                    onChange={e => setNewPostCircle(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                  >
                    {COMMUNITY_CIRCLES.map(c => (
                      <option key={c.id} value={c.id}>
                        Post in: {c.name.split('·')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  rows={2}
                  placeholder="Share a win, progress photo, or daily habit routine that is helping you..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500 resize-none"
                />

                {/* Attached Progress Picture Preview */}
                {newPostImage && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider">
                        Attached Progress Picture
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPostImage(undefined);
                          setNewPostImageCaption('');
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    </div>
                    <img
                      src={newPostImage}
                      alt="Progress preview"
                      className="w-full max-h-52 object-cover rounded-lg border border-slate-800"
                    />
                    <input
                      type="text"
                      value={newPostImageCaption}
                      onChange={e => setNewPostImageCaption(e.target.value)}
                      placeholder="Add a short photo caption (e.g. Day 14 healthy breakfast plate)..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                )}

                {/* Preset Progress Snapshots Picker */}
                {showPhotoPresets && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        Choose a Progress Card or Upload Your Own Photo
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPhotoPresets(false)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PROGRESS_PHOTO_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setNewPostImage(preset.dataUrl);
                            setNewPostImageCaption(preset.caption);
                            setShowPhotoPresets(false);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-400 text-left transition-all cursor-pointer"
                        >
                          <img
                            src={preset.dataUrl}
                            alt={preset.label}
                            className="w-full h-16 object-cover rounded"
                          />
                          <div className="text-[10px] font-medium text-slate-200 mt-1 truncate">
                            {preset.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Sticker Preview on Post Composer */}
                {newPostSticker && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={newPostSticker.imageUrl}
                        alt={newPostSticker.label}
                        className="w-12 h-12 object-contain rounded-lg bg-slate-900 p-1"
                      />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-teal-400 block">
                          Attached Sticker ({newPostSticker.category})
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {newPostSticker.label}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewPostSticker(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                {/* Emoji & Sticker Picker Panel (Includes Upload & Internet Sticker Search for Top 2 Plans) */}
                {showPostEmojiPicker && (
                  <EmojiStickerPicker
                    subscription={subscription}
                    onSelectEmoji={emoji => setNewPostText(prev => prev + emoji)}
                    onSelectSticker={stk => {
                      setNewPostSticker(stk);
                      setShowPostEmojiPicker(false);
                    }}
                    onNavigateToPricing={onNavigateToPricing}
                    onClose={() => setShowPostEmojiPicker(false)}
                  />
                )}

                {/* Composer Bottom Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    {/* Hidden File Input for Real Device Photo Upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPhotoPresets(!showPhotoPresets)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                      <span>Progress Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPostEmojiPicker(!showPostEmojiPicker)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        showPostEmojiPicker
                          ? 'bg-teal-500/15 border-teal-400 text-teal-300'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                      }`}
                    >
                      <Smile className="w-3.5 h-3.5 text-teal-400" />
                      <span>Emojis & Stickers</span>
                    </button>

                    <input
                      type="text"
                      value={newPostRoutine}
                      onChange={e => setNewPostRoutine(e.target.value)}
                      placeholder="Optional: Routine step used..."
                      className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostText.trim() && !newPostImage && !newPostSticker}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-white disabled:opacity-40 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Update</span>
                  </button>
                </div>
              </form>

              {/* Posts Feed */}
              <div className="space-y-4">
                {filteredPosts.map(post => {
                  const circle = COMMUNITY_CIRCLES.find(c => c.id === post.circleId);
                  return (
                    <article key={post.id} className="studio-card rounded-xl p-5 space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CuteAvatar
                            avatarId={post.authorAvatarId}
                            auraColor={post.authorAuraColor}
                            size="md"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-white">
                                {post.authorName}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                {post.authorHandle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono">
                              <span className="text-teal-400">{post.authorBadge}</span>
                              {circle && (
                                <>
                                  <span className="text-slate-700">·</span>
                                  <span className="text-slate-400">
                                    {circle.name.split('·')[0].trim()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {post.authorHandle !== profile.handle && (
                            <button
                              type="button"
                              onClick={() => handleOpenDMWithAuthor(post)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                              title={
                                isHighestPlan
                                  ? `Send Direct Message to ${post.authorName}`
                                  : 'Direct Messaging (Mastery Plan Only)'
                              }
                            >
                              <MessageCircle className="w-3 h-3 text-teal-400" />
                              <span>DM</span>
                              {!isHighestPlan && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                            </button>
                          )}
                          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                            {formatTimeAgo(post.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>

                      {/* Attached Sticker Display */}
                      {post.stickerUrl && (
                        <div className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                          <img
                            src={post.stickerUrl}
                            alt={post.stickerLabel || 'Sticker'}
                            className="w-16 h-16 object-contain rounded-lg"
                          />
                          {post.stickerLabel && (
                            <span className="text-xs font-mono text-teal-300 pr-2">
                              {post.stickerLabel}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Progress Picture Display */}
                      {post.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                          <button
                            type="button"
                            onClick={() => setExpandedImagePost(post)}
                            className="w-full block text-left cursor-pointer group"
                          >
                            <img
                              src={post.imageUrl}
                              alt={post.imageCaption || 'Community progress photo'}
                              className="w-full max-h-72 object-cover group-hover:opacity-95 transition-opacity"
                            />
                          </button>
                          {post.imageCaption && (
                            <div className="px-3.5 py-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                              <span>{post.imageCaption}</span>
                              <span className="font-mono text-[10px] text-teal-400">
                                Progress Photo
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {post.routineShared && (
                        <div className="py-2 px-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2">
                          <div className="text-xs text-slate-300">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 mr-2">
                              Routine Used:
                            </span>
                            <span className="font-medium text-white">{post.routineShared}</span>
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs">
                          <button
                            onClick={() => handleToggleCheer(post.id)}
                            className={`flex items-center gap-1.5 font-mono transition-colors cursor-pointer ${
                              post.cheeredByMe
                                ? 'text-rose-400 font-semibold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${post.cheeredByMe ? 'fill-rose-400' : ''}`}
                            />
                            <span>{post.cheersCount} Cheers</span>
                          </button>

                          <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{post.comments.length} Replies</span>
                          </span>
                        </div>

                        {post.authorHandle !== profile.handle && (
                          <button
                            type="button"
                            onClick={() => handleOpenDMWithAuthor(post)}
                            className="text-xs font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Message {post.authorName.split(' ')[0]}</span>
                          </button>
                        )}
                      </div>

                      {/* Comments */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {post.comments.map(c => (
                            <div
                              key={c.id}
                              className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start gap-2.5"
                            >
                              <CuteAvatar
                                avatarId={c.authorAvatarId}
                                auraColor={c.authorAuraColor}
                                size="sm"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-white">
                                    {c.authorName}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {formatTimeAgo(c.timestamp)}
                                  </span>
                                </div>
                                {c.stickerUrl && (
                                  <img
                                    src={c.stickerUrl}
                                    alt={c.stickerLabel || 'Sticker'}
                                    className="w-12 h-12 object-contain rounded mt-1"
                                  />
                                )}
                                <p className="text-xs text-slate-300 mt-0.5">{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Attached Comment Sticker Preview */}
                      {commentStickers[post.id] && (
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={commentStickers[post.id]!.imageUrl}
                              alt={commentStickers[post.id]!.label}
                              className="w-9 h-9 object-contain rounded"
                            />
                            <span className="text-xs text-teal-300">
                              Sticker: {commentStickers[post.id]!.label}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setCommentStickers(prev => ({ ...prev, [post.id]: null }))
                            }
                            className="text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {activeCommentPickerPostId === post.id && (
                        <EmojiStickerPicker
                          subscription={subscription}
                          onSelectEmoji={emoji =>
                            setCommentInputs(prev => ({
                              ...prev,
                              [post.id]: (prev[post.id] || '') + emoji,
                            }))
                          }
                          onSelectSticker={stk => {
                            setCommentStickers(prev => ({ ...prev, [post.id]: stk }));
                            setActiveCommentPickerPostId(null);
                          }}
                          onNavigateToPricing={onNavigateToPricing}
                          onClose={() => setActiveCommentPickerPostId(null)}
                        />
                      )}

                      {/* Add Comment */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCommentPickerPostId(
                              activeCommentPickerPostId === post.id ? null : post.id
                            )
                          }
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-teal-400 cursor-pointer shrink-0"
                          title="Add Emoji or Sticker to Reply"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={e =>
                            setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Write an encouraging reply or add a sticker..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== MODAL 1: OPTIONAL WHATSAPP / TELEGRAM SUPPORT CHANNEL ==================== */}
      {channelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="studio-card rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                    channelModal.platform === 'whatsapp'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-sky-500/15 text-sky-300'
                  }`}
                >
                  Optional {channelModal.platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'} Support Group
                </span>
                <h3 className="text-lg font-semibold text-white mt-1.5">
                  {channelModal.circle.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setChannelModal(null);
                  setCopiedLink(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Joining the {channelModal.platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'} community is completely optional. Connect with{' '}
              <strong className="text-white">
                {channelModal.platform === 'whatsapp'
                  ? channelModal.circle.whatsappMembersCount || 1840
                  : channelModal.circle.telegramMembersCount || 2610}{' '}
                members
              </strong>{' '}
              for daily check-ins, meal & workout accountability, and instant craving support.
            </p>

            {/* Invite Link Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-teal-300 truncate">
                {channelModal.platform === 'whatsapp'
                  ? channelModal.circle.whatsappGroupUrl
                  : channelModal.circle.telegramGroupUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  const url =
                    channelModal.platform === 'whatsapp'
                      ? channelModal.circle.whatsappGroupUrl || ''
                      : channelModal.circle.telegramGroupUrl || '';
                  navigator.clipboard?.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-white flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setChannelModal(null);
                  setCopiedLink(false);
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (channelModal.platform === 'whatsapp') {
                    handleToggleWhatsAppCircle(channelModal.circle.id);
                  } else {
                    handleToggleTelegramCircle(channelModal.circle.id);
                  }
                  setChannelModal(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  channelModal.platform === 'whatsapp'
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                    : 'bg-sky-400 hover:bg-sky-300 text-slate-950'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {(
                    channelModal.platform === 'whatsapp'
                      ? (profile.joinedWhatsAppCircles || []).includes(channelModal.circle.id)
                      : (profile.joinedTelegramCircles || []).includes(channelModal.circle.id)
                  )
                    ? `Leave ${channelModal.platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'} Group`
                    : `Opt In & Join ${channelModal.platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'} Group`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: LIGHTBOX PROGRESS PHOTO VIEW ==================== */}
      {expandedImagePost && expandedImagePost.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpandedImagePost(null)}
        >
          <div
            className="studio-card rounded-2xl max-w-2xl w-full p-4 space-y-3 border border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white">
                {expandedImagePost.authorName} ·{' '}
                <span className="text-teal-400 font-mono">{expandedImagePost.authorBadge}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedImagePost(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={expandedImagePost.imageUrl}
              alt={expandedImagePost.imageCaption || 'Progress photo'}
              className="w-full max-h-[70vh] object-contain rounded-xl bg-slate-950"
            />
            {expandedImagePost.imageCaption && (
              <p className="text-xs text-slate-300">{expandedImagePost.imageCaption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
