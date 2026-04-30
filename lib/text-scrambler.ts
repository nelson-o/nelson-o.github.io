type ScramblerOptions = {
  el: HTMLElement;
  source?: string;
  target: string;
  durationMs?: number;
  fps?: number;
  charset?: string;
  maxLength?: number;
  staggerMs?: number;
  decayPower?: number;
  onComplete?: () => void;
};

type CharState = {
  final: string;
  current: string;
  locked: boolean;
  startTime: number;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export class TextScrambler {
  private el: HTMLElement;
  private target: string;
  private states: CharState[] = [];
  private rafId: number | null = null;
  private startTime = 0;
  private completed = false;

  private duration: number;
  private fps: number;
  private charset: string;
  private stagger: number;
  private decayPower: number;
  private onComplete?: () => void;

  private frameInterval: number;
  private lastFrameTime = 0;

  constructor(opts: ScramblerOptions) {
    const {
      el,
      source = "",
      target,
      durationMs = 1200,
      fps = 30,
      charset = DEFAULT_CHARSET,
      maxLength = 128,
      staggerMs = 40,
      decayPower = 2.2,
      onComplete,
    } = opts;

    if (!el) {
      throw new Error("Missing target element");
    }

    if (!target) {
      throw new Error("Missing target string");
    }

    const safeTarget = [...target].slice(0, maxLength).join("");
    const safeSource = [...source].slice(0, maxLength).join("");

    this.el = el;
    this.target = safeTarget;
    this.duration = durationMs;
    this.fps = fps;
    this.charset = charset;
    this.stagger = staggerMs;
    this.decayPower = decayPower;
    this.onComplete = onComplete;

    this.frameInterval = 1000 / fps;

    this.initStates(safeTarget, safeSource);
  }

  start() {
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.completed = false;
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  tick(now: number) {
    if (now - this.lastFrameTime < this.frameInterval) {
      return false;
    }

    this.lastFrameTime = now;

    let output = "";
    let allLocked = true;

    for (const state of this.states) {
      if (state.locked) {
        output += state.final;
        continue;
      }

      const charElapsed = now - state.startTime;

      if (charElapsed <= 0) {
        output += state.current;
        allLocked = false;
        continue;
      }

      const charT = Math.min(charElapsed / this.duration, 1);
      const lockProb = Math.pow(charT, this.decayPower);

      if (charT >= 1 || Math.random() < lockProb) {
        state.locked = true;
        state.current = state.final;
        output += state.final;
      } else {
        state.current = this.randomChar();
        output += state.current;
        allLocked = false;
      }
    }

    this.el.textContent = allLocked ? this.target : output;

    if (allLocked && !this.completed) {
      this.completed = true;
      this.onComplete?.();
    }

    return allLocked;
  }

  private initStates(target: string, source: string) {
    const now = performance.now();
    const targetChars = [...target];
    const sourceChars = [...source];
    const workingLength = Math.max(targetChars.length, sourceChars.length);
    const indices = Array.from({ length: workingLength }, (_, i) => i);
    this.shuffle(indices);

    this.states = indices.map((_, i) => {
      const orderIndex = indices.indexOf(i);

      return {
        final: targetChars[i] ?? " ",
        current: sourceChars[i] ?? " ",
        locked: false,
        startTime: now + orderIndex * this.stagger,
      };
    });
  }

  private loop = (now: number) => {
    if (!this.tick(now)) {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      this.rafId = null;
    }
  };

  private randomChar(): string {
    const i = Math.floor(Math.random() * this.charset.length);
    return this.charset[i] ?? "";
  }

  private shuffle(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}
