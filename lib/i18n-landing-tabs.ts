import type { Locale } from "@/lib/i18n";

const copy = {
  en: { navigation: "Writing sections", latest: "Latest", systems: "Engineering", work: "Projects", ideas: "Ideas", digests: "Quick notes" },
  "zh-tw": { navigation: "文章分類", latest: "最新", systems: "工程", work: "專案", ideas: "想法", digests: "隨手筆記" },
  "zh-cn": { navigation: "文章分类", latest: "最新", systems: "工程", work: "项目", ideas: "想法", digests: "随手笔记" },
  ja: { navigation: "記事のカテゴリー", latest: "最新", systems: "エンジニアリング", work: "プロジェクト", ideas: "アイデア", digests: "メモ" },
} satisfies Record<Locale, Record<string, string>>;

export const getLandingTabsCopy = (locale: Locale) => copy[locale];
