import type { Locale } from "@/lib/i18n";
const copy = {
  en: { title: "Search posts", prompt: "Search posts…", close: "Close search", loading: "Loading search…", error: "Search could not load.", retry: "Try again", hint: "Search titles, summaries, topics and article text.", empty: "No matching posts.", results: (shown: number, total: number) => shown < total ? `Showing ${shown} of ${total} matching posts` : `Showing all ${total} matching posts`, more: "Show more results" },
  "zh-tw": { title: "搜尋文章", prompt: "搜尋文章…", close: "關閉搜尋", loading: "載入搜尋中…", error: "無法載入搜尋。", retry: "重試", hint: "搜尋標題、摘要、主題與文章內容。", empty: "找不到符合的文章。", results: (shown: number, total: number) => shown < total ? `已顯示 ${shown} 篇，共 ${total} 篇符合的文章` : `已顯示全部 ${total} 篇符合的文章`, more: "顯示更多結果" },
  "zh-cn": { title: "搜索文章", prompt: "搜索文章…", close: "关闭搜索", loading: "正在加载搜索…", error: "无法加载搜索。", retry: "重试", hint: "搜索标题、摘要、主题与文章内容。", empty: "没有匹配的文章。", results: (shown: number, total: number) => shown < total ? `已显示 ${shown} 篇，共 ${total} 篇匹配的文章` : `已显示全部 ${total} 篇匹配的文章`, more: "显示更多结果" },
  ja: { title: "記事を検索", prompt: "記事を検索…", close: "検索を閉じる", loading: "検索を読み込み中…", error: "検索を読み込めませんでした。", retry: "再試行", hint: "タイトル、概要、トピック、本文を検索。", empty: "一致する記事はありません。", results: (shown: number, total: number) => shown < total ? `一致する ${total} 件中 ${shown} 件を表示` : `一致する ${total} 件をすべて表示`, more: "結果をさらに表示" },
};
export const getSiteSearchCopy = (locale: Locale) => copy[locale];
