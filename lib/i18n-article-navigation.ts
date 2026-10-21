import type { Locale } from "@/lib/i18n";

const copy = {
  en: { series: "Continue this series", section: "Continue in this section", previous: "Previous", next: "Next", related: "Related posts" },
  "zh-tw": { series: "繼續閱讀此系列", section: "繼續閱讀此分類", previous: "上一篇", next: "下一篇", related: "相關文章" },
  "zh-cn": { series: "继续阅读此系列", section: "继续阅读此分类", previous: "上一篇", next: "下一篇", related: "相关文章" },
  ja: { series: "このシリーズを読み進める", section: "このカテゴリーを読み進める", previous: "前の記事", next: "次の記事", related: "関連記事" },
} satisfies Record<Locale, Record<string, string>>;

export const getArticleNavigationCopy = (locale: Locale) => copy[locale];
