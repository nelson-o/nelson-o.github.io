"use client";

import React, { useEffect, useRef } from "react";

import { getScrambledTitleDelayMs } from "@/lib/scrambled-title-timing";
import { createScrambledTitleQueue } from "@/lib/scrambled-title-queue";
import { TextScrambler } from "@/lib/text-scrambler";

type ScrambledSiteTitleProps = {
  title: string;
  candidates?: string[];
};

const TITLE_CANDIDATES = [
  "Nelson Lin",
  "/ˈnɛl.sən lɪn/",
  "All I know is that I know nothing",
];

const SCRAMBLE_DURATION_MS = 1200;

function shuffled<T>(items: T[]) {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

export function ScrambledSiteTitle({
  title,
  candidates = TITLE_CANDIDATES,
}: ScrambledSiteTitleProps) {
  const titleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = titleRef.current;

    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let timeoutId: number | null = null;
    let scrambler: TextScrambler | null = null;
    const queue = createScrambledTitleQueue({ title, candidates, shuffle: shuffled });

    const runScramble = () => {
      scrambler?.stop();
      scrambler = new TextScrambler({
        el,
        source: el.textContent ?? title,
        target: queue.next(),
        durationMs: SCRAMBLE_DURATION_MS,
        onComplete: scheduleNext,
      });
      scrambler.start();
    };

    const scheduleNext = () => {
      timeoutId = window.setTimeout(runScramble, getScrambledTitleDelayMs());
    };

    runScramble();

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      scrambler?.stop();
    };
  }, [candidates, title]);

  return <span ref={titleRef}>{title}</span>;
}
