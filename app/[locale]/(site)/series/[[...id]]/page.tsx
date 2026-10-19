import { notFound } from "next/navigation";
import { ArchivePage } from "@/components/layout/archive-page";
import { getArchive, getArchiveMetadata, getArchivePaths } from "@/lib/archives";
import { isLocale, locales } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; id?: string[] }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getArchivePaths(locale)
    .filter((path) => path === "/series" || path.startsWith("/series/"))
    .map((path) => ({ locale, id: path.split("/").slice(2) })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  return isLocale(locale) && (!id || id.length <= 1) ? getArchiveMetadata(locale, "series", id?.[0]) : {};
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale) || (id && id.length > 1)) notFound();
  const archive = getArchive(locale, "series", id?.[0]);
  if (!archive) notFound();
  return <ArchivePage locale={locale} kind="series" id={id?.[0]} archive={archive} />;
}
