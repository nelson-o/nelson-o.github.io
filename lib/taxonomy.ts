import type { Locale } from "@/lib/i18n";

// Approved vocabulary: agents/specs/2026-10-site-redesign.md, D6.
type Labels = Record<Locale, string>;
export const tags = {
  agents: { en: "AI agents", "zh-tw": "AI Agent", "zh-cn": "AI Agent", ja: "AIエージェント" },
  "code-review": { en: "Code review", "zh-tw": "程式碼審查", "zh-cn": "代码审查", ja: "コードレビュー" },
  platform: { en: "Platform engineering", "zh-tw": "平台工程", "zh-cn": "平台工程", ja: "プラットフォームエンジニアリング" },
  delivery: { en: "Delivery and CI", "zh-tw": "交付與 CI", "zh-cn": "交付与 CI", ja: "デリバリーとCI" },
  observability: { en: "Observability", "zh-tw": "可觀測性", "zh-cn": "可观测性", ja: "オブザーバビリティ" },
  "web-infra": { en: "Web infrastructure", "zh-tw": "網頁基礎設施", "zh-cn": "网页基础设施", ja: "Webインフラ" },
  devices: { en: "Devices and real-time data", "zh-tw": "裝置與即時資料", "zh-cn": "设备与实时数据", ja: "デバイスとリアルタイムデータ" },
  teams: { en: "Teams and leadership", "zh-tw": "團隊與領導", "zh-cn": "团队与领导", ja: "チームとリーダーシップ" },
} as const satisfies Record<string, Labels>;

export const series = {
  "agentic-delivery": { en: "Agentic delivery", "zh-tw": "Agent 交付實務", "zh-cn": "Agent 交付实务", ja: "エージェント開発の実践" },
  "device-frontend": { en: "Frontend for devices", "zh-tw": "裝置前端", "zh-cn": "设备前端", ja: "デバイスのフロントエンド" },
} as const satisfies Record<string, Labels>;

export type TagId = keyof typeof tags;
export type SeriesId = keyof typeof series;
export const isTagId = (id: string): id is TagId => Object.hasOwn(tags, id);
export const isSeriesId = (id: string): id is SeriesId => Object.hasOwn(series, id);
