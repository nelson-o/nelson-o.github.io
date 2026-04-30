import { describe, expect, it } from "vitest";

import { getScrambledTitleDelayMs } from "@/lib/scrambled-title-timing";

describe("getScrambledTitleDelayMs", () => {
  it("returns a delay between 10 and 20 seconds", () => {
    expect(getScrambledTitleDelayMs(0)).toBe(10000);
    expect(getScrambledTitleDelayMs(1)).toBe(20000);
    expect(getScrambledTitleDelayMs(0.5)).toBe(15000);
  });
});
