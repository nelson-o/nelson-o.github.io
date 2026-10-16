import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

import { isProfileLocale } from "@/lib/profile-locales";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Site locales plus profile-only ones; nested routes enforce their own sets.
  if (!isProfileLocale(locale)) {
    notFound();
  }

  return <>
    {isLocale(locale) && <link rel="alternate" type="application/rss+xml" title="RSS" href={`/${locale}/feed.xml`} />}
    {children}
  </>;
}
