import { getDictionary, isLocale, type Dictionary } from "@/lib/i18n";
import type { ProfileLocale, ProfileOnlyLocale } from "@/lib/profile-locales";

// The subset of the site dictionary the 2026 profile renders. Site locales
// reuse their dictionary; profile-only locales translate just these labels.
export type Profile2026Labels = Pick<Dictionary,
  "profileNavigationLabel" | "primaryNavigationLabel" | "settingsPanel"
  | "themeToggleToDark" | "themeToggleToLight" | "themeToggleToSystem"> & {
  site: Pick<Dictionary["site"], "title">;
  profilePage: Pick<Dictionary["profilePage"], "description" | "capabilitiesTitle" | "activityLabels">;
};

const profileOnlyLabels: Record<ProfileOnlyLocale, Profile2026Labels> = {
  ko: {
    profileNavigationLabel: "프로필", primaryNavigationLabel: "주요 메뉴",
    settingsPanel: { buttonLabel: "설정", themeLabel: "테마", languageLabel: "언어" },
    themeToggleToDark: "다크", themeToggleToLight: "라이트", themeToggleToSystem: "시스템",
    site: { title: "Nelson Lin" },
    profilePage: {
      description: "엔터프라이즈, 이커머스, 제품 엔지니어링 전반에 걸친 neℓson의 최근 역할, 플랫폼 역량, 주요 프로젝트를 정리했습니다.",
      capabilitiesTitle: "핵심 역량",
      activityLabels: { talks: "발표", certifications: "자격증", sideProjects: "사이드 프로젝트", hackathons: "해커톤" },
    },
  },
  th: {
    profileNavigationLabel: "โปรไฟล์", primaryNavigationLabel: "เมนูหลัก",
    settingsPanel: { buttonLabel: "การตั้งค่า", themeLabel: "ธีม", languageLabel: "ภาษา" },
    themeToggleToDark: "มืด", themeToggleToLight: "สว่าง", themeToggleToSystem: "ตามระบบ",
    site: { title: "Nelson Lin" },
    profilePage: {
      description: "ภาพรวมที่คัดสรรของบทบาทล่าสุด จุดแข็งด้านแพลตฟอร์ม และโปรเจกต์เด่นของ neℓson ในงานวิศวกรรมระดับองค์กร อีคอมเมิร์ซ และผลิตภัณฑ์",
      capabilitiesTitle: "จุดแข็งหลัก",
      activityLabels: { talks: "การบรรยาย", certifications: "ใบรับรอง", sideProjects: "โปรเจกต์ส่วนตัว", hackathons: "แฮกกาธอน" },
    },
  },
  vi: {
    profileNavigationLabel: "Hồ sơ", primaryNavigationLabel: "Điều hướng chính",
    settingsPanel: { buttonLabel: "Cài đặt", themeLabel: "Giao diện", languageLabel: "Ngôn ngữ" },
    themeToggleToDark: "Tối", themeToggleToLight: "Sáng", themeToggleToSystem: "Hệ thống",
    site: { title: "Nelson Lin" },
    profilePage: {
      description: "Tổng quan chọn lọc về các vai trò gần đây, thế mạnh nền tảng và những dự án tiêu biểu của neℓson trong kỹ thuật doanh nghiệp, thương mại điện tử và sản phẩm.",
      capabilitiesTitle: "Thế mạnh cốt lõi",
      activityLabels: { talks: "Bài nói chuyện", certifications: "Chứng chỉ", sideProjects: "Dự án cá nhân", hackathons: "Hackathon" },
    },
  },
  de: {
    profileNavigationLabel: "Profil", primaryNavigationLabel: "Hauptnavigation",
    settingsPanel: { buttonLabel: "Einstellungen", themeLabel: "Design", languageLabel: "Sprache" },
    themeToggleToDark: "Dunkel", themeToggleToLight: "Hell", themeToggleToSystem: "System",
    site: { title: "Nelson Lin" },
    profilePage: {
      description: "Ein kuratierter Überblick über neℓsons aktuelle Rollen, Plattformstärken und ausgewählte Projekte aus Enterprise-, E-Commerce- und Produktentwicklung.",
      capabilitiesTitle: "Kernkompetenzen",
      activityLabels: { talks: "Vorträge", certifications: "Zertifizierungen", sideProjects: "Nebenprojekte", hackathons: "Hackathons" },
    },
  },
};

export function getProfile2026Labels(locale: ProfileLocale): Profile2026Labels {
  return isLocale(locale) ? getDictionary(locale) : profileOnlyLabels[locale];
}
