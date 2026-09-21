"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./hero-tagline.module.css";

export function ProfileHeroTagline({ alt }: { alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let attempted = false;
    let active = true;
    const fallback = () => { if (active) setPlaying(false); };
    const update = () => {
      if (motion.matches) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        fallback();
      } else if (!attempted && video.canPlayType("video/webm")) {
        attempted = true;
        video.muted = true;
        video.src = "/profile/2026/hero/tagline.en.webm";
        video.playbackRate = 3;
        void video.play().catch(fallback);
      }
    };
    update();
    motion.addEventListener("change", update);
    return () => {
      active = false;
      motion.removeEventListener("change", update);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <div className={styles.artwork} data-playing={playing}>
      <Image className={styles.fallback} src="/profile/2026/hero/tagline.en.webp" alt={alt}
        width={580} height={435} sizes="(max-width: 760px) 28vw, 150px" unoptimized />
      <video ref={videoRef} className={styles.video} muted playsInline preload="none"
        aria-hidden="true" onPlaying={() => setPlaying(true)} onError={() => setPlaying(false)} />
    </div>
  );
}
