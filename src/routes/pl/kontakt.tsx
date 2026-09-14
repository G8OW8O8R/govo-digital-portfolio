import { createFileRoute } from "@tanstack/react-router";

import ContactPage from "@/pages/ContactPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/pl/kontakt")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["contact"]!.pl,
      plPath: PAGE_PATHS.contact.pl,
      enPath: PAGE_PATHS.contact.en,
    }),
  component: ContactPage,
});
