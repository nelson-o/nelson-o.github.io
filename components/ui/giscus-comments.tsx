"use client";

import React, { useEffect, useState } from "react";
import GiscusWidget from "@giscus/react";
import type { Locale } from "@/lib/i18n";

type GiscusTheme = "noborder_light" | "cobalt";
type GiscusLang = "en" | "zh-TW" | "zh-CN" | "ja";

const giscusLanguages: Record<Locale, GiscusLang> = {
  en: "en",
  "zh-tw": "zh-TW",
  "zh-cn": "zh-CN",
  ja: "ja",
};

export function getGiscusTheme(isDark: boolean): GiscusTheme {
  return isDark ? "cobalt" : "noborder_light";
}

export function getGiscusLang(locale: Locale): GiscusLang {
  return giscusLanguages[locale];
}

function getTheme(): GiscusTheme {
  return getGiscusTheme(document.documentElement.classList.contains("theme-dark"));
}

type GiscusCommentsProps = {
  locale: Locale;
};

export function GiscusComments({ locale }: GiscusCommentsProps) {
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
      lang={getGiscusLang(locale)}
      loading="lazy"
    />
  );
}
