import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import type { ProfileOnlyLocale } from "@/lib/profile-locales";

// Copy for languages that exist only on the 2026 profile. Kept apart from the
// site-locale copy so each module stays reviewable.
const ko: Profile2026Copy = {
  tagline: "아이디어에서 임팩트로", heroTopics: ["시스템", "사람", "제품", "더 나은 웹"], since: "2010년부터",
  preview: "2026 · 미리보기", previewNote: "새로운 관점이 모습을 갖춰 가고 있습니다.", stable: "현재 프로필 보기",
  site: "사이트 둘러보기", skip: "본문으로 건너뛰기",
  nav: ["소개", "경력", "프로젝트", "발표", "연락처"],
  eyebrow: "엔지니어링으로 더 나은 웹을", headline: ["더 나은", "웹 경험을 만듭니다."],
  introduction: "저는 Nelson입니다.", contact: "연락하기", experience: "경력",
  history: "전체 경력 보기", present: "현재", projects: "주요 프로젝트",
  projectDetails: "자세히 보기", beyond: "업무 외 활동", approach: "나의 방식",
  manifesto: ["시스템을 만듭니다.", "사람들의 역량을 키웁니다.", "더 나은 웹을 전합니다."],
  approachQuote: ["더 나은 도구.", "더 행복한 팀.", "더 빠른 웹."],
  approachMotto: ["만들기", "배우기", "나누기", "반복하기"],
  principles: ["만들기", "배우기", "나누기"], footer: "더 나은 내일을 위한 시스템",
  portrait: "Nelson의 프로필 사진", categories: { platform: "플랫폼", "developer-tools": "개발자 도구", observability: "관측 가능성" },
};

const th: Profile2026Copy = {
  tagline: "จากไอเดียสู่ผลลัพธ์", heroTopics: ["ระบบ", "ผู้คน", "ผลิตภัณฑ์", "เว็บที่ดีกว่า"], since: "ตั้งแต่ปี 2010",
  preview: "2026 · ตัวอย่าง", previewNote: "มุมมองใหม่ที่กำลังก่อตัวขึ้น", stable: "ดูโปรไฟล์ปัจจุบัน",
  site: "สำรวจเว็บไซต์", skip: "ข้ามไปยังเนื้อหา",
  nav: ["เกี่ยวกับ", "ประสบการณ์", "โปรเจกต์", "การบรรยาย", "ติดต่อ"],
  eyebrow: "วิศวกรรมเพื่อเว็บที่ดีกว่า", headline: ["สร้างประสบการณ์", "เว็บที่ดีกว่า"],
  introduction: "นี่คือ Nelson", contact: "ติดต่อ", experience: "ประสบการณ์",
  history: "ดูประวัติทั้งหมด", present: "ปัจจุบัน", projects: "โปรเจกต์ที่คัดสรร",
  projectDetails: "ดูรายละเอียดงาน", beyond: "นอกเหนือจากงาน", approach: "แนวทางการทำงาน",
  manifesto: ["สร้างระบบ", "เสริมพลังให้ผู้คน", "ส่งมอบเว็บที่ดีกว่า"],
  approachQuote: ["เครื่องมือที่ดีกว่า", "ทีมที่มีความสุขกว่า", "เว็บที่เร็วกว่า"],
  approachMotto: ["สร้าง", "เรียนรู้", "แบ่งปัน", "ทำซ้ำ"],
  principles: ["สร้าง", "เรียนรู้", "แบ่งปัน"], footer: "ระบบเพื่อวันพรุ่งนี้ที่ดีกว่า",
  portrait: "รูปโปรไฟล์ของ Nelson", categories: { platform: "แพลตฟอร์ม", "developer-tools": "เครื่องมือนักพัฒนา", observability: "การสังเกตการณ์ระบบ" },
};

const vi: Profile2026Copy = {
  tagline: "Từ ý tưởng đến tác động", heroTopics: ["Hệ thống", "Con người", "Sản phẩm", "Một web tốt hơn"], since: "Từ năm 2010",
  preview: "2026 · Xem trước", previewNote: "Một góc nhìn mới đang dần thành hình.", stable: "Xem hồ sơ hiện tại",
  site: "Khám phá trang web", skip: "Chuyển đến nội dung",
  nav: ["Giới thiệu", "Kinh nghiệm", "Dự án", "Bài nói", "Liên hệ"],
  eyebrow: "Kỹ thuật cho một web tốt đẹp hơn", headline: ["Xây dựng trải nghiệm", "web tốt hơn."],
  introduction: "Tôi là Nelson,", contact: "Liên hệ", experience: "Kinh nghiệm",
  history: "Xem toàn bộ quá trình", present: "Hiện tại", projects: "Dự án tiêu biểu",
  projectDetails: "Tìm hiểu dự án", beyond: "Ngoài công việc", approach: "Cách tiếp cận",
  manifesto: ["Xây dựng hệ thống.", "Phát huy con người.", "Mang đến web tốt hơn."],
  approachQuote: ["Công cụ tốt hơn.", "Đội ngũ hạnh phúc hơn.", "Web nhanh hơn."],
  approachMotto: ["Xây dựng", "Học hỏi", "Chia sẻ", "Lặp lại"],
  principles: ["Xây dựng", "Học hỏi", "Chia sẻ"], footer: "Hệ thống cho một ngày mai tốt đẹp hơn",
  portrait: "Ảnh hồ sơ của Nelson", categories: { platform: "Nền tảng", "developer-tools": "Công cụ phát triển", observability: "Khả năng quan sát" },
};

const de: Profile2026Copy = {
  tagline: "Von der Idee zur Wirkung", heroTopics: ["Systeme", "Menschen", "Produkte", "Ein besseres Web"], since: "Seit 2010",
  preview: "2026 · Vorschau", previewNote: "Eine neue Perspektive nimmt Gestalt an.", stable: "Aktuelles Profil ansehen",
  site: "Website entdecken", skip: "Zum Inhalt springen",
  nav: ["Über mich", "Erfahrung", "Projekte", "Vorträge", "Kontakt"],
  eyebrow: "Engineering für ein besseres Web", headline: ["Bessere", "Web-Erlebnisse schaffen."],
  introduction: "Ich bin Nelson,", contact: "Kontakt aufnehmen", experience: "Erfahrung",
  history: "Gesamten Werdegang ansehen", present: "Heute", projects: "Ausgewählte Projekte",
  projectDetails: "Mehr zum Projekt", beyond: "Neben der Arbeit", approach: "Mein Ansatz",
  manifesto: ["Systeme bauen.", "Menschen stärken.", "Ein besseres Web liefern."],
  approachQuote: ["Bessere Tools.", "Glücklichere Teams.", "Ein schnelleres Web."],
  approachMotto: ["Bauen", "Lernen", "Teilen", "Wiederholen"],
  principles: ["Bauen", "Lernen", "Teilen"], footer: "Systeme für ein besseres Morgen",
  portrait: "Profilfoto von Nelson", categories: { platform: "Plattform", "developer-tools": "Entwicklerwerkzeuge", observability: "Beobachtbarkeit" },
};

export const profileOnlyCopy: Record<ProfileOnlyLocale, Profile2026Copy> = { ko, th, vi, de };
