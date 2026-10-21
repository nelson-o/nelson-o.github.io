import type { Locale } from "@/lib/i18n";

const copy = {
  en: { reading: (n: number) => `About ${n} min read`, tags: "Article topics", part: (n: number, total: number) => `Part ${n} of ${total}` },
  "zh-tw": { reading: (n: number) => `閱讀約需 ${n} 分鐘`, tags: "文章主題", part: (n: number, total: number) => `第 ${n} 篇，共 ${total} 篇` },
  "zh-cn": { reading: (n: number) => `阅读约需 ${n} 分钟`, tags: "文章主题", part: (n: number, total: number) => `第 ${n} 篇，共 ${total} 篇` },
  ja: { reading: (n: number) => `読了まで約${n}分`, tags: "記事のトピック", part: (n: number, total: number) => `全${total}回の第${n}回` },
} satisfies Record<Locale, { reading: (n: number) => string; tags: string; part: (n: number, total: number) => string }>;

export const getArticleHeaderCopy = (locale: Locale) => copy[locale];
