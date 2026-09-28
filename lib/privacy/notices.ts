import en from "@/data/privacy/en.json";
import zhTw from "@/data/privacy/zh-tw.json";
import zhCn from "@/data/privacy/zh-cn.json";
import ja from "@/data/privacy/ja.json";
import ko from "@/data/privacy/ko.json";
import th from "@/data/privacy/th.json";
import vi from "@/data/privacy/vi.json";
import de from "@/data/privacy/de.json";
import type { ProfileLocale } from "@/lib/profile-locales";

type PrivacyNotice = { updated: string; contact: string; pending: string; sections: string[][] };
export const privacyNotices: Record<ProfileLocale, PrivacyNotice> = { en, "zh-tw": zhTw, "zh-cn": zhCn, ja, ko, th, vi, de };
