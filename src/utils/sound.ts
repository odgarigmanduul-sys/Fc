// Web Audio API Synthesizer for retro gamification sounds
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.warn("Web Audio API is not supported in this environment.", e);
      }
    }
    // Resume context if suspended (browser security measures)
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Quick energetic dual-toned chime
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Sad buzzy double-tone sliding down
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220.00, now); // A3
    osc.frequency.linearRampToValueAtTime(110.00, now + 0.35); // A2

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.38);

    // Apply simple lowpass filter to make the buzz less piercing
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Duolingo victory arpeggio: C4 -> E4 -> G4 -> C5 -> E5 -> G5
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    const duration = 0.08;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * duration);

      gainNode.gain.setValueAtTime(0.15, now + idx * duration);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * duration + 0.25);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now + idx * duration);
      osc.stop(now + idx * duration + 0.3);
    });
  }

  playCombo(level: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Frequency scales up with each consecutive combo level
    const baseFreq = 440 + level * 65;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    gainNode.gain.setValueAtTime(0.16, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playSlotSpin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Play a fast rhythmic mechanical spin sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(293.66, now); // D4
    osc.frequency.setValueAtTime(349.23, now + 0.08); // F4
    osc.frequency.setValueAtTime(440.00, now + 0.16); // A4

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playSlotWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Epic arcade siren cascading sounds up
    const duration = 0.5;
    const steps = 14;
    
    for (let i = 0; i < steps; i++) {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const stepTime = now + (i * 0.04);
      const freq = 523.25 * Math.pow(1.059463, i); // ascending chromatic steps

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, stepTime);
      
      gainNode.gain.setValueAtTime(0.12, stepTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.12);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(stepTime);
      osc.stop(stepTime + 0.15);
    }
  }

  playCardFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }
}

export const sounds = new SoundEngine();
