// Simple synthesizer using the native browser Web Audio API
// Fully safe to call and fails gracefully if context cannot be initialized

export function playChime(isCorrect: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (isCorrect) {
      // Pleasant dual tone chime (C5 -> E5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      // Muted buzzy tone (B3 -> Ab3)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(246.94, now); // B3
      osc.frequency.setValueAtTime(207.65, now + 0.08); // Ab3
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    // Fail silently to avoid interrupting gameplay on restricted frames
    console.debug("Web Audio API not allowed or restricted by container frame permissions", err);
  }
}
