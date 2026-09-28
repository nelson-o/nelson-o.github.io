import Link from "next/link";
import { notFound } from "next/navigation";
import { isProfileLocale, profileLocales, profileLanguageNames, getProfileHrefLang } from "@/lib/profile-locales";
import { privacyConfig } from "@/lib/privacy/config";
import { privacyCopy } from "@/lib/privacy/copy";
import { privacyNotices } from "@/lib/privacy/notices";
import styles from "@/components/privacy/privacy.module.css";

type Props = { params: Promise<{ locale: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return profileLocales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isProfileLocale(locale)) return {};
  return {
    title: `${privacyCopy[locale].title} — Nelson Lin`,
    alternates: {
      canonical: `/${locale}/privacy/`,
      languages: Object.fromEntries(profileLocales.map((item) => [getProfileHrefLang(item), `/${item}/privacy/`])),
    },
  };
}
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isProfileLocale(locale)) notFound();
  const copy = privacyCopy[locale];
  const notice = privacyNotices[locale];
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyConfig.contact) ? privacyConfig.contact : "";
  return (
    <main className={styles.notice}>
      <Link href={`/${locale}/profile/`}>{copy.back}</Link>
      <h1>{copy.title}</h1>
      <p>{notice.updated}</p>
      <nav aria-label={copy.title}>
        {profileLocales.map((item) => <Link key={item} href={`/${item}/privacy/`} hrefLang={getProfileHrefLang(item)} aria-current={item === locale ? "page" : undefined}>{profileLanguageNames[item]}</Link>)}
      </nav>
      <h2>{notice.contact}</h2>
      {email ? <a href={`mailto:${email}`}>{email}</a> : <p>{notice.pending}</p>}
      {notice.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
      <nav aria-label="Provider policies">
        <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noreferrer">GitHub</a>
        <a href="https://business.safety.google/privacy/" rel="noreferrer">Google</a>
        <a href="https://www.cookiebot.com/en/privacy-policy/" rel="noreferrer">Cookiebot</a>
        <a href="https://github.com/giscus/giscus/blob/main/PRIVACY-POLICY.md" rel="noreferrer">Giscus</a>
      </nav>
    </main>
  );
}
