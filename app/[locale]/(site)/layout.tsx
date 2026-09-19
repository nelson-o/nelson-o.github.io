import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SiteShell locale={locale} dictionary={getDictionary(locale)}>{children}</SiteShell>;
}
