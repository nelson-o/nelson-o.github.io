import { buildUrlSetXml, getLocaleSitemapEntries } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildUrlSetXml(getLocaleSitemapEntries("zh-cn")), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
