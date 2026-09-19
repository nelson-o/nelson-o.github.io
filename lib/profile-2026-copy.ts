import type { Locale } from "@/lib/i18n";

type Profile2026Copy = {
  preview: string; previewNote: string; stable: string; site: string; skip: string;
  nav: [string, string, string, string, string]; eyebrow: string;
  headline: [string, string]; introduction: string; contact: string;
  experience: string; history: string; present: string; projects: string;
  projectDetails: string; beyond: string; approach: string; manifesto: [string, string, string];
  principles: [string, string, string]; footer: string; portrait: string;
  categories: [string, string, string];
};

const en: Profile2026Copy = {
  preview: "2026 · Preview", previewNote: "A new perspective, taking shape.", stable: "View the current profile",
  site: "Explore the site", skip: "Skip to content",
  nav: ["About", "Experience", "Projects", "Talks", "Contact"],
  eyebrow: "Engineering a brighter web", headline: ["Build better", "web experiences."],
  introduction: "I’m Nelson,", contact: "Get in touch", experience: "Experience",
  history: "View full history", present: "Present", projects: "Selected projects",
  projectDetails: "Explore the work", beyond: "Beyond work", approach: "The approach",
  manifesto: ["Build systems.", "Empower people.", "Ship a better web."],
  principles: ["Build", "Learn", "Share"], footer: "Systems for a better tomorrow",
  portrait: "Nelson’s profile photo", categories: ["Platform", "Developer tools", "Observability"],
};

const zhTw: Profile2026Copy = {
  preview: "2026 · 預覽", previewNote: "新的視角，逐步成形。", stable: "查看目前的個人簡介",
  site: "探索網站", skip: "跳至主要內容",
  nav: ["關於", "經歷", "專案", "分享", "聯絡"],
  eyebrow: "用工程打造更好的網路", headline: ["打造更好的", "網頁體驗。"],
  introduction: "我是 Nelson，", contact: "與我聯絡", experience: "工作經歷",
  history: "查看完整經歷", present: "至今", projects: "精選專案",
  projectDetails: "了解專案", beyond: "工作之外", approach: "我的方向",
  manifesto: ["打造系統。", "支持團隊。", "交付更好的網路體驗。"],
  principles: ["實作", "學習", "分享"], footer: "以系統思維，打造更好的明天",
  portrait: "Nelson 的個人照片", categories: ["平台", "開發工具", "可觀測性"],
};

const zhCn: Profile2026Copy = {
  preview: "2026 · 预览", previewNote: "新的视角，逐步成形。", stable: "查看当前个人简介",
  site: "探索网站", skip: "跳至主要内容",
  nav: ["关于", "经历", "项目", "分享", "联系"],
  eyebrow: "用工程打造更好的网络", headline: ["打造更好的", "网页体验。"],
  introduction: "我是 Nelson，", contact: "与我联系", experience: "工作经历",
  history: "查看完整经历", present: "至今", projects: "精选项目",
  projectDetails: "了解项目", beyond: "工作之外", approach: "我的方向",
  manifesto: ["打造系统。", "支持团队。", "交付更好的网络体验。"],
  principles: ["实践", "学习", "分享"], footer: "以系统思维，打造更好的明天",
  portrait: "Nelson 的个人照片", categories: ["平台", "开发工具", "可观测性"],
};

const ja: Profile2026Copy = {
  preview: "2026 · プレビュー", previewNote: "新しい視点を、少しずつ形に。", stable: "現在のプロフィールを見る",
  site: "サイトを見る", skip: "本文へ移動",
  nav: ["自己紹介", "経歴", "プロジェクト", "登壇", "連絡"],
  eyebrow: "エンジニアリングで、より良いウェブへ", headline: ["より良い", "ウェブ体験を。"],
  introduction: "Nelson です。", contact: "連絡する", experience: "職務経歴",
  history: "すべての経歴を見る", present: "現在", projects: "主なプロジェクト",
  projectDetails: "取り組みを見る", beyond: "仕事の、その先へ", approach: "目指すもの",
  manifesto: ["システムをつくる。", "チームを支える。", "より良いウェブを届ける。"],
  principles: ["つくる", "学ぶ", "共有する"], footer: "より良い明日のためのシステム",
  portrait: "Nelson のプロフィール写真", categories: ["プラットフォーム", "開発ツール", "可観測性"],
};

export const profile2026Copy: Record<Locale, Profile2026Copy> = { en, "zh-tw": zhTw, "zh-cn": zhCn, ja };
export type { Profile2026Copy };
