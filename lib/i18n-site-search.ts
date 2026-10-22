import type { Locale } from "@/lib/i18n";
const copy = {
  en: { title: "Search posts", prompt: "Search posts…", close: "Close search", loading: "Loading search…", error: "Search could not load.", retry: "Try again", hint: "Search titles, summaries and topics.", empty: "No matching posts.", results: (n: number) => `${n} matching posts`, more: "Showing the first 20 matches." },
  "zh-tw": { title: "搜尋文章", prompt: "搜尋文章…", close: "關閉搜尋", loading: "載入搜尋中…", error: "無法載入搜尋。", retry: "重試", hint: "搜尋標題、摘要與主題。", empty: "找不到符合的文章。", results: (n: number) => `${n} 篇符合的文章`, more: "顯示前 20 篇符合的文章。" },
  "zh-cn": { title: "搜索文章", prompt: "搜索文章…", close: "关闭搜索", loading: "正在加载搜索…", error: "无法加载搜索。", retry: "重试", hint: "搜索标题、摘要与主题。", empty: "没有匹配的文章。", results: (n: number) => `${n} 篇匹配的文章`, more: "显示前 20 篇匹配的文章。" },
  ja: { title: "記事を検索", prompt: "記事を検索…", close: "検索を閉じる", loading: "検索を読み込み中…", error: "検索を読み込めませんでした。", retry: "再試行", hint: "タイトル、概要、トピックを検索。", empty: "一致する記事はありません。", results: (n: number) => `${n} 件の記事が一致`, more: "最初の 20 件を表示しています。" },
};
export const getSiteSearchCopy = (locale: Locale) => copy[locale];
