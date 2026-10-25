// Web Audio API Holiday Jingle Bells Synthesizer
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playJingleBellChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Notes sequence for Jingle bells: E5, E5, E5, G5, C5, D5, E5
  const notes = [
    { freq: 659.25, time: 0.00, dur: 0.18 }, // E5
    { freq: 659.25, time: 0.20, dur: 0.18 }, // E5
    { freq: 659.25, time: 0.40, dur: 0.35 }, // E5
    { freq: 783.99, time: 0.85, dur: 0.22 }, // G5
    { freq: 523.25, time: 1.10, dur: 0.22 }, // C5
    { freq: 587.33, time: 1.35, dur: 0.22 }, // D5
    { freq: 659.25, time: 1.60, dur: 0.50 }, // E5
  ];

  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Metallic chime spectrum
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    // Envelope
    gain.gain.setValueAtTime(0, now + note.time);
    gain.gain.linearRampToValueAtTime(0.18, now + note.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.dur);
  });
}

export function playSoftSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0, now + idx * 0.06);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.35);
  });
}
