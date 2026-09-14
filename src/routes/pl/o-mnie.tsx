import { createFileRoute } from "@tanstack/react-router";

import AboutPage from "@/pages/AboutPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/pl/o-mnie")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["about"]!.pl,
      plPath: PAGE_PATHS.about.pl,
      enPath: PAGE_PATHS.about.en,
    }),
  component: AboutPage,
});
