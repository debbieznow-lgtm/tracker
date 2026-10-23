/**
 * Pure Web Audio API chime synthesizer for Urge Surfing and Breathwork.
 * Generates soothing singing bowl / mindfulness bell harmonics without external assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playMindfulBell(type: 'gentle' | 'deep' | 'finish' = 'gentle'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = type === 'deep' ? 220 : type === 'finish' ? 528 : 396; // 528Hz is known as transformation frequency

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'finish' ? 3.5 : 2.5));
    masterGain.connect(ctx.destination);

    // Fundamental oscillator (sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);

    // Harmonic overtone
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.76, now);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.12, now);
    osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc1.connect(masterGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 4);
    osc2.stop(now + 4);
  } catch (e) {
    // Audio might be blocked by autoplay policies until user interacts
  }
}
