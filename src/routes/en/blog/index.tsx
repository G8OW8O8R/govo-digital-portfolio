import { createFileRoute } from "@tanstack/react-router";

import BlogIndexPage from "@/pages/BlogIndexPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/blog/")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["blog"]!.en,
      plPath: PAGE_PATHS.blog.pl,
      enPath: PAGE_PATHS.blog.en,
    }),
  component: BlogIndexPage,
});
