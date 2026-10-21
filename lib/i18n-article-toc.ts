import type { Locale } from "@/lib/i18n";

const copy = {
  en: { title: "On this page", linkToHeading: "Link to section" },
  "zh-tw": { title: "本頁目錄", linkToHeading: "連結至章節" },
  "zh-cn": { title: "本页目录", linkToHeading: "链接至章节" },
  ja: { title: "このページの目次", linkToHeading: "セクションへのリンク" },
} satisfies Record<Locale, { title: string; linkToHeading: string }>;

export const getArticleTocCopy = (locale: Locale) => copy[locale];
