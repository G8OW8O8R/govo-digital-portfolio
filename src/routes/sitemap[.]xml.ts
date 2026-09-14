import { createFileRoute } from "@tanstack/react-router";

import { PAGE_PATHS, type PageKey } from "@/lib/i18n-routes";
import { SERVICE_KEYS, SERVICE_SLUGS } from "@/content/services";
import { BLOG_CATEGORY_KEYS, BLOG_CATEGORY_SLUGS, BLOG_POSTS } from "@/content/blog";

type Entry = { pl: string; en: string; priority: string; plOnly?: boolean };

const PAGE_PRIORITY: Record<PageKey, string> = {
  home: "1.0",
  services: "0.9",
  projects: "0.8",
  blog: "0.8",
  about: "0.7",
  skills: "0.7",
  process: "0.7",
  contact: "0.7",
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;

        const entries: Entry[] = (Object.keys(PAGE_PATHS) as PageKey[]).map((key) => ({
          pl: PAGE_PATHS[key].pl,
          en: PAGE_PATHS[key].en,
          priority: PAGE_PRIORITY[key],
        }));

        for (const key of SERVICE_KEYS) {
          entries.push({
            pl: `${PAGE_PATHS.services.pl}/${SERVICE_SLUGS[key].pl}`,
            en: `${PAGE_PATHS.services.en}/${SERVICE_SLUGS[key].en}`,
            priority: "0.8",
          });
        }

        entries.push({
          pl: `${PAGE_PATHS.services.pl}/cennik`,
          en: `${PAGE_PATHS.services.en}/pricing`,
          priority: "0.9",
        });

        entries.push({
          pl: "/pl/strony-internetowe-warszawa",
          en: "/pl/strony-internetowe-warszawa",
          priority: "0.9",
          plOnly: true,
        });

        for (const key of BLOG_CATEGORY_KEYS) {
          entries.push({
            pl: `${PAGE_PATHS.blog.pl}/kategoria/${BLOG_CATEGORY_SLUGS[key].pl}`,
            en: `${PAGE_PATHS.blog.en}/category/${BLOG_CATEGORY_SLUGS[key].en}`,
            priority: "0.7",
          });
        }

        for (const post of BLOG_POSTS) {
          entries.push({
            pl: `${PAGE_PATHS.blog.pl}/${post.pl.slug}`,
            en: `${PAGE_PATHS.blog.en}/${post.en.slug}`,
            priority: "0.7",
          });
        }



        const urls = entries
          .flatMap(({ pl, en, priority, plOnly }) =>
            (plOnly ? (["pl"] as const) : (["pl", "en"] as const)).map(
              (lang) => `
  <url>
    <loc>${origin}${lang === "pl" ? pl : en}</loc>${
      plOnly
        ? ""
        : `
    <xhtml:link rel="alternate" hreflang="pl" href="${origin}${pl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${origin}${en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${en}" />`
    }
    <priority>${priority}</priority>
  </url>`,
            ),
          )
          .join("");


        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
