import { Howl } from 'howler';

type SoundKey =
  | 'lightsOut'
  | 'engineStart'
  | 'radioStatic'
  | 'radioBeep'
  | 'click'
  | 'whoosh'
  | 'ding'
  | 'applause'
  | 'firework'
  | 'pop'
  | 'hit'
  | 'achievement'
  | 'drs'
  | 'chequered';

class AudioManager {
  private ctx: AudioContext | null = null;
  private unlocked = false;
  private muted = false;
  private loaded: Partial<Record<SoundKey, Howl>> = {};
  private urlHowls = new Map<string, Howl>();
  private listeners = new Set<(muted: boolean) => void>();

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    return this.ctx;
  }

  unlock() {
    if (this.unlocked) return;
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(m: boolean) {
    this.muted = m;
    Howler.mute(m);
    this.listeners.forEach((l) => l(m));
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  onMuteChange(cb: (muted: boolean) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  load(key: SoundKey, src: string, loop = false) {
    if (this.loaded[key]) return;
    this.loaded[key] = new Howl({ src: [src], loop, html5: false });
  }

  playLoaded(key: SoundKey) {
    const h = this.loaded[key];
    if (h && !this.muted) h.play();
  }

  stopLoaded(key: SoundKey) {
    const h = this.loaded[key];
    if (h) h.stop();
  }

  // --- Procedural tones via Web Audio (no asset files needed) ---

  tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.15,
    startAt = 0,
  ) {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime + startAt;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  noise(duration: number, gain = 0.1, filterFreq = 1000) {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + duration);
  }

  click() {
    this.tone(1200, 0.05, 'square', 0.06);
  }

  ding() {
    this.tone(1760, 0.25, 'sine', 0.1);
    this.tone(2640, 0.4, 'sine', 0.05, 0.02);
  }

  pop() {
    this.tone(600, 0.08, 'triangle', 0.12);
    this.tone(900, 0.12, 'sine', 0.08, 0.03);
  }

  whoosh() {
    this.noise(0.5, 0.08, 800);
  }

  radioBeep() {
    this.tone(880, 0.12, 'square', 0.1);
  }

  radioStatic(duration = 0.6) {
    this.noise(duration, 0.06, 2400);
  }

  lightsOut() {
    this.tone(440, 0.15, 'square', 0.12);
    this.noise(0.3, 0.12, 600);
  }

  engineStart() {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 1.2);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.1);
  }

  hit() {
    this.tone(150, 0.15, 'square', 0.18);
    this.noise(0.1, 0.12, 500);
  }

  achievement() {
    this.tone(659, 0.15, 'sine', 0.1);
    this.tone(784, 0.15, 'sine', 0.1, 0.12);
    this.tone(1047, 0.3, 'sine', 0.12, 0.24);
  }

  drs() {
    this.tone(2000, 0.1, 'sawtooth', 0.08);
    this.noise(0.4, 0.06, 3000);
  }

  firework() {
    this.noise(0.3, 0.1, 2000);
    this.tone(200, 0.4, 'sine', 0.08, 0.1);
  }

  applause() {
    this.noise(2, 0.06, 2500);
  }

  chequered() {
    this.tone(523, 0.2, 'square', 0.1);
    this.tone(659, 0.2, 'square', 0.1, 0.15);
    this.tone(784, 0.4, 'square', 0.12, 0.3);
  }

  playUrl(url: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.muted) {
        resolve();
        return;
      }
      let h = this.urlHowls.get(url);
      if (!h) {
        h = new Howl({ src: [url], html5: true, format: ['webm', 'mp3'] });
        this.urlHowls.set(url, h);
      }
      h.once('end', () => resolve());
      h.once('loaderror', () => resolve());
      h.play();
    });
  }

  stopUrl(url: string) {
    const h = this.urlHowls.get(url);
    if (h) h.stop();
  }
}

export const audio = new AudioManager();
