import { createFileRoute } from "@tanstack/react-router";

import BlogIndexPage from "@/pages/BlogIndexPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/pl/blog/")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["blog"]!.pl,
      plPath: PAGE_PATHS.blog.pl,
      enPath: PAGE_PATHS.blog.en,
    }),
  component: BlogIndexPage,
});
