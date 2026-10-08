"use client";

import React, { useEffect, useRef, useState } from "react";

import { currentSection } from "@/lib/profile-2026-current-section";
import styles from "./header.module.css";

// The header's in-page nav. It marks the section being read with aria-current
// (#87) and makes the header sticky, flagging when it is pinned; without
// JavaScript it is plain anchor links in a static header.
export function Profile2026Nav({ label, links }: { label: string; links: { id: string; text: string }[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  // A section chosen from the nav stays current until the reader scrolls themselves.
  // Otherwise a jump to a section near the page end would light up the last link.
  const chosen = useRef<string | null>(null);
  const ids = links.map(({ id }) => id).join(" ");

  useEffect(() => {
    const sections = ids.split(" ").map((id) => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    const header = navRef.current?.closest("header");
    header?.setAttribute("data-sticky", "");
    let frame = 0;
    const update = () => {
      frame = 0;
      header?.toggleAttribute("data-pinned", scrollY > 4);
      const root = document.documentElement;
      setCurrent(chosen.current ?? currentSection(
        sections.map((node) => { const r = node.getBoundingClientRect(); return { id: node.id, top: r.top, bottom: r.bottom, left: r.left, right: r.right }; }),
        { width: root.clientWidth, height: innerHeight },
        innerHeight + scrollY >= root.scrollHeight - 2,
      ));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const release = () => { if (chosen.current) { chosen.current = null; schedule(); } };
    const userScroll = ["wheel", "touchmove", "keydown"] as const;
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    for (const type of userScroll) addEventListener(type, release, { passive: true });
    return () => {
      cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule);
      for (const type of userScroll) removeEventListener(type, release);
      header?.removeAttribute("data-sticky"); header?.removeAttribute("data-pinned");
    };
  }, [ids]);

  // Only these nav jumps glide; the skip link and every other scroll stay instant.
  function glide(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    chosen.current = id;
    setCurrent(id);
    const target = document.getElementById(id);
    // Native keyboard activation also moves the browser's sequential focus start.
    if (!target || event.detail === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  }

  return <nav ref={navRef} className={styles.nav} aria-label={label}>
    {links.map(({ id, text }) => <a key={id} href={`#${id}`} aria-current={current === id ? "location" : undefined} onClick={(event) => glide(event, id)}>{text}</a>)}
  </nav>;
}
