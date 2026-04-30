import { describe, expect, it } from "vitest";

import { createScrambledTitleQueue } from "@/lib/scrambled-title-queue";

describe("createScrambledTitleQueue", () => {
  it("uses a different first target when one is available", () => {
    const queue = createScrambledTitleQueue({
      title: "Nelson Lin",
      candidates: ["Nelson Lin", "/nelson/", "All I know"],
      shuffle: (items) => items,
    });

    expect(queue.next()).toBe("/nelson/");
  });

  it("cycles through a fresh candidate order after exhausting the queue", () => {
    const queue = createScrambledTitleQueue({
      title: "Nelson Lin",
      candidates: ["Nelson Lin", "/nelson/"],
      shuffle: (items) => items,
    });

    expect(queue.next()).toBe("/nelson/");
    expect(queue.next()).toBe("Nelson Lin");
    expect(queue.next()).toBe("/nelson/");
  });
});
