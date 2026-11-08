import { normalizeLocaleParam, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    title: "Page not found",
    description: "The page you asked for does not exist or is not published yet.",
    home: "Go back home", systems: "Browse systems", languages: "Choose a reading language",
  },
  "zh-tw": {
    title: "找不到頁面",
    description: "你要找的頁面不存在，或尚未公開。",
    home: "回到首頁", systems: "瀏覽系統文章", languages: "選擇閱讀語言",
  },
  "zh-cn": {
    title: "找不到页面",
    description: "你要找的页面不存在，或尚未公开。",
    home: "返回首页", systems: "浏览系统文章", languages: "选择阅读语言",
  },
  ja: {
    title: "ページが見つかりません",
    description: "お探しのページは存在しないか、まだ公開されていません。",
    home: "ホームに戻る", systems: "システムの記事を見る", languages: "読む言語を選ぶ",
  },
} satisfies Record<Locale, { title: string; description: string; home: string; systems: string; languages: string }>;

export const getNotFoundCopy = (locale: Locale) => copy[locale];

// The shared static 404 cannot know its request path until JavaScript runs.
// Reuse the site's normalization and allowlist; unknown prefixes fall back to en.
export const getNotFoundLocale = (pathname: string) => normalizeLocaleParam(pathname.split("/")[1]);
