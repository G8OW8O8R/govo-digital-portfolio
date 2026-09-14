import { createFileRoute } from "@tanstack/react-router";

import ServicesIndexPage from "@/pages/ServicesIndexPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/services/")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["services"]!.en,
      plPath: PAGE_PATHS.services.pl,
      enPath: PAGE_PATHS.services.en,
    }),
  component: ServicesIndexPage,
});
