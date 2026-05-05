"use client";

import React, { useEffect, useState } from "react";
import GiscusWidget from "@giscus/react";

type GiscusTheme = "noborder_light" | "cobalt";

export function getGiscusTheme(isDark: boolean): GiscusTheme {
  return isDark ? "cobalt" : "noborder_light";
}

function getTheme(): GiscusTheme {
  return getGiscusTheme(document.documentElement.classList.contains("theme-dark"));
}

export function GiscusComments() {
  const [theme, setTheme] = useState<GiscusTheme>(getGiscusTheme(false));

  useEffect(() => {
    setTheme(getTheme());

    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <GiscusWidget
      repo="nelson-o/nelson-o.github.io"
      repoId="R_kgDOSO79mw"
      category="Announcements"
      categoryId="DIC_kwDOSO79m84C8PhL"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="en"
      loading="lazy"
    />
  );
}
