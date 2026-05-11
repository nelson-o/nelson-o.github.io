import { describe, expect, it } from "vitest";

import { createScrambledTitleQueue } from "@/lib/scrambled-title-queue";

describe("createScrambledTitleQueue", () => {
  it("uses a different first target when one is available", () => {
    const queue = createScrambledTitleQueue({
      title: "nelson",
      candidates: ["nelson", "/ˈnɛl.sən/", "All I know"],
      shuffle: (items) => items,
    });

    expect(queue.next()).toBe("/ˈnɛl.sən/");
  });

  it("cycles through a fresh candidate order after exhausting the queue", () => {
    const queue = createScrambledTitleQueue({
      title: "nelson",
      candidates: ["nelson", "/ˈnɛl.sən/"],
      shuffle: (items) => items,
    });

    expect(queue.next()).toBe("/ˈnɛl.sən/");
    expect(queue.next()).toBe("nelson");
    expect(queue.next()).toBe("/ˈnɛl.sən/");
  });
});
