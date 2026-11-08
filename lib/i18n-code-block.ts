import type { Locale } from "@/lib/i18n";

const copy = {
  en: { plain: "Plain text", copy: "Copy code", success: "Copied.", failure: "Could not copy. Select and copy the code manually." },
  "zh-tw": { plain: "純文字", copy: "複製程式碼", success: "已複製。", failure: "無法複製，請選取程式碼並手動複製。" },
  "zh-cn": { plain: "纯文本", copy: "复制代码", success: "已复制。", failure: "无法复制，请选中代码并手动复制。" },
  ja: { plain: "プレーンテキスト", copy: "コードをコピー", success: "コピーしました。", failure: "コピーできませんでした。コードを選択して手動でコピーしてください。" },
} satisfies Record<Locale, { plain: string; copy: string; success: string; failure: string }>;

export const getCodeBlockCopy = (locale: Locale) => copy[locale];
