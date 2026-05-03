"use client";

import React, { useEffect, useState } from "react";
import GiscusWidget from "@giscus/react";

type GiscusTheme = "light" | "dark";

function getTheme(): GiscusTheme {
  return document.documentElement.classList.contains("theme-dark") ? "dark" : "light";
}

export function GiscusComments() {
  const [theme, setTheme] = useState<GiscusTheme>("light");

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
