import { describe, expect, it } from "vitest";

import { createScrambledTitleQueue } from "@/lib/scrambled-title-queue";

describe("createScrambledTitleQueue", () => {
  it("uses a different first target when one is available", () => {
    const queue = createScrambledTitleQueue({
      title: "neℓson",
      candidates: ["neℓson", "/ˈnɛl.sən/", "All I know"],
      shuffle: (items) => items,
    });

    expect(queue.next()).toBe("/ˈnɛl.sən/");
  });

  it("cycles through a fresh candidate order after exhausting the queue", () => {
    const queue = createScrambledTitleQueue({
      title: "neℓson",
      candidates: ["neℓson", "/ˈnɛl.sən/"],
      shuffle: (items) => items,
    });

    expect(queue.next()).toBe("/ˈnɛl.sən/");
    expect(queue.next()).toBe("neℓson");
    expect(queue.next()).toBe("/ˈnɛl.sən/");
  });
});
