import { buildSitemapIndexXml, getSitemapIndexEntries } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildSitemapIndexXml(getSitemapIndexEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
