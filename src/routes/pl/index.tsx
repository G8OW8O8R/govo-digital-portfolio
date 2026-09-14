import { createFileRoute } from "@tanstack/react-router";

import HomePage from "@/pages/HomePage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/pl/")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["home"]!.pl,
      plPath: PAGE_PATHS.home.pl,
      enPath: PAGE_PATHS.home.en,
    }),
  component: HomePage,
});
