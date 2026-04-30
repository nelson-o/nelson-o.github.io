import { afterEach, describe, expect, it, vi } from "vitest";

import { TextScrambler } from "@/lib/text-scrambler";

describe("TextScrambler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders the final target and calls the completion handler", () => {
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    const el = { textContent: "" } as HTMLElement;
    const onComplete = vi.fn();

    const scrambler = new TextScrambler({
      el,
      target: "Nelson Lin",
      durationMs: 1,
      fps: 60,
      staggerMs: 0,
      decayPower: 0,
      onComplete,
    });

    scrambler.start();
    scrambler.tick(performance.now() + 20);

    expect(el.textContent).toBe("Nelson Lin");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("uses spaces as the source for positions added by a longer target", () => {
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    const el = { textContent: "" } as HTMLElement;

    const scrambler = new TextScrambler({
      el,
      source: "Hi",
      target: "Hi there",
      durationMs: 100,
      fps: 60,
      staggerMs: 0,
      decayPower: 2.2,
    });

    scrambler.start();
    scrambler.tick(performance.now() + 20);

    expect(el.textContent).toHaveLength("Hi there".length);
    expect(el.textContent?.slice(2)).not.toBe("there");

    scrambler.tick(performance.now() + 200);

    expect(el.textContent).toBe("Hi there");
  });

  it("scrambles surplus source characters into spaces before settling on a shorter target", () => {
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    const el = { textContent: "" } as HTMLElement;

    const scrambler = new TextScrambler({
      el,
      source: "All I know",
      target: "All",
      durationMs: 100,
      fps: 60,
      staggerMs: 0,
      decayPower: 2.2,
    });

    scrambler.start();
    scrambler.tick(performance.now() + 20);

    expect(el.textContent).toHaveLength("All I know".length);
    expect(el.textContent).not.toBe("All");

    scrambler.tick(performance.now() + 200);

    expect(el.textContent).toBe("All");
    expect(el.textContent).not.toBe("All       ");
  });

  it("cancels a scheduled animation frame when stopped", () => {
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 42));
    const el = { textContent: "" } as HTMLElement;

    const scrambler = new TextScrambler({
      el,
      target: "Nelson Lin",
      durationMs: 100,
      fps: 60,
    });

    scrambler.start();
    scrambler.stop();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});
