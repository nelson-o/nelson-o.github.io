import type { Locale } from "@/lib/i18n";

const copy = {
  en: { start: "Start this series", sequence: "Reading order", introduction: "Follow the published posts in order, from the first entry to the latest. Each step links to the full article." },
  "zh-tw": { start: "開始閱讀此系列", sequence: "閱讀順序", introduction: "依序閱讀已發布的文章，從第一篇到最新一篇。每一步皆可連至完整文章。" },
  "zh-cn": { start: "开始阅读此系列", sequence: "阅读顺序", introduction: "依次阅读已发布的文章，从第一篇到最新一篇。每一步均可跳转至完整文章。" },
  ja: { start: "このシリーズを読み始める", sequence: "読む順番", introduction: "公開済みの記事を最初から最新の記事まで順に読めます。各項目から記事の全文に移動できます。" },
} satisfies Record<Locale, { start: string; sequence: string; introduction: string }>;

export const getSeriesPathCopy = (locale: Locale) => copy[locale];
