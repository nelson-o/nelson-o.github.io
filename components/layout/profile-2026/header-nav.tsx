"use client";

import React, { useEffect, useState } from "react";

import { currentSection } from "@/lib/profile-2026-current-section";
import styles from "./header.module.css";

// The header's in-page nav. It marks the section being read with aria-current
// (#87); without JavaScript it is still plain anchor links.
export function Profile2026Nav({ label, links }: { label: string; links: { id: string; text: string }[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const ids = links.map(({ id }) => id).join(" ");

  useEffect(() => {
    const sections = ids.split(" ").map((id) => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      setCurrent(currentSection(
        sections.map((node) => { const r = node.getBoundingClientRect(); return { id: node.id, top: r.top, bottom: r.bottom, left: r.left, right: r.right }; }),
        { width: root.clientWidth, height: innerHeight },
        innerHeight + scrollY >= root.scrollHeight - 2,
      ));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, [ids]);

  return <nav className={styles.nav} aria-label={label}>
    {links.map(({ id, text }) => <a key={id} href={`#${id}`} aria-current={current === id ? "location" : undefined}>{text}</a>)}
  </nav>;
}
