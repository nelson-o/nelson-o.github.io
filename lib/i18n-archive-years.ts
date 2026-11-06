import type { Locale } from "@/lib/i18n";

const copy = {
  en: "Jump to year",
  "zh-tw": "跳至年份",
  "zh-cn": "跳至年份",
  ja: "年を選んで移動",
} satisfies Record<Locale, string>;

export const getArchiveYearsCopy = (locale: Locale) => copy[locale];
