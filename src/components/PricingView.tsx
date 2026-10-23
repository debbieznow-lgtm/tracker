import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  CreditCard,
  Lock,
  Building2,
  Smartphone,
  Wallet,
  Coins,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { BillingCycle, PlanTierId, UserSubscription } from '../types/habit';
import confetti from 'canvas-confetti';

interface PricingViewProps {
  subscription: UserSubscription;
  onUpdateSubscription: (sub: UserSubscription) => void;
}

interface TierConfig {
  id: PlanTierId;
  numberLabel: string;
  name: string;
  audience: string;
  tagline: string;
  baseMonthlyPriceUsd: number;
  highlightLabel?: string;
  features: string[];
}

export type PaymentChannelId =
  | 'card'
  | 'wallet'
  | 'bank_transfer'
  | 'mobile_money'
  | 'crypto';

const PAYMENT_CHANNELS: {
  id: PaymentChannelId;
  label: string;
  sublabel: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sublabel: 'Visa, Mastercard, Amex, Verve',
    icon: CreditCard,
  },
  {
    id: 'wallet',
    label: 'PayPal / Apple & Google Pay',
    sublabel: 'Instant 1-click digital wallet',
    icon: Wallet,
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer / Direct Wire',
    sublabel: 'Instant bank transfer & receipt',
    icon: Building2,
  },
  {
    id: 'mobile_money',
    label: 'Mobile Money / USSD',
    sublabel: 'Pay with mobile phone number',
    icon: Smartphone,
  },
  {
    id: 'crypto',
    label: 'USDT / USDC (Crypto)',
    sublabel: 'TRC-20 / ERC-20 / Solana',
    icon: Coins,
  },
];

const TIERS: TierConfig[] = [
  {
    id: 'starter',
    numberLabel: '01',
    name: 'Ascent Starter',
    audience: 'For individuals starting their daily habit journey',
    tagline: 'Essential daily habit & quit trackers, guided routines, and public support groups.',
    baseMonthlyPriceUsd: 5.0,
    features: [
      'Up to 8 active Build & Quit habit trackers',
      'Eating, Drinking, Procrastination & Screen Time routines',
      'Public Community Support Groups + WhatsApp & Telegram links',
      'Standard Emojis & Built-In Habit Stickers + 12 Cute Avatars',
      'Multi-channel reminders (Email, Text, System Pop-Ups) & Display customizer',
    ],
  },
  {
    id: 'pro',
    numberLabel: '02',
    name: 'Recovery Pro',
    audience: 'For deep habit transformation & full health plans',
    tagline: 'Unlimited habit trackers, complete exercise & meal plans, custom sticker uploads & internet sticker search.',
    baseMonthlyPriceUsd: 12.0,
    highlightLabel: 'Most Popular · Custom & Web Stickers',
    features: [
      'Unlimited Build & Quit trackers with live savings counters',
      'Upload Custom Stickers from device & Browse the Internet for Stickers',
      'All 3 Exercise Plans & 3 Healthy Meal Plans with visual guides',
      'Post progress pictures & updates in Community Support Groups',
      '24/7 AI Coach Assistant, Notes Book & App Screen Override reminders',
    ],
  },
  {
    id: 'mastery',
    numberLabel: '03',
    name: 'Sanctuary Mastery',
    audience: 'For complete accountability & 1-on-1 peer messaging',
    tagline: 'Everything in Pro (including Custom & Internet Stickers) plus exclusive 1-on-1 Direct Messaging (DM).',
    baseMonthlyPriceUsd: 24.0,
    highlightLabel: 'Direct Messaging (DM) + Custom Stickers',
    features: [
      'Everything in Recovery Pro included (Upload & Browse Internet Stickers)',
      'Exclusive 1-on-1 Direct Messaging (DM) — message peers & receive DMs',
      'Full DM Privacy Switch (turn Direct Messages ON or OFF anytime)',
      'Priority 1-on-1 accountability partner matching in all groups',
      'Up to 4 family or accountability partner seats included',
    ],
  },
];

export const PricingView: React.FC<PricingViewProps> = ({
  subscription,
  onUpdateSubscription,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    subscription.billingCycle || 'yearly'
  );
  const [newUserPromo, setNewUserPromo] = useState<boolean>(
    subscription.isNewUserDiscountApplied ?? true
  );
  const [checkoutTier, setCheckoutTier] = useState<TierConfig | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannelId>('card');

  // Channel-specific inputs
  const [cardName, setCardName] = useState('Alex Rivera');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [walletEmail, setWalletEmail] = useState('alex.rivera@example.com');
  const [mobilePhone, setMobilePhone] = useState('+1 (555) 234-8910');
  const [mobileProvider, setMobileProvider] = useState('Mobile Wallet / Instant USSD');
  const [copiedDetail, setCopiedDetail] = useState<string | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  const calculatePricing = (baseMonthly: number) => {
    const afterNewUserMonthly = newUserPromo ? baseMonthly * 0.5 : baseMonthly;
    const effectiveMonthly =
      billingCycle === 'yearly' ? afterNewUserMonthly * 0.9 : afterNewUserMonthly;
    const annualBilledTotal = effectiveMonthly * 12;

    return {
      originalMonthly: baseMonthly,
      effectiveMonthly: Number(effectiveMonthly.toFixed(2)),
      annualBilledTotal: Number(annualBilledTotal.toFixed(2)),
    };
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });

    const channelLabel =
      PAYMENT_CHANNELS.find(c => c.id === selectedChannel)?.label || 'Card';

    const nextSub: UserSubscription = {
      tierId: checkoutTier.id,
      billingCycle,
      isNewUserDiscountApplied: newUserPromo,
      subscribedAt: new Date().toISOString(),
      active: true,
      paymentChannel: channelLabel,
    };

    onUpdateSubscription(nextSub);
    setPaymentSuccessMessage(
      `Your ${checkoutTier.name} (${billingCycle}) plan is now active via ${channelLabel}.${
        checkoutTier.id === 'mastery'
          ? ' 1-on-1 Direct Messaging (DM) is now unlocked in the Community tab!'
          : ''
      }`
    );
    setCheckoutTier(null);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedDetail(label);
    setTimeout(() => setCopiedDetail(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header & Billing Controls */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-1.5">
            Membership & Payment Channels
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-white tracking-tight">
            Simple Plans Starting from $5 USD
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            New members receive <strong className="text-slate-200">50% off</strong>, plus an extra{' '}
            <strong className="text-slate-200">10% discount</strong> on yearly billing. Choose your plan and pay with Card, PayPal, Bank Transfer, Mobile Money, or Crypto.
          </p>
        </div>

        {/* Billing Cycle & New User 50% Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-100 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-slate-100 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Yearly</span>
              <span
                className={`font-mono text-[10px] ${
                  billingCycle === 'yearly' ? 'text-teal-700 font-bold' : 'text-teal-400'
                }`}
              >
                −10%
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setNewUserPromo(!newUserPromo)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
              newUserPromo
                ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
                : 'border-slate-800 bg-slate-900 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                newUserPromo ? 'bg-teal-400' : 'bg-slate-600'
              }`}
            />
            <span>New User 50% Off: {newUserPromo ? 'APPLIED' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Payment Confirmation Banner */}
      {paymentSuccessMessage && (
        <div className="studio-card rounded-xl p-4 border-teal-500/40 bg-teal-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-100">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{paymentSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setPaymentSuccessMessage(null)}
            className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Supported Payment Channels Strip */}
      <div className="studio-card rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-300 font-medium">
          Available Payment Channels at Checkout:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PAYMENT_CHANNELS.map(ch => {
            const Icon = ch.icon;
            return (
              <span
                key={ch.id}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5"
              >
                <Icon className="w-3.5 h-3.5 text-teal-400" />
                <span>{ch.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* 3 Pricing Tiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {TIERS.map(tier => {
          const price = calculatePricing(tier.baseMonthlyPriceUsd);
          const isCurrentPlan = subscription.active && subscription.tierId === tier.id;
          const isMastery = tier.id === 'mastery';

          return (
            <div
              key={tier.id}
              className={`studio-card rounded-xl p-6 flex flex-col justify-between transition-all ${
                isMastery
                  ? 'ring-1 ring-teal-400 border-teal-500/50'
                  : 'hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Index & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs text-slate-500">
                    TIER {tier.numberLabel}
                  </span>
                  {tier.highlightLabel && (
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded font-semibold ${
                        isMastery
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-teal-400/15 text-teal-300'
                      }`}
                    >
                      {tier.highlightLabel}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-white tracking-tight">
                  {tier.name}
                </h2>
                <div className="text-xs font-medium text-teal-400 mt-0.5">
                  {tier.audience}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tier.tagline}</p>

                {/* Price Block */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <div className="flex items-baseline gap-2 font-mono tabular-nums">
                    {(newUserPromo || billingCycle === 'yearly') && (
                      <span className="text-sm text-slate-500 line-through">
                        ${price.originalMonthly.toFixed(2)}
                      </span>
                    )}
                    <span className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                      ${price.effectiveMonthly.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>

                  <div className="mt-1.5 text-[11px] font-mono text-slate-400 tabular-nums">
                    {billingCycle === 'yearly' ? (
                      <span>
                        Billed annually at{' '}
                        <strong className="text-slate-200">
                          ${price.annualBilledTotal.toFixed(2)}/yr
                        </strong>{' '}
                        (includes 10% yearly discount)
                      </span>
                    ) : (
                      <span>
                        Billed monthly · Standard rate ${tier.baseMonthlyPriceUsd.toFixed(2)}/mo
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
                  {tier.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-7 pt-4 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setCheckoutTier(tier)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                      : isMastery
                      ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                      : 'bg-slate-100 hover:bg-white text-slate-950'
                  }`}
                >
                  {isCurrentPlan ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Active Plan ({subscription.paymentChannel || 'Paid'})</span>
                    </>
                  ) : (
                    <span>
                      Select {tier.name} · ${price.effectiveMonthly.toFixed(2)}/mo
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Channel Checkout Modal */}
      {checkoutTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="studio-card rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400">
                  Complete Membership & Choose Payment Channel
                </span>
                <h3 className="text-lg font-semibold text-white mt-0.5">
                  {checkoutTier.name} ({billingCycle === 'yearly' ? 'Annual Plan' : 'Monthly Plan'})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutTier(null)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Order Breakdown */}
            {(() => {
              const p = calculatePricing(checkoutTier.baseMonthlyPriceUsd);
              return (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-slate-400">
                    <span>Standard Monthly Rate</span>
                    <span>${p.originalMonthly.toFixed(2)} / mo</span>
                  </div>
                  {newUserPromo && (
                    <div className="flex justify-between text-teal-400">
                      <span>New User 50% Discount</span>
                      <span>−50%</span>
                    </div>
                  )}
                  {billingCycle === 'yearly' && (
                    <div className="flex justify-between text-teal-400">
                      <span>Annual Billing Discount</span>
                      <span>−10%</span>
                    </div>
                  )}
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-semibold text-white">
                    <span>Total Due Today</span>
                    <span>
                      $
                      {billingCycle === 'yearly'
                        ? `${p.annualBilledTotal.toFixed(2)} USD (12 months)`
                        : `${p.effectiveMonthly.toFixed(2)} USD`}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Step 1: Select Payment Channel */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                1. Choose Your Payment Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_CHANNELS.map(ch => {
                  const Icon = ch.icon;
                  const active = selectedChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChannel(ch.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        active
                          ? 'bg-teal-500/15 border-teal-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{ch.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{ch.sublabel}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Channel-Specific Payment Details */}
            <form onSubmit={handleCompleteCheckout} className="space-y-4">
              {selectedChannel === 'card' && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                      />
                      <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">CVC</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedChannel === 'wallet' && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-300">
                    Enter your PayPal, Apple Pay, or Google Pay account email for instant activation:
                  </div>
                  <input
                    type="email"
                    required
                    value={walletEmail}
                    onChange={e => setWalletEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}

              {selectedChannel === 'bank_transfer' && (
                <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-slate-300 font-medium">
                    Transfer to Ascent Sanctuary Official Bank Account:
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bank:</span>
                      <span className="text-white">Mercury / First Century Bank</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-teal-300 font-semibold">409281746501</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText('409281746501', 'acct')}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span>{copiedDetail === 'acct' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Routing / SWIFT:</span>
                      <span className="text-white">061120084</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Click confirm below once your transfer is initiated to activate your plan immediately.
                  </p>
                </div>
              )}

              {selectedChannel === 'mobile_money' && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Mobile Network / USSD Channel
                    </label>
                    <select
                      value={mobileProvider}
                      onChange={e => setMobileProvider(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option>Mobile Wallet / Instant USSD</option>
                      <option>M-Pesa / Airtel Money / MTN MoMo</option>
                      <option>CashApp / Venmo / Zelle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={mobilePhone}
                      onChange={e => setMobilePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              )}

              {selectedChannel === 'crypto' && (
                <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-slate-300 font-medium">
                    Send USDT or USDC (TRC-20 / ERC-20 / Solana):
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono flex items-center justify-between gap-2">
                    <span className="text-teal-300 truncate text-[11px]">
                      0x71C95911E9a5D330f4D621842EC243EE1343292e
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          '0x71C95911E9a5D330f4D621842EC243EE1343292e',
                          'crypto'
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-800 text-[10px] text-white shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>{copiedDetail === 'crypto' ? 'Copied' : 'Copy Address'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  Confirm & Activate {checkoutTier.name} via{' '}
                  {PAYMENT_CHANNELS.find(c => c.id === selectedChannel)?.label.split('/')[0].trim()}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
