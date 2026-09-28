"use client";

import { useEffect } from "react";

// Decorative section backgrounds wait until their section nears the viewport, so on a cold
// load they don't compete with the hero portrait. Sections opt in with
// data-deferred-art="pending"; their CSS applies the artwork once this marks them "ready".
export function Profile2026DeferredArt() {
  useEffect(() => {
    const pending = [...document.querySelectorAll<HTMLElement>('[data-deferred-art="pending"]')];
    const ready = (element: Element) => element.setAttribute("data-deferred-art", "ready");
    if (!("IntersectionObserver" in window)) {
      pending.forEach(ready);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        ready(entry.target);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "400px 0px" });
    pending.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}
