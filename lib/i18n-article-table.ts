import type { Locale } from "@/lib/i18n";

const labels = {
  en: "Table — scroll horizontally if needed",
  "zh-tw": "表格 — 可視需要左右捲動",
  "zh-cn": "表格 — 可按需左右滚动",
  ja: "表 — 必要に応じて横にスクロールできます",
} satisfies Record<Locale, string>;

export const getArticleTableLabel = (locale: Locale) => labels[locale];
