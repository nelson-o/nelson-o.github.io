import type { Locale } from "@/lib/i18n";

const copy = {
  en: { tagline: "Build a kinder internet.", navigation: "Footer", about: "About", projects: "Projects", posts: "Posts", ideas: "Ideas", contact: "Contact", top: "Back to top" },
  "zh-tw": { tagline: "打造更友善的網路。", navigation: "頁尾導覽", about: "關於", projects: "專案", posts: "文章", ideas: "想法", contact: "聯絡", top: "回到頂端" },
  "zh-cn": { tagline: "打造更友善的网络。", navigation: "页脚导航", about: "关于", projects: "项目", posts: "文章", ideas: "想法", contact: "联系", top: "回到顶部" },
  ja: { tagline: "もっとやさしいインターネットを。", navigation: "フッター", about: "プロフィール", projects: "プロジェクト", posts: "記事", ideas: "アイデア", contact: "連絡先", top: "ページの先頭へ" },
} satisfies Record<Locale, Record<string, string>>;

export const getSiteFooterCopy = (locale: Locale) => copy[locale];
