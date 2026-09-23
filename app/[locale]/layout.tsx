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

  return children;
}
