import { isProfileLocale, type ProfileLocale } from "@/lib/profile-locales";

export type PrivacyCopy = {
  title: string; settings: string; unavailable: string; load: string; comments: string; discussion: string; back: string;
};
export const privacyCopy: Record<ProfileLocale, PrivacyCopy> = {
  en: { title: "Privacy", settings: "Privacy settings", unavailable: "Optional services are currently unavailable. Analytics and embedded comments remain off.", load: "Allow and load comments", comments: "Loading comments connects to Giscus and GitHub and shares your IP address and browser information. This is separate from analytics consent.", discussion: "View discussion on GitHub", back: "Back to profile" },
  "zh-tw": { title: "隱私權", settings: "隱私設定", unavailable: "選用服務目前無法使用。流量分析及嵌入留言維持關閉。", load: "同意並載入留言", comments: "載入留言會連線至 Giscus 和 GitHub，並傳送您的 IP 位址與瀏覽器資訊。此選擇與流量分析同意分開。", discussion: "前往 GitHub 討論", back: "返回個人簡介" },
  "zh-cn": { title: "隐私", settings: "隐私设置", unavailable: "可选服务目前不可用。流量分析和嵌入评论保持关闭。", load: "同意并加载评论", comments: "加载评论会连接到 Giscus 和 GitHub，并发送您的 IP 地址及浏览器信息。此选择与流量分析同意分开。", discussion: "前往 GitHub 讨论", back: "返回个人简介" },
  ja: { title: "プライバシー", settings: "プライバシー設定", unavailable: "任意のサービスは現在利用できません。アクセス解析と埋め込みコメントは無効です。", load: "同意してコメントを表示", comments: "コメントを表示すると Giscus と GitHub に接続し、IP アドレスとブラウザー情報を送信します。アクセス解析への同意とは別の選択です。", discussion: "GitHub で議論を見る", back: "プロフィールに戻る" },
  ko: { title: "개인정보 보호", settings: "개인정보 설정", unavailable: "선택 서비스는 현재 사용할 수 없습니다. 분석 및 삽입 댓글은 꺼져 있습니다.", load: "동의하고 댓글 불러오기", comments: "댓글을 불러오면 Giscus 및 GitHub에 연결되어 IP 주소와 브라우저 정보가 전송됩니다. 분석 동의와는 별개입니다.", discussion: "GitHub에서 토론 보기", back: "프로필로 돌아가기" },
  th: { title: "ความเป็นส่วนตัว", settings: "ตั้งค่าความเป็นส่วนตัว", unavailable: "บริการเสริมยังไม่พร้อมใช้งาน การวิเคราะห์และความคิดเห็นแบบฝังยังคงปิดอยู่", load: "ยินยอมและโหลดความคิดเห็น", comments: "การโหลดความคิดเห็นจะเชื่อมต่อกับ Giscus และ GitHub และส่งที่อยู่ IP และข้อมูลเบราว์เซอร์ของคุณ โดยแยกจากความยินยอมด้านการวิเคราะห์", discussion: "ดูการสนทนาบน GitHub", back: "กลับสู่โปรไฟล์" },
  vi: { title: "Quyền riêng tư", settings: "Cài đặt quyền riêng tư", unavailable: "Các dịch vụ tùy chọn hiện không khả dụng. Phân tích và bình luận nhúng vẫn tắt.", load: "Đồng ý và tải bình luận", comments: "Tải bình luận sẽ kết nối với Giscus và GitHub, gửi địa chỉ IP và thông tin trình duyệt của bạn. Lựa chọn này độc lập với sự đồng ý phân tích.", discussion: "Xem thảo luận trên GitHub", back: "Quay lại hồ sơ" },
  de: { title: "Datenschutz", settings: "Datenschutzeinstellungen", unavailable: "Optionale Dienste sind derzeit nicht verfügbar. Analyse und eingebettete Kommentare bleiben ausgeschaltet.", load: "Zustimmen und Kommentare laden", comments: "Beim Laden der Kommentare werden Ihre IP-Adresse und Browserinformationen an Giscus und GitHub übermittelt. Diese Entscheidung ist unabhängig von der Analyse-Einwilligung.", discussion: "Diskussion auf GitHub ansehen", back: "Zurück zum Profil" },
};

export function privacyLocale(path: string): ProfileLocale {
  const locale = path.split("/")[1];
  return isProfileLocale(locale) ? locale : "en";
}
export function consentCulture(locale: ProfileLocale) {
  return locale === "zh-tw" ? "ZH-HANT" : locale === "zh-cn" ? "ZH" : locale.toUpperCase();
}
