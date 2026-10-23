import React, { useState } from 'react';
import {
  Check,
  Dumbbell,
  Utensils,
  Droplets,
  Clock,
  Flame,
  Plus,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
  Eye
} from 'lucide-react';
import {
  EatingPlan,
  ExerciseMovement,
  ExercisePlan,
  Habit,
  UserVitalityState
} from '../types/habit';
import { EATING_PLANS, EXERCISE_PLANS } from '../utils/storage';
import confetti from 'canvas-confetti';

interface VitalityRegimensProps {
  selectedDate: string;
  vitalityState: UserVitalityState;
  habits: Habit[];
  onUpdateVitalityState: (next: UserVitalityState) => void;
  onAdoptExercisePlanAsHabit: (plan: ExercisePlan) => void;
  onAdoptEatingPlanAsHabit: (plan: EatingPlan) => void;
  onNavigateToJournal: () => void;
}

/**
 * Anatomically proportioned human body helper for SVG exercise diagrams:
 * Renders torso, head, joints, and limbs with clear posture lines and muscle highlights.
 */
const JointDot: React.FC<{ cx: number; cy: number; highlight?: boolean }> = ({
  cx,
  cy,
  highlight,
}) => (
  <circle
    cx={cx}
    cy={cy}
    r={highlight ? 3.2 : 2.4}
    className={highlight ? 'fill-teal-400 stroke-slate-950' : 'fill-slate-300 stroke-slate-950'}
    strokeWidth="1"
  />
);

/**
 * Biomechanically accurate, exercise-specific visual guide showing:
 * Panel 1: Starting Posture
 * Panel 2: Active Movement & Target Muscles
 */
const ExerciseVisualDiagram: React.FC<{
  movement: ExerciseMovement;
}> = ({ movement }) => {
  const [highlightPhase, setHighlightPhase] = useState<'both' | 'start' | 'active'>('both');
  const id = movement.id;
  const type = movement.visualGuideType;

  // Determine exact anatomical diagram variant so every exercise is 100% accurate
  const variant =
    id === 'mov-legs-up-wall'
      ? 'legs_up_wall'
      : id === 'mov-calf-ankle'
      ? 'calf_raise'
      : id === 'mov-kb-swing'
      ? 'kb_swing'
      : id === 'mov-stepup'
      ? 'step_up'
      : id === 'mov-hip-flexor'
      ? 'hip_flexor'
      : id === 'mov-world-greatest'
      ? 'hip_90_90'
      : id === 'mov-cars'
      ? 'joint_circles'
      : type;

  return (
    <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-200 font-semibold">
            Form & Posture Guide
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(
            [
              { id: 'both', label: 'Side-by-Side' },
              { id: 'start', label: '1. Start' },
              { id: 'active', label: '2. Action' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setHighlightPhase(tab.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                highlightPhase === tab.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accurate Dual-Panel Anatomical SVG Illustration */}
      <div className="w-full bg-slate-900/75 rounded-lg border border-slate-800/80 p-2.5 flex items-center justify-center">
        <svg
          viewBox="0 0 280 140"
          className="w-full h-36 sm:h-40 overflow-visible"
          role="img"
          aria-label={`Visual form guide for ${movement.name}`}
        >
          <defs>
            <marker
              id={`arrow-${id}`}
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" className="fill-teal-400" />
            </marker>
          </defs>

          {/* Subtle Alignment Grid & Floor */}
          <line x1="10" y1="118" x2="128" y2="118" className="stroke-slate-700" strokeWidth="2" />
          <line x1="152" y1="118" x2="270" y2="118" className="stroke-slate-700" strokeWidth="2" />
          <line
            x1="140"
            y1="10"
            x2="140"
            y2="128"
            className="stroke-slate-800"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Panel Headers */}
          <text
            x="14"
            y="15"
            className="fill-slate-400 font-mono text-[8.5px] uppercase tracking-wider font-semibold"
          >
            1. START POSTURE
          </text>
          <text
            x="156"
            y="15"
            className="fill-teal-400 font-mono text-[8.5px] uppercase tracking-wider font-semibold"
          >
            2. ACTIVE MOVEMENT
          </text>

          {/* ==================== 1. SQUAT (Goblet / Bodyweight Squat) ==================== */}
          {variant === 'squat' && (
            <>
              {/* Panel 1: Standing tall holding weight at chest */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="34" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                {/* Torso */}
                <line x1="65" y1="42" x2="65" y2="76" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Thigh & Shin */}
                <line x1="65" y1="76" x2="67" y2="97" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="67" y1="97" x2="65" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                {/* Foot flat */}
                <line x1="61" y1="117" x2="75" y2="117" className="stroke-slate-200" strokeWidth="3" strokeLinecap="round" />
                {/* Arms holding goblet weight at chest */}
                <path d="M65 48 L77 58 L73 47" className="stroke-slate-300 fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="71" y="42" width="8" height="10" rx="2" className="fill-teal-400/80" />
                <JointDot cx={65} cy={76} />
                <JointDot cx={67} cy={97} />
                <text x="16" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Stand tall, chest proud
                </text>
              </g>

              {/* Panel 2: 90-degree parallel squat */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                {/* Target Muscle Highlight (Quads & Glutes) */}
                <ellipse cx="204" cy="91" rx="14" ry="7" className="fill-teal-400/20" />
                {/* Head */}
                <circle cx="206" cy="48" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                {/* Upright-angled torso parallel to shin */}
                <line x1="206" y1="56" x2="192" y2="88" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Horizontal thigh (parallel to floor) */}
                <line x1="192" y1="88" x2="216" y2="90" className="stroke-teal-300" strokeWidth="4.5" strokeLinecap="round" />
                {/* Forward-angled shin tracking over toes */}
                <line x1="216" y1="90" x2="208" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                {/* Flat foot */}
                <line x1="203" y1="117" x2="219" y2="117" className="stroke-teal-400" strokeWidth="3.2" strokeLinecap="round" />
                {/* Arms holding weight at chest */}
                <path d="M203 62 L216 70 L214 58" className="stroke-teal-300 fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="212" y="53" width="8" height="10" rx="2" className="fill-teal-400" />
                <JointDot cx={192} cy={88} highlight />
                <JointDot cx={216} cy={90} highlight />
                {/* Motion Arrow */}
                <line x1="176" y1="54" x2="176" y2="86" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↓ Sit hips back to 90° chair depth
                </text>
              </g>
            </>
          )}

          {/* ==================== 2. CALF RAISE (Heel Raises & Ankle Circles) ==================== */}
          {variant === 'calf_raise' && (
            <>
              {/* Panel 1: Heels flat on floor */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="32" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="65" y1="40" x2="65" y2="74" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="65" y1="74" x2="65" y2="96" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="65" y1="96" x2="65" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="60" y1="117" x2="76" y2="117" className="stroke-slate-200" strokeWidth="3" strokeLinecap="round" />
                <JointDot cx={65} cy={96} />
                <text x="16" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Heels flat on floor
                </text>
              </g>

              {/* Panel 2: High on tiptoes, calves contracted */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="205" cy="96" rx="7" ry="11" className="fill-teal-400/25" />
                <circle cx="208" cy="24" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="208" y1="32" x2="208" y2="66" className="stroke-teal-400" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="208" y1="66" x2="208" y2="88" className="stroke-teal-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="208" y1="88" x2="208" y2="108" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                {/* Angled foot on tiptoes */}
                <line x1="208" y1="108" x2="218" y2="117" className="stroke-teal-400" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="216" y1="117" x2="224" y2="117" className="stroke-teal-400" strokeWidth="3" strokeLinecap="round" />
                <JointDot cx={208} cy={108} highlight />
                <line x1="188" y1="112" x2="188" y2="84" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↑ Rise high onto balls of feet
                </text>
              </g>
            </>
          )}

          {/* ==================== 3. HINGE (Romanian Deadlift / Hip Hinge) ==================== */}
          {variant === 'hinge' && (
            <>
              {/* Panel 1: Standing tall holding weights in front of thighs */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="34" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="65" y1="42" x2="65" y2="76" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="65" y1="76" x2="65" y2="97" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="65" y1="97" x2="65" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="61" y1="117" x2="75" y2="117" className="stroke-slate-200" strokeWidth="3" strokeLinecap="round" />
                {/* Arm holding dumbbell at thigh */}
                <line x1="65" y1="48" x2="71" y2="78" className="stroke-slate-300" strokeWidth="3" strokeLinecap="round" />
                <rect x="66" y="76" width="11" height="6" rx="2" className="fill-teal-400/80" />
                <JointDot cx={65} cy={76} />
                <text x="16" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Stand tall, soft knees
                </text>
              </g>

              {/* Panel 2: Hips pushed straight back, flat neutral spine */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                {/* Hamstring & Glute highlight */}
                <ellipse cx="187" cy="88" rx="7" ry="13" className="fill-teal-400/20" />
                {/* Head aligned with flat spine */}
                <circle cx="228" cy="54" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                {/* Flat 35-deg torso */}
                <line x1="221" y1="58" x2="186" y2="78" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Hips back, slight knee bend, vertical shin */}
                <line x1="186" y1="78" x2="198" y2="98" className="stroke-teal-300" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="198" y1="98" x2="198" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="194" y1="117" x2="209" y2="117" className="stroke-teal-400" strokeWidth="3.2" strokeLinecap="round" />
                {/* Arms hanging straight down to mid-shin */}
                <line x1="214" y1="62" x2="206" y2="98" className="stroke-teal-300" strokeWidth="3" strokeLinecap="round" />
                <rect x="200" y="96" width="12" height="6" rx="2" className="fill-teal-400" />
                <JointDot cx={186} cy={78} highlight />
                <JointDot cx={198} cy={98} highlight />
                {/* Hip push-back arrow */}
                <line x1="182" y1="68" x2="164" y2="68" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ← Push hips back, keep spine flat
                </text>
              </g>
            </>
          )}

          {/* ==================== 4. KETTLEBELL SWING ==================== */}
          {variant === 'kb_swing' && (
            <>
              {/* Panel 1: Hinge back with weight between legs */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="84" cy="52" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="78" y1="56" x2="48" y2="78" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="48" y1="78" x2="62" y2="98" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="62" y1="98" x2="60" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="56" y1="117" x2="70" y2="117" className="stroke-slate-200" strokeWidth="3" strokeLinecap="round" />
                {/* Arms swinging bell back between legs */}
                <line x1="72" y1="60" x2="42" y2="88" className="stroke-slate-300" strokeWidth="3" strokeLinecap="round" />
                <circle cx="38" cy="92" r="6" className="fill-teal-400/80" />
                <JointDot cx={48} cy={78} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Hinge bell between legs
                </text>
              </g>

              {/* Panel 2: Tall snap, bell floating at chest height */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <circle cx="198" cy="34" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="198" y1="42" x2="198" y2="76" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                <line x1="198" y1="76" x2="198" y2="97" className="stroke-teal-300" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="198" y1="97" x2="198" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="194" y1="117" x2="208" y2="117" className="stroke-teal-400" strokeWidth="3.2" strokeLinecap="round" />
                {/* Arms extended at chest height */}
                <line x1="198" y1="50" x2="232" y2="52" className="stroke-teal-300" strokeWidth="3.2" strokeLinecap="round" />
                <circle cx="238" cy="52" r="6.5" className="fill-teal-400" />
                {/* Swing Arc */}
                <path
                  d="M 184 94 Q 236 92 238 62"
                  className="stroke-teal-400 fill-none"
                  strokeWidth="1.6"
                  strokeDasharray="3 2"
                  markerEnd={`url(#arrow-${id})`}
                />
                <JointDot cx={198} cy={76} highlight />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ⌒ Snap hips tall, float to chest
                </text>
              </g>
            </>
          )}

          {/* ==================== 5. LUNGE (Step-Back Split Lunge) ==================== */}
          {variant === 'lunge' && (
            <>
              {/* Panel 1: Split stance upright */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="34" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="65" y1="42" x2="65" y2="76" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Front leg */}
                <line x1="65" y1="76" x2="80" y2="96" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="80" y1="96" x2="82" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="79" y1="117" x2="90" y2="117" className="stroke-slate-200" strokeWidth="3" strokeLinecap="round" />
                {/* Back leg */}
                <line x1="65" y1="76" x2="46" y2="116" className="stroke-slate-400" strokeWidth="3.5" strokeLinecap="round" />
                <JointDot cx={65} cy={76} />
                <text x="16" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Long split stance
                </text>
              </g>

              {/* Panel 2: 90/90 Split Lunge bottom position */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="218" cy="92" rx="12" ry="6" className="fill-teal-400/20" />
                <circle cx="206" cy="46" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                {/* Vertical torso */}
                <line x1="206" y1="54" x2="206" y2="88" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Front thigh horizontal + vertical shin */}
                <line x1="206" y1="88" x2="230" y2="88" className="stroke-teal-300" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="230" y1="88" x2="230" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="226" y1="117" x2="239" y2="117" className="stroke-teal-400" strokeWidth="3.2" strokeLinecap="round" />
                {/* Back thigh vertical + back shin horizontal hovering off floor */}
                <line x1="206" y1="88" x2="204" y2="112" className="stroke-teal-400/80" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="204" y1="112" x2="182" y2="114" className="stroke-teal-400/80" strokeWidth="3.5" strokeLinecap="round" />
                <JointDot cx={206} cy={88} highlight />
                <JointDot cx={230} cy={88} highlight />
                <JointDot cx={204} cy={112} highlight />
                <line x1="184" y1="56" x2="184" y2="88" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↓ Both knees bend to 90°
                </text>
              </g>
            </>
          )}

          {/* ==================== 6. STEP-UP ONTO BENCH ==================== */}
          {variant === 'step_up' && (
            <>
              {/* Panel 1: Foot planted on sturdy box */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                {/* Step Box */}
                <rect x="74" y="96" width="34" height="22" rx="3" className="fill-slate-800 stroke-slate-600" strokeWidth="1.5" />
                <circle cx="58" cy="36" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="58" y1="44" x2="58" y2="78" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Back leg on floor */}
                <line x1="58" y1="78" x2="54" y2="116" className="stroke-slate-400" strokeWidth="3.8" strokeLinecap="round" />
                {/* Front leg planted on box */}
                <line x1="58" y1="78" x2="84" y2="76" className="stroke-slate-200" strokeWidth="4" strokeLinecap="round" />
                <line x1="84" y1="76" x2="84" y2="95" className="stroke-slate-200" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={58} cy={78} />
                <JointDot cx={84} cy={76} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Plant whole foot on step
                </text>
              </g>

              {/* Panel 2: Standing tall on top of the box */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <rect x="206" y="96" width="34" height="22" rx="3" className="fill-slate-800 stroke-teal-500/60" strokeWidth="1.5" />
                <circle cx="222" cy="18" r="7" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="222" y1="26" x2="222" y2="56" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                <line x1="222" y1="56" x2="222" y2="76" className="stroke-teal-300" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="222" y1="76" x2="222" y2="95" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={222} cy={56} highlight />
                <line x1="194" y1="84" x2="194" y2="44" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↑ Drive through top heel to stand
                </text>
              </g>
            </>
          )}

          {/* ==================== 7. KNEELING HIP FLEXOR STRETCH ==================== */}
          {variant === 'hip_flexor' && (
            <>
              {/* Panel 1: Half-kneeling 90/90 setup */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <rect x="46" y="113" width="18" height="5" rx="2" className="fill-slate-700" />
                <circle cx="55" cy="44" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="55" y1="52" x2="55" y2="86" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Back knee on pad */}
                <line x1="55" y1="86" x2="55" y2="112" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="55" y1="112" x2="34" y2="115" className="stroke-slate-400" strokeWidth="3.5" strokeLinecap="round" />
                {/* Front leg 90 deg */}
                <line x1="55" y1="86" x2="82" y2="86" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <line x1="82" y1="86" x2="82" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <JointDot cx={55} cy={86} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Kneel tall on cushion
                </text>
              </g>

              {/* Panel 2: Pelvis tucked & shifted gently forward */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <rect x="184" y="113" width="18" height="5" rx="2" className="fill-teal-500/40" />
                <ellipse cx="204" cy="92" rx="8" ry="12" className="fill-teal-400/25" />
                <circle cx="206" cy="42" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="206" y1="50" x2="206" y2="84" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Stretched back hip flexor */}
                <line x1="206" y1="84" x2="192" y2="112" className="stroke-teal-300" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="192" y1="112" x2="172" y2="115" className="stroke-teal-400/80" strokeWidth="3.5" strokeLinecap="round" />
                {/* Front leg */}
                <line x1="206" y1="84" x2="232" y2="84" className="stroke-teal-300" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="232" y1="84" x2="228" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={206} cy={84} highlight />
                <line x1="176" y1="74" x2="198" y2="74" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  → Shift hips gently forward
                </text>
              </g>
            </>
          )}

          {/* ==================== 8. PUSH (Elevated / Floor Plank Push-Up) ==================== */}
          {variant === 'push' && (
            <>
              {/* Panel 1: Straight Plank Position */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <rect x="88" y="98" width="24" height="19" rx="3" className="fill-slate-800 stroke-slate-600" strokeWidth="1.5" />
                <circle cx="98" cy="54" r="7" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                {/* Rigid straight body line */}
                <line x1="92" y1="60" x2="26" y2="115" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Straight extended arms */}
                <line x1="86" y1="65" x2="96" y2="97" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <JointDot cx={86} cy={65} />
                <JointDot cx={58} cy={88} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Straight plank head-to-heels
                </text>
              </g>

              {/* Panel 2: Chest lowered to bench/floor, elbows 45 deg */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <rect x="228" y="98" width="24" height="19" rx="3" className="fill-slate-800 stroke-teal-500/60" strokeWidth="1.5" />
                <ellipse cx="222" cy="84" rx="12" ry="7" className="fill-teal-400/20" />
                <circle cx="238" cy="74" r="7" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                {/* Lowered straight plank line */}
                <line x1="232" y1="80" x2="164" y2="115" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Bent elbow at 45 degrees */}
                <polyline
                  points="224,84 214,92 236,97"
                  className="stroke-teal-300 fill-none"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <JointDot cx={224} cy={84} highlight />
                <JointDot cx={214} cy={92} highlight />
                <line x1="238" y1="42" x2="238" y2="62" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↓ Lower chest, press back up
                </text>
              </g>
            </>
          )}

          {/* ==================== 9. ROW (One-Arm Bench Supported Row) ==================== */}
          {variant === 'row' && (
            <>
              {/* Panel 1: Flat tabletop back, weight hanging straight down */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                {/* Support Bench */}
                <rect x="54" y="90" width="54" height="8" rx="2" className="fill-slate-800 stroke-slate-600" />
                <line x1="60" y1="98" x2="60" y2="117" className="stroke-slate-600" strokeWidth="2.5" />
                <line x1="100" y1="98" x2="100" y2="117" className="stroke-slate-600" strokeWidth="2.5" />
                {/* Head & Tabletop Spine */}
                <circle cx="98" cy="58" r="7" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="90" y1="60" x2="46" y2="62" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Support leg on floor + support hand on bench */}
                <line x1="46" y1="62" x2="38" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="84" y1="60" x2="88" y2="90" className="stroke-slate-400" strokeWidth="3" strokeLinecap="round" />
                {/* Working arm hanging straight down */}
                <line x1="74" y1="62" x2="74" y2="98" className="stroke-slate-200" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="68" y="97" width="12" height="6" rx="2" className="fill-teal-400/80" />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Flat tabletop back, arm down
                </text>
              </g>

              {/* Panel 2: Elbow pulled up & back toward hip pocket */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <rect x="196" y="90" width="54" height="8" rx="2" className="fill-slate-800 stroke-slate-600" />
                <line x1="202" y1="98" x2="202" y2="117" className="stroke-slate-600" strokeWidth="2.5" />
                <line x1="242" y1="98" x2="242" y2="117" className="stroke-slate-600" strokeWidth="2.5" />
                <ellipse cx="204" cy="56" rx="14" ry="7" className="fill-teal-400/20" />
                <circle cx="240" cy="58" r="7" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="232" y1="60" x2="188" y2="62" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                <line x1="188" y1="62" x2="180" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="226" y1="60" x2="230" y2="90" className="stroke-slate-400" strokeWidth="3" strokeLinecap="round" />
                {/* Rowed elbow high & back toward hip */}
                <polyline
                  points="214,61 196,46 202,68"
                  className="stroke-teal-300 fill-none"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="196" y="66" width="12" height="6" rx="2" className="fill-teal-400" />
                <JointDot cx={196} cy={46} highlight />
                <line x1="214" y1="84" x2="198" y2="54" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↗ Pull elbow back to hip pocket
                </text>
              </g>
            </>
          )}

          {/* ==================== 10. PRESS (Half-Kneeling Overhead Press) ==================== */}
          {variant === 'press' && (
            <>
              {/* Panel 1: Half-kneeling, dumbbell racked at shoulder */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="62" cy="44" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="62" y1="52" x2="62" y2="86" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Half-kneeling legs */}
                <line x1="62" y1="86" x2="62" y2="115" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="62" y1="115" x2="42" y2="115" className="stroke-slate-400" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="62" y1="86" x2="86" y2="86" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="86" y1="86" x2="86" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                {/* Arm racked at shoulder */}
                <polyline points="62,56 76,68 74,50" className="stroke-slate-200 fill-none" strokeWidth="3.2" strokeLinecap="round" />
                <rect x="68" y="45" width="12" height="5" rx="2" className="fill-teal-400/80" />
                <JointDot cx={62} cy={56} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Weight racked at shoulder
                </text>
              </g>

              {/* Panel 2: Pressed straight overhead inline with ear */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="204" cy="54" rx="9" ry="7" className="fill-teal-400/25" />
                <circle cx="204" cy="44" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="204" y1="52" x2="204" y2="86" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                <line x1="204" y1="86" x2="204" y2="115" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="204" y1="115" x2="184" y2="115" className="stroke-teal-400/80" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="204" y1="86" x2="228" y2="86" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="228" y1="86" x2="228" y2="116" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                {/* Arm locked overhead beside ear */}
                <line x1="204" y1="56" x2="208" y2="20" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <rect x="202" y="15" width="12" height="5" rx="2" className="fill-teal-400" />
                <JointDot cx={204} cy={56} highlight />
                <line x1="222" y1="54" x2="222" y2="22" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↑ Press straight up beside ear
                </text>
              </g>
            </>
          )}

          {/* ==================== 11. CARRY (One-Hand Suitcase Weight Walk) ==================== */}
          {variant === 'carry' && (
            <>
              {/* Panel 1: Front View - Standing tall holding weight in 1 hand */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="34" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                {/* Level shoulder bar */}
                <line x1="50" y1="46" x2="80" y2="46" className="stroke-slate-200" strokeWidth="4" strokeLinecap="round" />
                {/* Vertical torso */}
                <line x1="65" y1="46" x2="65" y2="80" className="stroke-slate-200" strokeWidth="5" strokeLinecap="round" />
                {/* Legs */}
                <line x1="58" y1="80" x2="58" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="72" y1="80" x2="72" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                {/* Left arm free, Right arm holding heavy suitcase weight */}
                <line x1="50" y1="46" x2="46" y2="76" className="stroke-slate-400" strokeWidth="3" strokeLinecap="round" />
                <line x1="80" y1="46" x2="82" y2="78" className="stroke-slate-200" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="76" y="78" width="12" height="14" rx="2.5" className="fill-teal-400/80" />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Hold weight in one hand
                </text>
              </g>

              {/* Panel 2: Walking tall with level shoulders & braced side-core */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                {/* Oblique core highlight */}
                <ellipse cx="198" cy="64" rx="9" ry="13" className="fill-teal-400/25" />
                {/* Level alignment guide */}
                <line x1="176" y1="46" x2="238" y2="46" className="stroke-teal-400/50" strokeDasharray="2 2" strokeWidth="1.2" />
                <circle cx="206" cy="34" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="191" y1="46" x2="221" y2="46" className="stroke-teal-400" strokeWidth="4.2" strokeLinecap="round" />
                <line x1="206" y1="46" x2="206" y2="80" className="stroke-teal-400" strokeWidth="5" strokeLinecap="round" />
                {/* Walking stride legs */}
                <line x1="200" y1="80" x2="194" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="212" y1="80" x2="218" y2="110" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                {/* Arms & Suitcase Weight */}
                <line x1="191" y1="46" x2="185" y2="74" className="stroke-teal-300" strokeWidth="3" strokeLinecap="round" />
                <line x1="221" y1="46" x2="223" y2="78" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <rect x="217" y="78" width="12" height="14" rx="2.5" className="fill-teal-400" />
                <JointDot cx={191} cy={46} highlight />
                <JointDot cx={221} cy={46} highlight />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  — Walk tall, keep shoulders level
                </text>
              </g>
            </>
          )}

          {/* ==================== 12. WALK (Brisk Walk / Cardio Stride) ==================== */}
          {variant === 'walk' && (
            <>
              {/* Panel 1: Upright easy walking posture */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="62" cy="34" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="62" y1="42" x2="62" y2="76" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Gentle step */}
                <line x1="62" y1="76" x2="72" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="62" y1="76" x2="52" y2="116" className="stroke-slate-400" strokeWidth="3.5" strokeLinecap="round" />
                {/* Relaxed arm swing */}
                <line x1="62" y1="48" x2="54" y2="72" className="stroke-slate-300" strokeWidth="3" strokeLinecap="round" />
                <line x1="62" y1="48" x2="70" y2="72" className="stroke-slate-300" strokeWidth="3" strokeLinecap="round" />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Tall posture, eyes forward
                </text>
              </g>

              {/* Panel 2: Purposeful brisk stride with arm swing */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="206" cy="56" rx="9" ry="11" className="fill-teal-400/20" />
                <circle cx="208" cy="34" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="208" y1="42" x2="204" y2="76" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Front striding leg & back push-off leg */}
                <polyline points="204,76 222,96 228,116" className="stroke-teal-300 fill-none" strokeWidth="4" strokeLinecap="round" />
                <polyline points="204,76 188,96 178,115" className="stroke-teal-400/80 fill-none" strokeWidth="3.8" strokeLinecap="round" />
                {/* Active bent-elbow arm swing */}
                <polyline points="206,48 218,62 226,54" className="stroke-teal-300 fill-none" strokeWidth="3.2" strokeLinecap="round" />
                <polyline points="206,48 192,62 186,70" className="stroke-teal-400/80 fill-none" strokeWidth="3" strokeLinecap="round" />
                <JointDot cx={204} cy={76} highlight />
                <line x1="226" y1="36" x2="252" y2="36" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  → Brisk stride & natural arm swing
                </text>
              </g>
            </>
          )}

          {/* ==================== 13. STRETCH (Chest & Shoulder Band Opener) ==================== */}
          {variant === 'stretch' && (
            <>
              {/* Panel 1: Holding band/towel in front of chest */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="34" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="50" y1="48" x2="80" y2="48" className="stroke-slate-200" strokeWidth="4" strokeLinecap="round" />
                <line x1="65" y1="48" x2="65" y2="82" className="stroke-slate-200" strokeWidth="5" strokeLinecap="round" />
                <line x1="58" y1="82" x2="58" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="72" y1="82" x2="72" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                {/* Hands holding band narrow in front */}
                <line x1="50" y1="48" x2="56" y2="62" className="stroke-slate-300" strokeWidth="3" strokeLinecap="round" />
                <line x1="80" y1="48" x2="74" y2="62" className="stroke-slate-300" strokeWidth="3" strokeLinecap="round" />
                <line x1="56" y1="62" x2="74" y2="62" className="stroke-teal-400" strokeWidth="2.5" />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Hold band at chest height
                </text>
              </g>

              {/* Panel 2: Arms opened wide, shoulder blades squeezed */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="208" cy="52" rx="18" ry="8" className="fill-teal-400/25" />
                <circle cx="208" cy="34" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="192" y1="48" x2="224" y2="48" className="stroke-teal-400" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="208" y1="48" x2="208" y2="82" className="stroke-teal-400" strokeWidth="5" strokeLinecap="round" />
                <line x1="201" y1="82" x2="201" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="215" y1="82" x2="215" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                {/* Arms stretched wide apart */}
                <line x1="192" y1="48" x2="168" y2="52" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="224" y1="48" x2="248" y2="52" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                {/* Stretched band across chest */}
                <line x1="168" y1="52" x2="248" y2="52" className="stroke-teal-400" strokeWidth="2" strokeDasharray="3 2" />
                <JointDot cx={168} cy={52} highlight />
                <JointDot cx={248} cy={52} highlight />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ← → Open wide & squeeze back
                </text>
              </g>
            </>
          )}

          {/* ==================== 14. SEATED 90/90 HIP TWIST ==================== */}
          {variant === 'hip_90_90' && (
            <>
              {/* Panel 1: Seated on floor with knees bent wide */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="52" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="65" y1="60" x2="65" y2="96" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Wide bent knees on floor */}
                <polyline points="65,96 44,88 38,116" className="stroke-slate-300 fill-none" strokeWidth="3.8" strokeLinecap="round" />
                <polyline points="65,96 86,88 92,116" className="stroke-slate-300 fill-none" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={65} cy={96} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Sit tall, knees bent wide
                </text>
              </g>

              {/* Panel 2: Both knees rotated 90/90 to one side */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="208" cy="98" rx="18" ry="8" className="fill-teal-400/20" />
                <circle cx="208" cy="50" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="208" y1="58" x2="208" y2="96" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* 90/90 knees dropped to right side */}
                <polyline points="208,96 232,102 246,115" className="stroke-teal-300 fill-none" strokeWidth="4" strokeLinecap="round" />
                <polyline points="208,96 190,108 214,115" className="stroke-teal-400/80 fill-none" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={208} cy={96} highlight />
                <path d="M 186 78 Q 208 68 230 78" className="stroke-teal-400 fill-none" strokeWidth="1.6" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↺ ↻ Sweep knees side to side
                </text>
              </g>
            </>
          )}

          {/* ==================== 15. FULL-BODY JOINT CIRCLES ==================== */}
          {variant === 'joint_circles' && (
            <>
              {/* Panel 1: Neck & Shoulder Circles */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                <circle cx="65" cy="36" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <circle cx="65" cy="36" r="13" className="stroke-teal-400/60 fill-none" strokeDasharray="2 2" strokeWidth="1.2" />
                <line x1="50" y1="50" x2="80" y2="50" className="stroke-slate-200" strokeWidth="4" strokeLinecap="round" />
                <line x1="65" y1="50" x2="65" y2="82" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="58" y1="82" x2="58" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="72" y1="82" x2="72" y2="116" className="stroke-slate-300" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={50} cy={50} highlight />
                <JointDot cx={80} cy={50} highlight />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Neck & shoulder rolls
                </text>
              </g>

              {/* Panel 2: Hands on Hips Wide Hip Circles */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                <ellipse cx="208" cy="80" rx="22" ry="9" className="stroke-teal-400 fill-teal-400/15" strokeDasharray="3 2" strokeWidth="1.5" />
                <circle cx="208" cy="36" r="7.5" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="208" y1="44" x2="208" y2="80" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Hands on hips */}
                <polyline points="208,50 190,64 198,78" className="stroke-teal-300 fill-none" strokeWidth="3" strokeLinecap="round" />
                <polyline points="208,50 226,64 218,78" className="stroke-teal-300 fill-none" strokeWidth="3" strokeLinecap="round" />
                <line x1="200" y1="80" x2="196" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <line x1="216" y1="80" x2="220" y2="116" className="stroke-teal-300" strokeWidth="3.8" strokeLinecap="round" />
                <JointDot cx={208} cy={80} highlight />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↻ Smooth 360° hip & joint circles
                </text>
              </g>
            </>
          )}

          {/* ==================== 16. LEGS-UP-THE-WALL EVENING RELAX ==================== */}
          {variant === 'legs_up_wall' && (
            <>
              {/* Panel 1: Sitting beside wall preparing to lie back */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                {/* Wall */}
                <line x1="114" y1="22" x2="114" y2="118" className="stroke-slate-500" strokeWidth="3" />
                <circle cx="62" cy="64" r="7.5" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="62" y1="72" x2="78" y2="108" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="78" y1="108" x2="108" y2="114" className="stroke-slate-300" strokeWidth="4" strokeLinecap="round" />
                <JointDot cx={78} cy={108} />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Sit close beside the wall
                </text>
              </g>

              {/* Panel 2: Back flat on floor mat, legs vertical up the wall */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                {/* Wall on right */}
                <line x1="248" y1="22" x2="248" y2="118" className="stroke-teal-500/70" strokeWidth="3.5" />
                {/* Floor Mat */}
                <rect x="166" y="113" width="82" height="5" rx="2" className="fill-teal-400/30" />
                {/* Head resting on floor */}
                <circle cx="178" cy="105" r="7" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                {/* Flat relaxed torso on mat */}
                <line x1="186" y1="108" x2="240" y2="108" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Both legs resting straight vertically up the wall */}
                <line x1="240" y1="108" x2="242" y2="42" className="stroke-teal-300" strokeWidth="4.5" strokeLinecap="round" />
                {/* Foot flexed at top */}
                <line x1="242" y1="42" x2="232" y2="42" className="stroke-teal-400" strokeWidth="3.2" strokeLinecap="round" />
                <JointDot cx={240} cy={108} highlight />
                <line x1="224" y1="88" x2="224" y2="48" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↑ Back flat, legs vertical up wall
                </text>
              </g>
            </>
          )}

          {/* ==================== 17. HANG (Overhead Bar Hang / Spine Decompression) ==================== */}
          {variant === 'hang' && (
            <>
              {/* Panel 1: Reaching up to grip overhead bar */}
              <g opacity={highlightPhase === 'active' ? 0.35 : 1}>
                {/* Overhead Bar */}
                <line x1="40" y1="24" x2="90" y2="24" className="stroke-slate-400" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="65" cy="48" r="7" className="stroke-slate-300 fill-slate-900" strokeWidth="2.2" />
                <line x1="65" y1="56" x2="65" y2="86" className="stroke-slate-200" strokeWidth="4.5" strokeLinecap="round" />
                {/* Arms reaching up to grip bar */}
                <line x1="60" y1="56" x2="54" y2="25" className="stroke-slate-300" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="70" y1="56" x2="76" y2="25" className="stroke-slate-300" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="60" y1="86" x2="60" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="70" y1="86" x2="70" y2="116" className="stroke-slate-300" strokeWidth="3.5" strokeLinecap="round" />
                <text x="14" y="131" className="fill-slate-400 font-mono text-[8px]">
                  Grip overhead bar firmly
                </text>
              </g>

              {/* Panel 2: Active Dead Hang decompressing spine & shoulders */}
              <g opacity={highlightPhase === 'start' ? 0.35 : 1}>
                {/* Overhead Bar */}
                <line x1="182" y1="24" x2="234" y2="24" className="stroke-teal-400" strokeWidth="3.5" strokeLinecap="round" />
                {/* Shoulder & Spine Decompression Glow */}
                <ellipse cx="208" cy="68" rx="9" ry="18" className="fill-teal-400/20" />
                <circle cx="208" cy="48" r="7" className="stroke-teal-400 fill-slate-900" strokeWidth="2.2" />
                <line x1="208" y1="56" x2="208" y2="88" className="stroke-teal-400" strokeWidth="4.8" strokeLinecap="round" />
                {/* Arms hanging straight from bar */}
                <line x1="202" y1="56" x2="196" y2="25" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="214" y1="56" x2="220" y2="25" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                {/* Legs hanging relaxed */}
                <line x1="204" y1="88" x2="204" y2="112" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="212" y1="88" x2="212" y2="112" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" />
                <JointDot cx={196} cy={25} highlight />
                <JointDot cx={220} cy={25} highlight />
                <line x1="234" y1="58" x2="234" y2="92" className="stroke-teal-400" strokeWidth="1.8" markerEnd={`url(#arrow-${id})`} />
                <text x="156" y="131" className="fill-teal-300 font-mono text-[8px]">
                  ↓ Relax ribs & lengthen spine
                </text>
              </g>
            </>
          )}
        </svg>
      </div>

      {/* Clear Visual Direction Callout & Target Muscles */}
      <div className="mt-3 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 block mb-0.5">
            Movement Direction:
          </span>
          {movement.visualDirection}
        </div>
        <div className="flex items-center justify-between text-[11px] px-1">
          <span className="text-slate-400">Works:</span>
          <span className="font-mono text-teal-300 font-medium">{movement.musclesWorked}</span>
        </div>
      </div>
    </div>
  );
};

export const VitalityRegimens: React.FC<VitalityRegimensProps> = ({
  selectedDate,
  vitalityState,
  habits,
  onUpdateVitalityState,
  onAdoptExercisePlanAsHabit,
  onAdoptEatingPlanAsHabit,
  onNavigateToJournal,
}) => {
  const [sectionMode, setSectionMode] = useState<'exercise' | 'eating'>('exercise');
  const [selectedScheduleDayIdx, setSelectedScheduleDayIdx] = useState<number>(0);
  const [adoptedToast, setAdoptedToast] = useState<string | null>(null);

  const activeExercisePlan =
    EXERCISE_PLANS.find(p => p.id === vitalityState.activeExercisePlanId) || EXERCISE_PLANS[0];
  const activeEatingPlan =
    EATING_PLANS.find(p => p.id === vitalityState.activeEatingPlanId) || EATING_PLANS[0];

  const currentDaySchedule =
    activeExercisePlan.weeklySchedule[selectedScheduleDayIdx] ||
    activeExercisePlan.weeklySchedule[0];

  const completedMovementsToday = vitalityState.completedMovementsByDate[selectedDate] || [];
  const completedMealsToday = vitalityState.completedMealsByDate[selectedDate] || [];
  const waterGlassesToday = vitalityState.waterGlassesByDate[selectedDate] || 0;

  const handleSelectExercisePlan = (planId: string) => {
    setSelectedScheduleDayIdx(0);
    onUpdateVitalityState({
      ...vitalityState,
      activeExercisePlanId: planId,
    });
  };

  const handleSelectEatingPlan = (planId: string) => {
    onUpdateVitalityState({
      ...vitalityState,
      activeEatingPlanId: planId,
    });
  };

  const handleToggleMovement = (movementId: string) => {
    const exists = completedMovementsToday.includes(movementId);
    const nextList = exists
      ? completedMovementsToday.filter(id => id !== movementId)
      : [...completedMovementsToday, movementId];

    if (!exists) {
      confetti({
        particleCount: 18,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#14b8a6', '#e2e8f0'],
      });
    }

    onUpdateVitalityState({
      ...vitalityState,
      completedMovementsByDate: {
        ...vitalityState.completedMovementsByDate,
        [selectedDate]: nextList,
      },
    });
  };

  const handleToggleMeal = (mealId: string) => {
    const exists = completedMealsToday.includes(mealId);
    const nextList = exists
      ? completedMealsToday.filter(id => id !== mealId)
      : [...completedMealsToday, mealId];

    if (!exists) {
      confetti({
        particleCount: 18,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#10b981', '#e2e8f0'],
      });
    }

    onUpdateVitalityState({
      ...vitalityState,
      completedMealsByDate: {
        ...vitalityState.completedMealsByDate,
        [selectedDate]: nextList,
      },
    });
  };

  const handleSetWaterGlasses = (glasses: number) => {
    const clamped = Math.max(0, Math.min(14, glasses));
    onUpdateVitalityState({
      ...vitalityState,
      waterGlassesByDate: {
        ...vitalityState.waterGlassesByDate,
        [selectedDate]: clamped,
      },
    });
  };

  const handleToggleGroceryItem = (item: string) => {
    const checked = vitalityState.checkedGroceryItems || [];
    const exists = checked.includes(item);
    const next = exists ? checked.filter(i => i !== item) : [...checked, item];
    onUpdateVitalityState({
      ...vitalityState,
      checkedGroceryItems: next,
    });
  };

  const triggerAdoptBanner = (label: string) => {
    setAdoptedToast(label);
    setTimeout(() => setAdoptedToast(null), 3500);
  };

  const isExercisePlanInHabits = habits.some(
    h => !h.archived && h.title.toLowerCase().includes(activeExercisePlan.title.toLowerCase())
  );
  const isEatingPlanInHabits = habits.some(
    h => !h.archived && h.title.toLowerCase().includes(activeEatingPlan.title.toLowerCase())
  );

  const eatenMacrosToday = activeEatingPlan.meals
    .filter(m => completedMealsToday.includes(m.id))
    .reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.proteinGrams,
        carbs: acc.carbs + m.carbsGrams,
        fats: acc.fats + m.fatsGrams,
        fiber: acc.fiber + m.fiberGrams,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );

  return (
    <div className="space-y-8">
      {/* Header & Mode Switcher */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-1.5">
            Healthy Body & Daily Energy
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-white tracking-tight">
            Exercise & Healthy Meal Guides
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Clear, step-by-step exercise illustrations and practical whole-food meal plans designed to rebuild your energy and keep cravings away.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start lg:self-auto shrink-0">
          <button
            onClick={() => setSectionMode('exercise')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              sectionMode === 'exercise'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Exercise Plans (3)</span>
          </button>

          <button
            onClick={() => setSectionMode('eating')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              sectionMode === 'eating'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Healthy Meal Plans (3)</span>
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {adoptedToast && (
        <div className="studio-card rounded-xl p-4 border-teal-500/40 bg-teal-500/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-100">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              Added <strong className="text-white">{adoptedToast}</strong> to your Today Habit Tracker.
            </span>
          </div>
          <button
            onClick={onNavigateToJournal}
            className="text-xs font-mono text-teal-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Today View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ==================== MODE 1: EXERCISE PLANS ==================== */}
      {sectionMode === 'exercise' && (
        <div className="space-y-7">
          {/* 3 Exercise Plan Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXERCISE_PLANS.map(plan => {
              const isSelected = plan.id === activeExercisePlan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => handleSelectExercisePlan(plan.id)}
                  className={`text-left p-5 rounded-xl transition-all cursor-pointer flex flex-col justify-between studio-card ${
                    isSelected
                      ? 'ring-1 ring-teal-400 border-teal-400/70'
                      : 'opacity-80 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs text-teal-400 font-semibold">
                        PLAN {plan.numberLabel} · {plan.daysPerWeek} DAYS/WK
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/15 text-teal-300 font-semibold">
                          Selected
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-semibold text-white tracking-tight">
                      {plan.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                    <span>{plan.sessionMinutes} mins / session</span>
                    <span className="text-slate-300">{plan.level.split('·')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Exercise Plan Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left 8 Columns: Visual Exercise Cards */}
            <div className="lg:col-span-8 space-y-5">
              {/* Plan Summary Bar */}
              <div className="studio-card rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400">
                      {activeExercisePlan.primaryGoal}
                    </span>
                    <h2 className="text-xl font-semibold text-white mt-0.5">
                      {activeExercisePlan.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
                      {activeExercisePlan.overview}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onAdoptExercisePlanAsHabit(activeExercisePlan);
                      triggerAdoptBanner(activeExercisePlan.title);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isExercisePlanInHabits
                        ? 'bg-slate-800 text-teal-300 border border-teal-500/30'
                        : 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                    }`}
                  >
                    {isExercisePlanInHabits ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved in My Today Habits</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Exercise Plan to My Habits</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Day Selector Tabs */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {activeExercisePlan.weeklySchedule.map((day, idx) => {
                    const active = idx === selectedScheduleDayIdx;
                    return (
                      <button
                        key={day.dayLabel}
                        onClick={() => setSelectedScheduleDayIdx(idx)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 border ${
                          active
                            ? 'bg-slate-100 text-slate-950 border-white font-semibold'
                            : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                        }`}
                      >
                        {day.dayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Exercises List */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {currentDaySchedule.dayLabel}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Goal: <span className="text-slate-200">{currentDaySchedule.focus}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      {currentDaySchedule.durationMinutes} mins
                    </span>
                    <span>·</span>
                    <span> Effort: {currentDaySchedule.intensity}</span>
                  </div>
                </div>

                {currentDaySchedule.movements.map((mov, index) => {
                  const isDone = completedMovementsToday.includes(mov.id);
                  return (
                    <div
                      key={mov.id}
                      className={`studio-card rounded-xl p-5 transition-all ${
                        isDone ? 'border-teal-500/40 bg-teal-950/10' : ''
                      }`}
                    >
                      {/* Top Header of Exercise Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleMovement(mov.id)}
                            className={`w-7 h-7 rounded-lg mt-0.5 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isDone
                                ? 'bg-teal-400 text-slate-950 font-bold'
                                : 'bg-slate-950 border border-slate-700 hover:border-teal-400 text-slate-400'
                            }`}
                            title={isDone ? 'Completed today' : 'Mark exercise done'}
                          >
                            {isDone ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <span className="font-mono text-xs">{index + 1}</span>
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-base font-semibold ${
                                  isDone ? 'line-through text-slate-400' : 'text-white'
                                }`}
                              >
                                {mov.name}
                              </h4>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                                {mov.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {mov.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <span className="font-mono text-xs text-teal-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg tabular-nums font-medium">
                            {mov.Prescription}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleMovement(mov.id)}
                            className="text-[11px] font-mono text-slate-400 hover:text-teal-300 cursor-pointer"
                          >
                            {isDone ? '✓ Done Today' : 'Mark Done'}
                          </button>
                        </div>
                      </div>

                      {/* Bottom 2-Column Body: Step-by-Step Instructions + Accurate Anatomical Diagram */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 items-stretch">
                        {/* Left 7 Cols: Plain-Word Steps */}
                        <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 font-semibold">
                              How to Do It (Step-by-Step):
                            </div>
                            <ol className="space-y-2.5">
                              {mov.stepByStep.map((stepText, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed"
                                >
                                  <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-300 font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                    {sIdx + 1}
                                  </span>
                                  <span>{stepText}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                            <strong className="text-teal-400 font-mono uppercase text-[10px] tracking-wider mr-1.5">
                              Coach Tip:
                            </strong>
                            {mov.focusCue}
                          </div>
                        </div>

                        {/* Right 5 Cols: Accurate Anatomical Exercise Diagram */}
                        <div className="md:col-span-5">
                          <ExerciseVisualDiagram movement={mov} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Columns: Today's Exercise Summary */}
            <aside className="lg:col-span-4 space-y-5">
              <div className="studio-card rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                    Today's Workout Progress
                  </span>
                  <span className="font-mono text-xs text-teal-400 font-semibold tabular-nums">
                    {
                      currentDaySchedule.movements.filter(m =>
                        completedMovementsToday.includes(m.id)
                      ).length
                    }{' '}
                    / {currentDaySchedule.movements.length} done
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-teal-400 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (currentDaySchedule.movements.filter(m =>
                          completedMovementsToday.includes(m.id)
                        ).length /
                          Math.max(1, currentDaySchedule.movements.length)) *
                          100
                      )}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Check off each exercise as you finish it. Click <strong className="text-slate-200">1. Start</strong> or <strong className="text-slate-200">2. Action</strong> on any diagram to focus on a single posture phase.
                </p>
              </div>

              <div className="studio-card rounded-xl p-5 space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Daily Habit Steps Included
                </div>
                <div className="divide-y divide-slate-800/70">
                  {activeExercisePlan.routineStepsForHabit.map((step, i) => (
                    <div key={i} className="py-2.5 first:pt-1 last:pb-0">
                      <div className="flex items-center justify-between text-xs font-medium text-white">
                        <span>{step.title}</span>
                        <span className="font-mono text-[10px] text-teal-400">{step.timing}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ==================== MODE 2: HEALTHY MEAL PLANS ==================== */}
      {sectionMode === 'eating' && (
        <div className="space-y-7">
          {/* 3 Meal Plan Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EATING_PLANS.map(plan => {
              const isSelected = plan.id === activeEatingPlan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => handleSelectEatingPlan(plan.id)}
                  className={`text-left p-5 rounded-xl transition-all cursor-pointer flex flex-col justify-between studio-card ${
                    isSelected
                      ? 'ring-1 ring-teal-400 border-teal-400/70'
                      : 'opacity-80 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs text-teal-400 font-semibold">
                        MEAL PLAN {plan.numberLabel} · {plan.dailyCalories} CALS
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/15 text-teal-300 font-semibold">
                          Selected
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-semibold text-white tracking-tight">
                      {plan.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                    <span>{plan.macroSplit.proteinGrams}g Protein</span>
                    <span>{plan.macroSplit.fiberGrams}g Fiber</span>
                    <span className="text-slate-300">{plan.eatingWindow}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Meal Plan Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left 8 Columns: Daily Meals */}
            <div className="lg:col-span-8 space-y-4">
              <div className="studio-card rounded-xl p-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400">
                    Eating Hours: {activeEatingPlan.eatingWindow}
                  </span>
                  <h2 className="text-xl font-semibold text-white mt-0.5">
                    {activeEatingPlan.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
                    {activeEatingPlan.philosophy}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onAdoptEatingPlanAsHabit(activeEatingPlan);
                    triggerAdoptBanner(activeEatingPlan.title);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isEatingPlanInHabits
                      ? 'bg-slate-800 text-teal-300 border border-teal-500/30'
                      : 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                  }`}
                >
                  {isEatingPlanInHabits ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved in My Today Habits</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Meal Plan to My Habits</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Daily Meals */}
              <div className="space-y-3.5">
                {activeEatingPlan.meals.map(meal => {
                  const isEaten = completedMealsToday.includes(meal.id);
                  return (
                    <div
                      key={meal.id}
                      onClick={() => handleToggleMeal(meal.id)}
                      className={`studio-card rounded-xl p-5 transition-all cursor-pointer ${
                        isEaten ? 'border-teal-500/40 bg-teal-950/10' : 'hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-6 h-6 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                              isEaten
                                ? 'bg-teal-400 text-slate-950'
                                : 'bg-slate-950 border border-slate-700 text-slate-500'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono text-[11px] uppercase tracking-wider text-teal-400">
                                {meal.slotLabel}
                              </span>
                              <span className="text-slate-700">·</span>
                              <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {meal.prepMinutes}m prep
                              </span>
                            </div>

                            <h3
                              className={`text-base font-semibold mt-1 ${
                                isEaten ? 'line-through text-slate-400' : 'text-white'
                              }`}
                            >
                              {meal.name}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {meal.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mt-3">
                              {meal.keyIngredients.map(ing => (
                                <span
                                  key={ing}
                                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                                >
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <div className="font-mono text-sm font-semibold text-white tabular-nums flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span>{meal.calories} cal</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 tabular-nums">
                            <span className="text-teal-300">{meal.proteinGrams}g protein</span>
                            <span>·</span>
                            <span>{meal.fiberGrams}g fiber</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Columns: Nutrition, Water & Grocery Checklist */}
            <aside className="lg:col-span-4 space-y-5">
              <div className="studio-card rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                    Today's Food Log
                  </span>
                  <span className="font-mono text-xs text-teal-400 tabular-nums">
                    {completedMealsToday.length} / {activeEatingPlan.meals.length} meals eaten
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-mono tabular-nums">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 uppercase">Calories</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {eatenMacrosToday.calories} / {activeEatingPlan.dailyCalories}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 uppercase">Protein</div>
                    <div className="text-sm font-semibold text-teal-300 mt-0.5">
                      {eatenMacrosToday.protein}g / {activeEatingPlan.macroSplit.proteinGrams}g
                    </div>
                  </div>
                </div>

                {/* Water Glasses Tracker */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-200 font-medium flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span>Water Glasses Today</span>
                    </span>
                    <span className="font-mono text-sky-400 font-semibold tabular-nums">
                      {waterGlassesToday} / 8 glasses
                    </span>
                  </div>

                  <div className="grid grid-cols-8 gap-1.5">
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const filled = idx < waterGlassesToday;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            handleSetWaterGlasses(
                              waterGlassesToday === idx + 1 ? idx : idx + 1
                            )
                          }
                          className={`h-8 rounded-md border font-mono text-[11px] transition-all cursor-pointer flex items-center justify-center ${
                            filled
                              ? 'bg-sky-500/25 border-sky-400 text-sky-200 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shopping List */}
              <div className="studio-card rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                    <span>Shopping List</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Tap to check off</span>
                </div>

                <div className="space-y-4">
                  {activeEatingPlan.stapleGroceryList.map(group => (
                    <div key={group.category}>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 mb-1.5">
                        {group.category}
                      </div>
                      <div className="divide-y divide-slate-800/50 border-t border-slate-800/60">
                        {group.items.map(item => {
                          const isChecked = (vitalityState.checkedGroceryItems || []).includes(
                            item
                          );
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleToggleGroceryItem(item)}
                              className="w-full py-1.5 flex items-center gap-2.5 text-left text-xs cursor-pointer group"
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-teal-400 text-slate-950'
                                    : 'border border-slate-700 bg-slate-950 group-hover:border-slate-500'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span
                                className={
                                  isChecked
                                    ? 'line-through text-slate-500'
                                    : 'text-slate-200 group-hover:text-white'
                                }
                              >
                                {item}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};
