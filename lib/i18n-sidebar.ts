import type { Locale } from "@/lib/i18n";

const copy = {
  en: {
    label: "About and writing collections", about: "About", intro: "I build web platforms and delivery workflows.",
    learnMore: "Learn more", topics: "Popular topics", moreTopics: "More topics", series: "Series", allSeries: "View all series", posts: "posts",
  },
  "zh-tw": {
    label: "關於與文章集", about: "關於", intro: "我打造網頁平台，改善團隊的交付流程。",
    learnMore: "了解更多", topics: "熱門主題", moreTopics: "更多主題", series: "系列文章", allSeries: "查看所有系列", posts: "篇文章",
  },
  "zh-cn": {
    label: "关于与文章集", about: "关于", intro: "我构建网页平台，改善团队的交付流程。",
    learnMore: "了解更多", topics: "热门主题", moreTopics: "更多主题", series: "系列文章", allSeries: "查看所有系列", posts: "篇文章",
  },
  ja: {
    label: "プロフィールと記事集", about: "プロフィール", intro: "Web基盤を構築し、開発・提供の流れを改善しています。",
    learnMore: "詳しく見る", topics: "人気のトピック", moreTopics: "すべてのトピック", series: "シリーズ", allSeries: "すべてのシリーズ", posts: "記事",
  },
} satisfies Record<Locale, Record<string, string>>;

export const getSidebarCopy = (locale: Locale) => copy[locale];
