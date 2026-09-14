import { createFileRoute } from "@tanstack/react-router";

import HomePage from "@/pages/HomePage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["home"]!.en,
      plPath: PAGE_PATHS.home.pl,
      enPath: PAGE_PATHS.home.en,
    }),
  component: HomePage,
});
